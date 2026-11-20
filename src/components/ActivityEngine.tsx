import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MoveUp,
  MoveDown,
  Check,
  Award
} from 'lucide-react';
import { Dimension, GameActivity } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { useIs3D } from '../three/prefs';
import { useScene } from '../three/store';

interface ActivityEngineProps {
  dimension: Dimension;
  activityIndex: number;
  onActivityComplete: (activityId: string, xpEarned: number) => void;
  onPreviousActivity?: () => void;
  /** Ampliación: guarda la reflexión escrita para mostrarla en el diario. */
  onSaveAnswer?: (activityId: string, text: string) => void;
  onBackToMap: () => void;
  isLastActivity: boolean;
}

export const ActivityEngine: React.FC<ActivityEngineProps> = ({
  dimension,
  activityIndex,
  onActivityComplete,
  onSaveAnswer,
  onBackToMap,
  isLastActivity
}) => {
  const activity = dimension.activities[activityIndex];

  // Common Feedback State
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Mechanic-specific states
  // 1. Multiple Choice
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 2. Matching
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // 3. Ordering
  const [orderedItems, setOrderedItems] = useState(() => {
    if (activity.type === 'ordering') {
      // Shuffle initially
      return [...activity.items].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  // 4. True/False
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});

  // 5. Fill blank
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);

  // 6. Detect clues
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [activeClueInfo, setActiveClueInfo] = useState<{ name: string; symbolism: string } | null>(null);

  // 7. Choose objects
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);

  // 8. Decision
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  // 9. Reflection
  const [reflectionText, setReflectionText] = useState<string>('');

  // Reset local state when activityIndex changes
  React.useEffect(() => {
    setFeedbackState('idle');
    setFeedbackMsg('');
    setSelectedOption(null);
    setMatchingSelections({});
    setSelectedLeft(null);
    if (activity.type === 'ordering') {
      setOrderedItems([...activity.items].sort(() => Math.random() - 0.5));
    }
    setTfAnswers({});
    setSelectedBlank(null);
    setDiscoveredClues([]);
    setActiveClueInfo(null);
    setSelectedObjectIds([]);
    setSelectedDecision(null);
    setReflectionText('');
  }, [activity.id]);

  // Validation Handlers
  const handleValidateMultipleChoice = () => {
    if (selectedOption === null) return;
    if (activity.type !== 'multiple_choice') return;

    if (selectedOption === activity.correctIndex) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleSelectMatchingLeft = (leftId: string) => {
    sound.playClick();
    setSelectedLeft(leftId);
  };

  const handleSelectMatchingRight = (rightText: string) => {
    if (!selectedLeft) return;
    sound.playClick();
    setMatchingSelections((prev) => ({
      ...prev,
      [selectedLeft]: rightText
    }));
    setSelectedLeft(null);
  };

  const handleValidateMatching = () => {
    if (activity.type !== 'matching') return;
    const isAllMatched = activity.pairs.every((pair) => matchingSelections[pair.id] === pair.right);

    if (isAllMatched) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleMoveOrderItem = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newItems = [...orderedItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setOrderedItems(newItems);
  };

  const handleValidateOrdering = () => {
    if (activity.type !== 'ordering') return;
    const isCorrect = orderedItems.every((item, idx) => item.correctOrder === idx + 1);

    if (isCorrect) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleSetTfAnswer = (statementId: string, val: boolean) => {
    sound.playClick();
    setTfAnswers((prev) => ({ ...prev, [statementId]: val }));
  };

  const handleValidateTrueFalse = () => {
    if (activity.type !== 'true_false') return;
    const allAnswered = activity.statements.every((s) => tfAnswers[s.id] !== undefined);
    if (!allAnswered) {
      setFeedbackMsg('Por favor responde a todas las afirmaciones antes de validar.');
      setFeedbackState('failure');
      return;
    }

    const isAllCorrect = activity.statements.every((s) => tfAnswers[s.id] === s.isTrue);
    if (isAllCorrect) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleValidateFillBlank = () => {
    if (activity.type !== 'fill_blank') return;
    if (selectedBlank === activity.blankAnswer) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleClickClue = (clueId: string) => {
    if (activity.type !== 'detect_clues') return;
    sound.playClick();
    const clue = activity.clues.find((c) => c.id === clueId);
    if (clue) {
      setActiveClueInfo({ name: clue.name, symbolism: clue.symbolism });
    }
    if (!discoveredClues.includes(clueId)) {
      const updated = [...discoveredClues, clueId];
      setDiscoveredClues(updated);
      if (updated.length >= activity.requiredCount) {
        sound.playCorrect();
        setFeedbackState('success');
        setFeedbackMsg(activity.explanation);
      }
    }
  };

  const handleToggleObject = (id: string) => {
    sound.playClick();
    setSelectedObjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleValidateObjects = () => {
    if (activity.type !== 'choose_objects') return;
    const required = activity.requiredIds;
    const hasAllRequired =
      required.every((r) => selectedObjectIds.includes(r)) &&
      selectedObjectIds.length === required.length;

    if (hasAllRequired) {
      sound.playCorrect();
      setFeedbackState('success');
      setFeedbackMsg(activity.explanation);
    } else {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(activity.hint);
    }
  };

  const handleSelectDecision = (decId: string) => {
    sound.playClick();
    setSelectedDecision(decId);
  };

  const handleValidateDecision = () => {
    if (activity.type !== 'decision') return;
    if (!selectedDecision) return;
    // Corrección: antes cualquier opción se daba por buena. La interpretación
    // fundamentada es la primera de los datos; las otras explican por qué no bastan.
    const elegida = activity.options.find((o) => o.id === selectedDecision);
    if (elegida && elegida.id !== activity.options[0].id) {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(`${elegida.literaryWeight} Vuelve a leer la situación y prueba con otra clave.`);
      return;
    }
    sound.playCorrect();
    setFeedbackState('success');
    setFeedbackMsg(activity.explanation);
  };

  const handleValidateReflection = () => {
    if (activity.type !== 'reflection') return;
    const words = reflectionText.trim().split(/\s+/).filter(Boolean).length;
    if (words < activity.minWords) {
      sound.playError();
      setFeedbackState('failure');
      setFeedbackMsg(
        `Tu reflexión actual tiene ${words} palabras. El cazador requiere un análisis de al menos ${activity.minWords} palabras.`
      );
      return;
    }

    sound.playCorrect();
    onSaveAnswer?.(activity.id, reflectionText.trim());
    setFeedbackState('success');
    setFeedbackMsg(activity.explanation);
  };

  const handleAdvance = () => {
    sound.playClick();
    onActivityComplete(activity.id, activity.xpReward);
  };

  const handleRetry = () => {
    sound.playClick();
    setFeedbackState('idle');
    setFeedbackMsg('');
  };

  // --- Presentación 3D: la escena refleja este estado y avisa de los clics ---
  const is3d = useIs3D();
  const sceneInteractive = activity.type === 'detect_clues' || activity.type === 'choose_objects';
  const sceneHandlers = React.useRef({ onClue: handleClickClue, onObject: handleToggleObject });
  sceneHandlers.current = { onClue: handleClickClue, onObject: handleToggleObject };

  React.useEffect(() => {
    useScene.setState({ activity, feedback: feedbackState, discoveredClues, selectedObjects: selectedObjectIds });
  }, [activity, feedbackState, discoveredClues, selectedObjectIds]);

  React.useEffect(() => {
    useScene.setState((state) => ({
      handlers: {
        ...state.handlers,
        onClue: (id: string) => sceneHandlers.current.onClue(id),
        onObject: (id: string) => sceneHandlers.current.onObject(id)
      }
    }));
    return () => {
      useScene.setState((state) => ({
        activity: null,
        feedback: 'idle',
        discoveredClues: [],
        selectedObjects: [],
        handlers: { ...state.handlers, onClue: undefined, onObject: undefined }
      }));
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 overflow-x-hidden ${
        is3d ? 'bg-transparent' : 'bg-slate-950'
      }`}
    >
      {/* Top HUD: Navigation & Progress */}
      <div data-ui className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-4 sm:pr-40">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/40 text-cyan-300 font-rajdhani font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>MAPA DE DIMENSIONES</span>
        </button>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-cyan-500/30 px-4 py-1.5 rounded-xl">
          <div className="text-xs font-rajdhani text-slate-300">
            DESAFÍO <span className="font-bold text-cyan-400">{activityIndex + 1}</span> DE{' '}
            <span className="font-bold text-slate-200">{dimension.activities.length}</span>
          </div>
          <div className="w-24 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${((activityIndex + 1) / dimension.activities.length) * 100}%`
              }}
            />
          </div>
          <span className="text-xs font-rajdhani font-bold text-amber-400">+{activity.xpReward} XP</span>
        </div>

        {/* Dimension Title Pill */}
        <div className="hidden md:block text-right">
          <span className="text-[10px] font-rajdhani tracking-widest text-cyan-400 uppercase font-semibold">
            Dimensión Activa
          </span>
          <p className="text-xs font-cinzel font-bold text-slate-200 truncate max-w-xs">{dimension.title}</p>
        </div>
      </div>

      {/* Main Activity Stage */}
      <div
        className={
          is3d
            ? 'relative z-10 flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:items-stretch my-auto'
            : 'relative z-10 flex-1 max-w-4xl mx-auto w-full flex flex-col justify-center my-auto'
        }
      >
        {/* 3D: hueco por el que se ve (y se toca) el escenario de la dimensión */}
        {is3d && (
          <div
            data-scene-window
            className={`min-h-[36vh] lg:min-h-[72vh] ${sceneInteractive ? 'lg:col-span-7' : 'lg:col-span-5'}`}
          />
        )}
        <div
          data-ui
          className={`relative rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-b from-slate-900/95 via-[#0b1222]/95 to-slate-950/95 p-4 sm:p-7 shadow-2xl shadow-cyan-950/50 backdrop-blur ${
            is3d ? `self-center ${sceneInteractive ? 'lg:col-span-5' : 'lg:col-span-7'}` : ''
          }`}
        >
          {/* Header */}
          <div className="mb-5 pb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-rajdhani tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Desafío Interactivo · {activity.type.replace('_', ' ')}</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wide">
              {activity.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              {activity.instruction}
            </p>
          </div>

          {/* DYNAMIC ACTIVITY RENDER */}
          <div className="py-2">
            {/* 1. MULTIPLE CHOICE */}
            {activity.type === 'multiple_choice' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-slate-100 font-medium text-sm sm:text-base leading-relaxed">
                  {activity.question}
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {activity.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(idx);
                        }}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-rajdhani font-bold text-sm shrink-0 ${
                            isSelected
                              ? 'bg-cyan-500 text-black'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {letters[idx]}
                        </span>
                        <span className="text-xs sm:text-sm mt-0.5 leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedOption === null}
                    onClick={handleValidateMultipleChoice}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    CONFIRMAR RESPUESTA
                  </button>
                </div>
              </div>
            )}

            {/* 2. MATCHING */}
            {activity.type === 'matching' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-cyan-300 font-rajdhani font-semibold">
                  {activity.prompt}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                      Personaje / Elemento (Paso 1)
                    </span>
                    {activity.pairs.map((pair) => {
                      const isSelected = selectedLeft === pair.id;
                      const isMatched = matchingSelections[pair.id] !== undefined;
                      return (
                        <button
                          key={pair.id}
                          onClick={() => handleSelectMatchingLeft(pair.id)}
                          className={`w-full p-3 rounded-xl border text-left font-rajdhani font-bold text-sm transition-all cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200 ring-2 ring-cyan-400'
                              : isMatched
                              ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                              : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/40'
                          }`}
                        >
                          <span>{pair.left}</span>
                          {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <span className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                      Reacción / Consecuencia (Paso 2)
                    </span>
                    {/* Corrección: se ordena alfabéticamente para que la posición no delate la pareja */}
                    {[...activity.pairs].sort((a, b) => a.right.localeCompare(b.right)).map((pair) => {
                      const isUsed = Object.values(matchingSelections).includes(pair.right);
                      return (
                        <button
                          key={pair.id}
                          disabled={!selectedLeft && !isUsed}
                          onClick={() => handleSelectMatchingRight(pair.right)}
                          className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                            isUsed
                              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                              : selectedLeft
                              ? 'border-cyan-500/40 bg-cyan-950/20 text-slate-200 hover:border-cyan-400 hover:bg-cyan-900/30'
                              : 'border-slate-800 bg-slate-900/30 text-slate-400'
                          }`}
                        >
                          {pair.right}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setMatchingSelections({});
                      setSelectedLeft(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white text-xs font-rajdhani"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Emparejamientos</span>
                  </button>

                  <button
                    disabled={Object.keys(matchingSelections).length < activity.pairs.length}
                    onClick={handleValidateMatching}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    VALIDAR RELACIONES
                  </button>
                </div>
              </div>
            )}

            {/* 3. ORDERING */}
            {activity.type === 'ordering' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-cyan-300 font-rajdhani font-semibold">
                  {activity.prompt}
                </p>
                <div className="space-y-2">
                  {orderedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-rajdhani font-bold text-sm flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{item.text}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrderItem(idx, 'up')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Subir"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === orderedItems.length - 1}
                          onClick={() => handleMoveOrderItem(idx, 'down')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Bajar"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleValidateOrdering}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    COMPROBAR ORDEN CRONOLÓGICO
                  </button>
                </div>
              </div>
            )}

            {/* 4. TRUE / FALSE */}
            {activity.type === 'true_false' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {activity.statements.map((stmt, idx) => {
                    const ans = tfAnswers[stmt.id];
                    return (
                      <div
                        key={stmt.id}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5"
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                          <span className="font-bold text-cyan-400 font-rajdhani mr-2">{idx + 1}.</span>
                          {stmt.statement}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSetTfAnswer(stmt.id, true)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all cursor-pointer ${
                              ans === true
                                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            VERDADERO
                          </button>
                          <button
                            onClick={() => handleSetTfAnswer(stmt.id, false)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all cursor-pointer ${
                              ans === false
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            FALSO
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleValidateTrueFalse}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    EVALUAR AFIRMACIONES
                  </button>
                </div>
              </div>
            )}

            {/* 5. FILL BLANK */}
            {activity.type === 'fill_blank' && (
              <div className="space-y-5">
                <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-slate-100 font-serif text-base sm:text-lg leading-loose">
                  {activity.preText}{' '}
                  <span className="inline-block px-3 py-1 mx-1.5 rounded-lg border-2 border-dashed border-cyan-400 bg-slate-900 text-cyan-300 font-bold min-w-36 text-center">
                    {selectedBlank || '... [Seleccionar] ...'}
                  </span>{' '}
                  {activity.postText}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 font-bold">
                    Elige el término correspondiente:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activity.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          sound.playClick();
                          setSelectedBlank(opt);
                        }}
                        className={`p-3 rounded-xl border font-rajdhani font-bold text-sm tracking-wide text-left transition-all cursor-pointer ${
                          selectedBlank === opt
                            ? 'border-cyan-400 bg-cyan-950/60 text-cyan-100 ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!selectedBlank}
                    onClick={handleValidateFillBlank}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    COMPLETAR FRAGMENTO
                  </button>
                </div>
              </div>
            )}

            {/* 6. DETECT CLUES */}
            {activity.type === 'detect_clues' && (
              <div className="space-y-4">
                {is3d ? (
                  /* 3D: las pistas son objetos del escenario; esta lista es su equivalente accesible */
                  <div className="space-y-3">
                    <div className="inline-block px-3 py-1 rounded-lg bg-black/80 backdrop-blur border border-cyan-500/30 text-xs font-rajdhani text-cyan-300 font-bold">
                      PISTAS DESCUBIERTAS: {discoveredClues.length} / {activity.requiredCount}
                    </div>
                    <p className="text-[11px] text-slate-400 font-rajdhani">
                      Toca los objetos señalados en la habitación o usa esta lista.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {activity.clues.map((clue) => {
                        const isFound = discoveredClues.includes(clue.id);
                        return (
                          <button
                            key={clue.id}
                            onClick={() => handleClickClue(clue.id)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left font-rajdhani font-bold text-sm cursor-pointer transition-all ${
                              isFound
                                ? 'border-emerald-400/70 bg-emerald-950/40 text-emerald-200'
                                : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-100 hover:border-cyan-300 hover:bg-cyan-900/30'
                            }`}
                          >
                            <span
                              className={`p-1 rounded-full border ${
                                isFound ? 'bg-emerald-500/80 text-black border-emerald-300' : 'bg-cyan-500/40 border-cyan-300'
                              }`}
                            >
                              {isFound ? <Check className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                            </span>
                            <span>{clue.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 aspect-video bg-black group">
                  <img
                    src={activity.sceneImage}
                    alt="Escenario de pistas"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

                  {/* Hotspots */}
                  {activity.clues.map((clue) => {
                    const isFound = discoveredClues.includes(clue.id);
                    return (
                      <button
                        key={clue.id}
                        onClick={() => handleClickClue(clue.id)}
                        style={{
                          left: `${clue.xPercent}%`,
                          top: `${clue.yPercent}%`
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all ${
                          isFound
                            ? 'bg-emerald-500/80 text-black border-2 border-emerald-300 shadow-lg shadow-emerald-500/50 scale-110'
                            : 'bg-cyan-500/40 hover:bg-cyan-400 text-white border-2 border-cyan-300 animate-pulse'
                        }`}
                        title={clue.name}
                      >
                        {isFound ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <HelpCircle className="w-4 h-4" />
                        )}
                      </button>
                    );
                  })}

                  <div className="absolute bottom-2 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur border border-cyan-500/30 text-xs font-rajdhani text-cyan-300 font-bold">
                    PISTAS DESCUBIERTAS: {discoveredClues.length} / {activity.requiredCount}
                  </div>
                </div>
                )}

                {/* Active Clue Info Box */}
                {activeClueInfo && (
                  <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30">
                    <div className="text-xs font-rajdhani font-bold text-cyan-400 uppercase tracking-wider">
                      {activeClueInfo.name}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1">{activeClueInfo.symbolism}</p>
                  </div>
                )}
              </div>
            )}

            {/* 7. CHOOSE OBJECTS */}
            {activity.type === 'choose_objects' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-cyan-300 font-rajdhani font-semibold">
                  {activity.prompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activity.objects.map((obj) => {
                    const isSelected = selectedObjectIds.includes(obj.id);
                    return (
                      <button
                        key={obj.id}
                        onClick={() => handleToggleObject(obj.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-purple-400 bg-purple-950/40 text-purple-100 shadow-md ring-1 ring-purple-400'
                            : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-purple-500/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-rajdhani font-bold text-sm text-cyan-200">{obj.name}</span>
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                              isSelected ? 'bg-purple-500 text-white' : 'border border-slate-700 bg-slate-800'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{obj.symbolism}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedObjectIds.length === 0}
                    onClick={handleValidateObjects}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    CONFIRMAR SELECCIÓN DE RECUERDOS
                  </button>
                </div>
              </div>
            )}

            {/* 8. DECISION */}
            {activity.type === 'decision' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-slate-200 text-sm leading-relaxed">
                  {activity.scenario}
                </div>
                <div className="space-y-3">
                  {/* Corrección: la valoración de cada opción ya no se muestra antes de responder */}
                  {[...activity.options].reverse().map((opt) => {
                    const isSelected = selectedDecision === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectDecision(opt.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/50 text-white ring-1 ring-cyan-400 shadow-lg shadow-cyan-950/40'
                            : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:text-white'
                        }`}
                      >
                        <div className="font-cinzel font-bold text-sm text-cyan-300">{opt.title}</div>
                        <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                          {opt.interpretation}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    disabled={!selectedDecision}
                    onClick={handleValidateDecision}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    ADOPTAR CLAVE INTERPRETATIVA
                  </button>
                </div>
              </div>
            )}

            {/* 9. REFLECTION */}
            {activity.type === 'reflection' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-slate-200 font-serif text-sm sm:text-base leading-relaxed">
                  {activity.prompt}
                </div>

                <div className="space-y-1.5 p-3 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-400">
                  <span className="font-rajdhani font-bold text-cyan-400 uppercase tracking-wider">
                    Preguntas Guía para tu Análisis:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300">
                    {activity.guidanceQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Escribe aquí tu análisis fundamentado como cazador..."
                    className="w-full p-3.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-sans leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-xs font-rajdhani text-slate-400">
                    <span>
                      Palabras:{' '}
                      <strong className="text-cyan-300">
                        {reflectionText.trim().split(/\s+/).filter(Boolean).length}
                      </strong>{' '}
                      / {activity.minWords} mínimas
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={reflectionText.trim().split(/\s+/).filter(Boolean).length < activity.minWords}
                    onClick={handleValidateReflection}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    TRANSMITIR REFLEXIÓN AL CAZADOR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEEDBACK OVERLAY MODAL */}
      {feedbackState !== 'idle' && (
        <div
          data-ui
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn ${
            is3d ? 'bg-slate-950/60 backdrop-blur-[2px]' : 'bg-slate-950/85 backdrop-blur-md'
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border-2 p-6 shadow-2xl backdrop-blur space-y-4 ${
              feedbackState === 'success'
                ? 'border-cyan-400 bg-gradient-to-b from-slate-900 via-[#0a1628] to-slate-950 shadow-cyan-500/30'
                : 'border-rose-500/60 bg-gradient-to-b from-slate-900 via-[#1c0e14] to-slate-950 shadow-rose-950/50'
            }`}
          >
            {/* Header Status */}
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  feedbackState === 'success'
                    ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                    : 'bg-rose-950 border border-rose-400 text-rose-300'
                }`}
              >
                {feedbackState === 'success' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-rajdhani font-bold uppercase tracking-widest ${
                    feedbackState === 'success' ? 'text-cyan-400' : 'text-rose-400'
                  }`}
                >
                  {feedbackState === 'success'
                    ? '¡DESAFÍO COMPLETADO CON ÉXITO!'
                    : 'PISTA TÁCTICA DEL CAZADOR GUÍA'}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {feedbackState === 'success' ? 'Comprensión Demostrada' : 'Revisa tus Indicios'}
                </h3>
              </div>
            </div>

            {/* Sung Jin-Woo Quote Box */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20">
              <img
                src={CHARACTERS.sung_jinwoo.avatar}
                alt="Sung Jin-Woo"
                className="w-10 h-12 rounded object-cover object-top border border-cyan-400 shrink-0"
              />
              <div className="text-xs text-slate-300 italic font-serif leading-relaxed">
                {feedbackState === 'success'
                  ? '«Bien hecho, cazador. Cada respuesta correcta te acerca a desentrañar la verdadera tragedia de Gregor Samsa.»'
                  : '«No te desanimes, cazador. En el calabozo kafkiano el error es parte del aprendizaje. Vuelve a examinar los hechos.»'}
              </div>
            </div>

            {/* Main Feedback Text */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {feedbackMsg}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              {feedbackState === 'success' ? (
                <>
                  <div className="flex items-center gap-2 text-amber-400 font-rajdhani font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>+{activity.xpReward} XP OBTENIDOS</span>
                  </div>
                  <button
                    onClick={handleAdvance}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold tracking-wider text-sm shadow-lg shadow-cyan-950/50 cursor-pointer"
                  >
                    <span>{isLastActivity ? 'CONCLUIR DIMENSIÓN' : 'SIGUIENTE DESAFÍO'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="text-xs text-slate-400 font-rajdhani">
                    Puedes intentarlo de nuevo sin penalización
                  </div>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-rajdhani font-bold tracking-wider text-sm transition-all cursor-pointer"
                  >
                    INTENTAR DE NUEVO
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
