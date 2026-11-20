import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface AudioControlsProps {
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ className = '' }) => {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggle = () => {
    const next = !muted;
    setMuted(next);
    sound.setMuted(next);
    if (!next) {
      sound.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-slate-950/80 backdrop-blur text-cyan-400 hover:text-cyan-200 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all text-xs font-rajdhani tracking-wider cursor-pointer ${className}`}
      title={muted ? 'Activar Sonido' : 'Silenciar Audio'}
    >
      {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
      <span className="hidden sm:inline font-semibold">{muted ? 'SONIDO: OFF' : 'SONIDO: ON'}</span>
    </button>
  );
};
