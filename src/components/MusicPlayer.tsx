import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  // Generate ASCII progress bar
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const asciiBar = '[' + '='.repeat(filledLength) + '>'.repeat(filledLength < barLength ? 1 : 0) + '.'.repeat(Math.max(0, emptyLength - 1)) + ']';

  return (
    <div className="w-full bg-black border-4 border-[#FF00FF] p-4 shadow-[-8px_8px_0px_#00FFFF]">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="border-b-4 border-[#FF00FF] pb-2 mb-4">
        <h2 className="text-xl font-mono text-[#00FFFF] uppercase">&gt; AUDIO.TERMINAL</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full h-40 border-4 border-[#00FFFF] overflow-hidden bg-black group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity filter contrast-200 sepia hue-rotate-180"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-2 left-2 bg-black px-2 py-1 border-2 border-[#FF00FF]">
            <span className="text-[#FF00FF] font-mono text-sm uppercase">ID: {currentTrack.id}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-mono text-white uppercase truncate bg-[#FF00FF] text-black px-2 inline-block mb-1">
            {currentTrack.title}
          </h3>
          <p className="text-[#00FFFF] text-xl font-sans uppercase truncate">
            SRC: {currentTrack.artist}
          </p>
          
          <div className="mt-4 font-mono text-[#FF00FF] text-lg tracking-widest whitespace-pre">
            {asciiBar}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={prevTrack} 
            className="py-2 border-2 border-[#00FFFF] text-[#00FFFF] font-mono uppercase hover:bg-[#00FFFF] hover:text-black active:translate-y-1"
          >
            [PREV]
          </button>
          <button 
            onClick={togglePlay}
            className="py-2 border-2 border-[#FF00FF] bg-[#FF00FF] text-black font-mono uppercase hover:bg-white hover:border-white active:translate-y-1"
          >
            {isPlaying ? '[PAUSE]' : '[PLAY]'}
          </button>
          <button 
            onClick={nextTrack} 
            className="py-2 border-2 border-[#00FFFF] text-[#00FFFF] font-mono uppercase hover:bg-[#00FFFF] hover:text-black active:translate-y-1"
          >
            [NEXT]
          </button>
        </div>

        <div className="flex items-center justify-between text-[#00FFFF] font-sans text-lg uppercase border-t-4 border-[#FF00FF] pt-2">
          <span>&gt; STATUS: {isPlaying ? 'STREAMING' : 'IDLE'}</span>
          <span className="animate-pulse font-mono">{isPlaying ? '||||||||' : '........'}</span>
        </div>
      </div>
    </div>
  );
};
