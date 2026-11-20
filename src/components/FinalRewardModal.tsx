import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Crown,
  BookOpen,
  Sparkles,
  RotateCcw,
  MapPin,
  Eye,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { DIMENSIONS } from '../data/dimensions';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { useIs3D } from '../three/prefs';
import { useScene } from '../three/store';

interface FinalRewardModalProps {
  isOpen: boolean;
  onCloseToMap: () => void;
  onResetAdventure: () => void;
}

export const FinalRewardModal: React.FC<FinalRewardModalProps> = ({
  isOpen,
  onCloseToMap,
  onResetAdventure
}) => {
  // Step sequence:
  // 1: Portals illumination (0-2s)
  // 2: Sung Jin-Woo & Gregor scene (2-5s)
  // 3: Legendary Chest appearance (interactive or auto)
  // 4: Chest Opened -> Special Emblem revealed
  // 5: Victory Final Dashboard
  const [step, setStep] = useState<number>(1);
  const [activePortalIndex, setActivePortalIndex] = useState<number>(0);
  const [isChestOpening, setIsChestOpening] = useState<boolean>(false);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [showInsigniasDrawer, setShowInsigniasDrawer] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const is3d = useIs3D();
  const victoryVideo = React.useRef<HTMLVideoElement | null>(null);

  // 3D: la escena del mapa refleja cada paso de la recompensa
  useEffect(() => {
    useScene.setState({
      finale: { open: isOpen, step, portalIndex: activePortalIndex, chestOpening: isChestOpening, chestOpened }
    });
  }, [isOpen, step, activePortalIndex, isChestOpening, chestOpened]);

  useEffect(() => {
    if (!is3d || !isOpen || !chestOpened) return;
    useScene.setState({ video: victoryVideo.current });
    victoryVideo.current?.play().catch(() => {});
    return () => useScene.setState({ video: null });
  }, [is3d, isOpen, chestOpened]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setActivePortalIndex(0);
      setChestOpened(false);
      setIsChestOpening(false);
      return;
    }

    // Step 1: sequential illumination of 5 portals
    sound.playLevelUp();
    let portalTimer: any;
    const interval = setInterval(() => {
      setActivePortalIndex((prev) => {
        if (prev < 4) {
          sound.playPortalWarp();
          return prev + 1;
        } else {
          clearInterval(interval);
          portalTimer = setTimeout(() => {
            setStep(2); // advance to Sung Jin-Woo & Gregor message
          }, 1200);
          return prev;
        }
      });
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(portalTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenChest = () => {
    if (isChestOpening || chestOpened) return;
    setIsChestOpening(true);
    sound.playChestOpening();
    setTimeout(() => {
      setChestOpened(true);
      setIsChestOpening(false);
      setStep(4);
    }, 1800);
  };

  // El cofre 3D se abre con la misma función que el botón del panel
  useScene.setState((state) => ({ handlers: { ...state.handlers, onChest: step >= 3 ? handleOpenChest : undefined } }));

  return (
    <div
      data-ui={is3d ? undefined : ''}
      className={
        is3d
          ? 'fixed inset-0 z-50 flex flex-col lg:flex-row items-stretch gap-3 p-3 sm:p-6 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 overflow-y-auto'
          : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-lg overflow-y-auto'
      }
    >
      {/* 3D: hueco por el que se ve la celebración en la escena */}
      {is3d && <div data-scene-window className="flex-1 min-h-[38vh] lg:min-h-0" />}
      {is3d && chestOpened && (
        <video
          ref={victoryVideo}
          src="/assets/clips/victory.mp4"
          poster="/assets/clips/victory_poster.jpg"
          muted
          loop
          playsInline
          className="absolute w-px h-px opacity-0 pointer-events-none"
        />
      )}
      <div
        data-ui
        className={`relative w-full my-auto rounded-3xl border-2 border-cyan-400 p-5 sm:p-8 shadow-2xl shadow-cyan-500/30 text-center overflow-hidden ${
          is3d
            ? 'lg:w-[46%] lg:max-w-2xl lg:p-6 bg-gradient-to-b from-slate-900/90 via-[#070d1e]/90 to-slate-950/90 backdrop-blur-md'
            : 'max-w-4xl bg-gradient-to-b from-slate-900 via-[#070d1e] to-slate-950'
        }`}
      >
        {/* Glow ambient background rings */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* STEP 1: CINEMATIC PORTALS ILLUMINATION */}
        {step === 1 && (
          <div className="space-y-6 py-8 animate-fadeIn">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-rajdhani font-bold tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-400 uppercase">
              Rango S Alcanzado · Sincronizando Dimensiones
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-white glow-cyan">
              CONVERGENCIA DE LOS CINCO PORTALES
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              La energía dimensional de Franz Kafka resuena en cada portal superado. Observa cómo el sello
              se disuelve.
            </p>

            <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-2xl mx-auto pt-4">
              {DIMENSIONS.map((dim, idx) => {
                const isLit = idx <= activePortalIndex;
                return (
                  <div
                    key={dim.id}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-700 ${
                      isLit
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/40 scale-105'
                        : 'border-slate-800 bg-slate-900/40 opacity-40'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-cinzel font-bold text-sm ${
                        isLit
                          ? 'bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {dim.id}
                    </div>
                    <span className="text-[10px] font-rajdhani font-bold text-slate-300 truncate max-w-full">
                      Dim {dim.id}
                    </span>
                    {isLit && (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute top-2 right-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SUNG JIN-WOO & GREGOR SCENE */}
        {step === 2 && (
          <div className="space-y-6 py-6 animate-fadeIn">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-rajdhani font-bold tracking-widest bg-purple-950 text-purple-300 border border-purple-400 uppercase">
              Mensaje del Cazador Guía
            </span>

            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl border-2 border-cyan-500/40 bg-slate-950/80 text-left">
              <img
                src={CHARACTERS.sung_jinwoo.avatar}
                alt="Sung Jin-Woo"
                className="w-24 h-28 rounded-xl object-cover object-top border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 shrink-0"
              />
              <div className="space-y-2">
                <h3 className="font-cinzel text-xl font-bold text-cyan-200">
                  Sung Jin-Woo: «El Legado del Cazador»
                </h3>
                <p className="text-sm text-slate-300 italic font-serif leading-relaxed">
                  «Has cruzado las cinco grietas, cazador. Muchos habrían empuñado espadas para destruir al
                  monstruo; tú, en cambio, tuviste el coraje de observar su sufrimiento, sentir su rechazo y
                  comprender su humanidad. Esa es la verdadera victoria que trasciende cualquier calabozo.»
                </p>
                <div className="text-xs font-rajdhani font-bold text-amber-400">
                  ✦ El cofre legendario ha respondido a tu sabiduría.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setStep(3);
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cinzel font-bold text-base tracking-wider shadow-xl shadow-cyan-500/30 cursor-pointer"
            >
              DESCUBRIR EL COFRE LEGENDARIO
            </button>
          </div>
        )}

        {/* STEP 3 & 4: LEGENDARY CHEST & SPECIAL EMBLEM */}
        {(step === 3 || step === 4) && (
          <div className="space-y-6 py-4 animate-fadeIn">
            {/* Header */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-rajdhani font-bold tracking-widest bg-amber-950 text-amber-300 border border-amber-400 uppercase mb-2">
                Recompensa Suprema de Supervivencia
              </span>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white glow-gold tracking-wider">
                ¡MISIÓN CUMPLIDA, CAZADOR!
              </h1>
              <p className="font-rajdhani text-lg sm:text-xl font-bold text-cyan-300 tracking-widest mt-1 uppercase">
                HAS SUPERADO LAS CINCO DIMENSIONES
              </p>
            </div>

            {/* Quote of Honor */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-purple-950/30 text-amber-200 font-cinzel text-base sm:text-lg font-bold shadow-lg">
              “No se trata solo de sobrevivir, sino de comprender”.
            </div>

            {/* Interactive Chest / Emblem Showcase */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              {!chestOpened ? (
                /* Unopened Chest */
                <div className="space-y-4">
                  <div
                    onClick={handleOpenChest}
                    className={`relative group cursor-pointer p-8 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 ${
                      isChestOpening ? 'animate-pulse scale-110' : ''
                    }`}
                  >
                    {/* Animated Aura */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-amber-500/20 blur-xl group-hover:opacity-100 transition-opacity" />
                    <Trophy className="w-24 h-24 sm:w-28 sm:h-28 text-amber-400 mx-auto filter drop-shadow(0 0 20px rgba(234,179,8,0.7))" />
                    <div className="mt-3 font-cinzel font-bold text-base text-amber-300">
                      {isChestOpening ? 'ABRIENDO COFRE LEGENDARIO...' : 'TOCA PARA ABRIR EL COFRE'}
                    </div>
                    <p className="text-xs font-rajdhani text-slate-400">
                      Energía azul, violeta y dorada concentrada
                    </p>
                  </div>
                </div>
              ) : (
                /* Opened Emblem: Crown + Book + Glowing Auras */
                <div className="relative p-6 sm:p-8 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-slate-950 via-[#0d1428] to-slate-950 shadow-2xl shadow-cyan-500/40 max-w-xl mx-auto animate-scaleUp">
                  {/* Glowing runes */}
                  <div className="w-24 h-24 mx-auto relative flex items-center justify-center mb-3">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full border border-purple-400 animate-spin-reverse" />
                    <Crown className="w-12 h-12 text-amber-400 filter drop-shadow(0 0 15px rgba(234,179,8,0.9)) animate-bounce" />
                  </div>

                  <span className="inline-block px-3 py-1 rounded text-xs font-rajdhani font-bold bg-amber-500/20 text-amber-300 border border-amber-400 uppercase tracking-widest mb-2">
                    Emblema Legendario
                  </span>
                  <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-300 glow-gold">
                    MONARCA DE LA COMPRENSIÓN
                  </h3>

                  <div className="flex items-center justify-center gap-3 mt-2 text-cyan-300 font-rajdhani font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>EL LIBRO ABIERTO DE KAFKA & LA CORONA ETERNA</span>
                  </div>

                  {/* Summary Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                    <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30">
                      <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-bold">Experiencia</div>
                      <div className="text-base font-cinzel font-bold text-cyan-300">500 / 500 XP</div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/30">
                      <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-bold">Rango Final</div>
                      <div className="text-base font-cinzel font-bold text-amber-300">RANGO S</div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/30">
                      <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-bold">Dimensiones</div>
                      <div className="text-base font-cinzel font-bold text-purple-300">5 / 5 Superadas</div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30">
                      <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-bold">Insignias</div>
                      <div className="text-base font-cinzel font-bold text-emerald-300">5 Obtenidas</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowInsigniasDrawer(!showInsigniasDrawer);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/50 text-cyan-300 font-rajdhani font-bold text-sm tracking-wider cursor-pointer transition-all shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>{showInsigniasDrawer ? 'OCULTAR INSIGNIAS' : 'CONSULTAR INSIGNIAS'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onCloseToMap();
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold text-sm tracking-wider cursor-pointer shadow-lg shadow-cyan-950/50 transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>REGRESAR AL MAPA</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowResetConfirm(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-rajdhani font-bold text-sm tracking-wider cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REINICIAR AVENTURA</span>
              </button>
            </div>

            {/* Insignias Gallery Drawer */}
            {showInsigniasDrawer && (
              <div className="mt-6 p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/90 text-left animate-fadeIn">
                <h4 className="font-cinzel text-base font-bold text-cyan-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Las Cinco Insignias de Misión Obtenidas</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {DIMENSIONS.map((dim) => (
                    <div
                      key={dim.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
                        {dim.id}
                      </div>
                      <div>
                        <div className="font-cinzel font-bold text-xs text-white">
                          {dim.insignia.name}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-rajdhani font-semibold">
                          {dim.insignia.title}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          {dim.insignia.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reset Confirmation Sub-Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-2xl border-2 border-rose-500/60 bg-slate-950 text-center space-y-4 shadow-2xl">
              <RotateCcw className="w-12 h-12 text-rose-400 mx-auto animate-spin-reverse" />
              <h3 className="font-cinzel text-xl font-bold text-white">¿Reiniciar la Aventura?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Se restablecerán todos los puntos (500 XP), las cinco dimensiones volverán a bloquearse
                excepto la primera y podrás volver a recorrer la historia desde el inicio.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-rajdhani font-bold cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    onResetAdventure();
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-rajdhani font-bold cursor-pointer shadow-lg shadow-rose-950/50"
                >
                  SÍ, REINICIAR AVENTURA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
