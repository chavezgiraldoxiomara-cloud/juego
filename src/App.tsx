import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { WorldMap } from './components/WorldMap';
import { DimensionCinematic } from './components/DimensionCinematic';
import { ActivityEngine } from './components/ActivityEngine';
import { CharacterCodexModal } from './components/CharacterCodexModal';
import { FinalRewardModal } from './components/FinalRewardModal';
import { AudioControls } from './components/AudioControls';
import { RenderModeToggle } from './components/RenderModeToggle';
// Ampliación: exploración, invitación a leer, diario y video de introducción
import { ExplorationHub } from './components/ExplorationHub';
import { ReadingInvite } from './components/recursos/ReadingInvite';
import { DiaryModal } from './components/recursos/DiaryModal';
import { IntroVideo, hayIntro } from './components/IntroVideo';
import { reiniciarProgreso, useProgreso } from './utils/progreso';
import { useRenderMode, reportRuntimeFailure } from './three/prefs';
import { useScene } from './three/store';
import { DIMENSIONS } from './data/dimensions';
import { HunterRank, SaveState } from './types/game';
import { sound } from './utils/audio';

const STORAGE_KEY = 'METAMORFOSIS_SAVE_DATA_V2';

// El motor 3D se descarga aparte: si el dispositivo no admite WebGL (o se elige
// el modo 2D) nunca se carga y el juego funciona con la presentación clásica.
const Experience = lazy(() => import('./three/Experience'));

/** Si la escena 3D falla en ejecución, el juego continúa en 2D. */
class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('La escena 3D no pudo iniciarse; se usa la versión 2D.', error);
    reportRuntimeFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  // Screen States
  const [currentScreen, setCurrentScreen] = useState<'title' | 'map' | 'dimension'>('title');

  // Dimension Sub-States
  const [activeDimensionId, setActiveDimensionId] = useState<number | null>(null);
  const [dimensionMode, setDimensionMode] = useState<'cinematic' | 'explore' | 'activity' | 'reading'>('cinematic');
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);

  // Persistence State
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});
  const [finalRewardClaimed, setFinalRewardClaimed] = useState<boolean>(false);

  // Modals
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isFinalRewardOpen, setIsFinalRewardOpen] = useState<boolean>(false);
  // Ampliación
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [finalePending, setFinalePending] = useState<boolean>(false);

  // Presentación 3D: la escena solo refleja el estado del juego
  const renderMode = useRenderMode();
  const is3d = renderMode !== '2d';

  useEffect(() => {
    useScene.setState({
      screen: currentScreen,
      dimensionId: activeDimensionId,
      dimensionMode,
      completed: completedMissions
    });
  }, [currentScreen, activeDimensionId, dimensionMode, completedMissions]);

  // Cada pantalla o desafío nuevo empieza arriba (en móvil la página puede venir desplazada)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen, dimensionMode, currentActivityIndex]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: SaveState = JSON.parse(raw);
        if (Array.isArray(parsed.completedMissions)) {
          setCompletedMissions(parsed.completedMissions);
        }
        if (Array.isArray(parsed.completedActivities)) {
          setCompletedActivities(parsed.completedActivities);
        }
        if (parsed.savedAnswers) {
          setSavedAnswers(parsed.savedAnswers);
        }
        if (parsed.finalRewardClaimed) {
          setFinalRewardClaimed(true);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved game state', e);
    }
  }, []);

  // Save to localStorage whenever progress changes
  const saveGameProgress = (
    updatedMissions: number[],
    updatedActivities: string[],
    rewardClaimed: boolean = finalRewardClaimed,
    answers: Record<string, any> = savedAnswers
  ) => {
    try {
      const stateToSave: SaveState = {
        completedMissions: updatedMissions,
        completedActivities: updatedActivities,
        savedAnswers: answers,
        hasSeenIntro: true,
        isSoundMuted: sound.isMuted(),
        finalRewardClaimed: rewardClaimed
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save game state', e);
    }
  };

  // XP & Rank Calculations (Strictly 100 XP per dimension = 500 XP total)
  const totalXp = completedMissions.length * 100;

  const getRankInfo = (xp: number): { rank: HunterRank; title: string } => {
    if (xp >= 500) return { rank: 'S', title: 'Monarca de la Comprensión' };
    if (xp >= 400) return { rank: 'A', title: 'Cazador Élite' };
    if (xp >= 300) return { rank: 'B', title: 'Cazador Avanzado' };
    if (xp >= 200) return { rank: 'C', title: 'Cazador Experimentado' };
    if (xp >= 100) return { rank: 'D', title: 'Explorador de Mazmorras' };
    return { rank: 'E', title: 'Cazador en Entrenamiento' };
  };

  const { rank: currentRank, title: rankTitle } = getRankInfo(totalXp);

  // Active Dimension Object
  const activeDimension = DIMENSIONS.find((d) => d.id === activeDimensionId) || null;

  // Handlers
  const handleStartNewGame = () => {
    sound.playClick();
    // Corrección: «Nueva partida» ahora sí empieza de cero (antes conservaba el progreso).
    if (completedMissions.length > 0 || completedActivities.length > 0) {
      setCompletedMissions([]);
      setCompletedActivities([]);
      setSavedAnswers({});
      setFinalRewardClaimed(false);
      reiniciarProgreso();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    // Ampliación: la primera vez se muestra el video de introducción.
    if (hayIntro() && !useProgreso.getState().introVista) {
      setShowIntro(true);
      return;
    }
    setCurrentScreen('map');
  };

  const handleIntroEnd = () => {
    useProgreso.setState({ introVista: true });
    setShowIntro(false);
    setCurrentScreen('map');
  };

  const handleContinueGame = () => {
    sound.playClick();
    setCurrentScreen('map');
  };

  const handleSelectDimension = (dimId: number) => {
    setActiveDimensionId(dimId);
    setDimensionMode('cinematic');
    // Mejora: si la misión quedó a medias, se retoma en el primer desafío pendiente.
    const dim = DIMENSIONS.find((d) => d.id === dimId);
    const pendiente = dim ? dim.activities.findIndex((a) => !completedActivities.includes(a.id)) : 0;
    setCurrentActivityIndex(completedMissions.includes(dimId) || pendiente < 0 ? 0 : pendiente);
    setCurrentScreen('dimension');
  };

  const handleStartChallenges = () => {
    setDimensionMode('activity');
  };

  // Ampliación: guarda las reflexiones escritas para mostrarlas en el diario.
  const handleSaveAnswer = (activityId: string, text: string) => {
    const answers = { ...savedAnswers, [activityId]: text };
    setSavedAnswers(answers);
    saveGameProgress(completedMissions, completedActivities, finalRewardClaimed, answers);
  };

  // Ampliación: tras la invitación a leer se vuelve al mapa (y, si toca, a la recompensa final).
  const handleReadingDone = () => {
    setActiveDimensionId(null);
    setCurrentScreen('map');
    if (finalePending) {
      setFinalePending(false);
      setIsFinalRewardOpen(true);
    }
  };

  const handleBackToMap = () => {
    setActiveDimensionId(null);
    setCurrentScreen('map');
  };

  const handleActivityComplete = (activityId: string, xpEarned: number) => {
    if (!activeDimension) return;

    // Track activity completion
    let updatedActivities = completedActivities;
    if (!completedActivities.includes(activityId)) {
      updatedActivities = [...completedActivities, activityId];
      setCompletedActivities(updatedActivities);
    }

    const isLastActivity = currentActivityIndex >= activeDimension.activities.length - 1;

    if (isLastActivity) {
      // Entire dimension completed!
      let updatedMissions = completedMissions;
      if (!completedMissions.includes(activeDimension.id)) {
        updatedMissions = [...completedMissions, activeDimension.id];
        setCompletedMissions(updatedMissions);
      }

      // Check if this was the 5th and final dimension
      const allDone = updatedMissions.length >= 5;
      saveGameProgress(updatedMissions, updatedActivities, allDone);

      sound.playLevelUp();

      // Ampliación: antes de volver al mapa se muestra la invitación a leer.
      setFinalePending(allDone);
      setDimensionMode('reading');
    } else {
      // Mejora: el avance se guarda en cada desafío, no solo al terminar la misión.
      saveGameProgress(completedMissions, updatedActivities);
      // Advance to next activity within the dimension
      setCurrentActivityIndex((prev) => prev + 1);
    }
  };

  const handleResetProgress = () => {
    sound.playClick();
    setCompletedMissions([]);
    setCompletedActivities([]);
    setSavedAnswers({});
    setFinalRewardClaimed(false);
    setActiveDimensionId(null);
    reiniciarProgreso();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setCurrentScreen('map');
  };

  return (
    <div
      className={`relative min-h-screen w-full text-slate-100 font-sans selection:bg-cyan-500 selection:text-black ${
        is3d ? 'bg-transparent' : 'bg-[#030712]'
      }`}
    >
      {/* Escena 3D persistente, detrás de toda la interfaz */}
      {is3d && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Experience quality={renderMode === 'low' ? 'low' : 'high'} />
          </Suspense>
        </SceneBoundary>
      )}

      {/* Floating Global Audio Controls */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-40 flex flex-col items-end gap-1.5" data-ui>
        <AudioControls />
        <RenderModeToggle />
      </div>

      {/* SCREEN 1: TITLE SCREEN */}
      {currentScreen === 'title' && (
        <TitleScreen
          onStartGame={handleStartNewGame}
          onContinueGame={completedMissions.length > 0 ? handleContinueGame : undefined}
          hasSavedProgress={completedMissions.length > 0}
          savedXp={totalXp}
          savedRank={currentRank}
          onOpenCodex={() => setIsCodexOpen(true)}
          blocked={isCodexOpen || showIntro}
        />
      )}

      {/* SCREEN 2: WORLD REALM MAP */}
      {currentScreen === 'map' && (
        <WorldMap
          completedMissions={completedMissions}
          totalXp={totalXp}
          currentRank={currentRank}
          rankTitle={rankTitle}
          onSelectDimension={handleSelectDimension}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenFinalReward={() => setIsFinalRewardOpen(true)}
          onOpenDiary={() => setIsDiaryOpen(true)}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* SCREEN 3: ACTIVE DIMENSION */}
      {currentScreen === 'dimension' && activeDimension && (
        <>
          {dimensionMode === 'cinematic' && (
            <DimensionCinematic
              dimension={activeDimension}
              onStartChallenges={handleStartChallenges}
              onExplore={() => setDimensionMode('explore')}
              onBackToMap={handleBackToMap}
            />
          )}
          {dimensionMode === 'explore' && (
            <ExplorationHub
              dimension={activeDimension}
              onStartChallenges={handleStartChallenges}
              onBackToCinematic={() => setDimensionMode('cinematic')}
              onBackToMap={handleBackToMap}
              onOpenDiary={() => setIsDiaryOpen(true)}
            />
          )}
          {dimensionMode === 'activity' && (
            <ActivityEngine
              dimension={activeDimension}
              activityIndex={currentActivityIndex}
              onActivityComplete={handleActivityComplete}
              onSaveAnswer={handleSaveAnswer}
              onBackToMap={handleBackToMap}
              isLastActivity={currentActivityIndex >= activeDimension.activities.length - 1}
            />
          )}
          {dimensionMode === 'reading' && (
            <ReadingInvite dimension={activeDimension} onContinuar={handleReadingDone} />
          )}
        </>
      )}

      {/* GLOBAL MODALS */}
      <CharacterCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />

      {/* Ampliación: diario de Gregor y video de introducción */}
      <DiaryModal isOpen={isDiaryOpen} onClose={() => setIsDiaryOpen(false)} reflexiones={savedAnswers} />
      {showIntro && <IntroVideo onFin={handleIntroEnd} />}

      <FinalRewardModal
        isOpen={isFinalRewardOpen}
        onCloseToMap={() => setIsFinalRewardOpen(false)}
        onResetAdventure={handleResetProgress}
      />
    </div>
  );
}
