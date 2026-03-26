import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF00FF] overflow-hidden relative">
      <div className="static-noise" />
      <div className="scanlines" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-8 screen-tear">
        <header className="text-center space-y-4 w-full border-b-4 border-[#FF00FF] pb-4">
          <h1 
            className="text-3xl md:text-5xl font-mono uppercase glitch-text"
            data-text="SYSTEM.OVERRIDE // SNAKE.EXE"
          >
            SYSTEM.OVERRIDE // SNAKE.EXE
          </h1>
          <p className="text-[#00FFFF] font-sans text-2xl uppercase tracking-[0.2em]">
            &gt; AUDIO.SUBSYSTEM_ACTIVE // GLITCH.WAV
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          <div className="order-2 lg:order-1 w-full lg:w-1/3">
            <MusicPlayer />
          </div>

          <div className="order-1 lg:order-2 w-full lg:w-2/3 flex justify-center">
            <SnakeGame />
          </div>
        </div>

        <footer className="mt-auto pt-8 flex flex-col items-center gap-2 w-full border-t-4 border-[#00FFFF]">
          <p className="text-2xl font-sans text-[#FF00FF] uppercase tracking-widest">
            END_OF_LINE // SYS.V1.0.4
          </p>
        </footer>
      </main>
    </div>
  );
}
