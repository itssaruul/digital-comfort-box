import React, { useState, useRef, useEffect } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import GlassCard from './components/GlassCard';
import { MoodType, GeneratedMessage } from './types';
import { generateComfortMessage } from './services/geminiService';
import { MoodIcon, ArrowLeft, Music, Heart } from './components/Icons';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [pickerMood, setPickerMood] = useState<MoodType>(MoodType.SAD);
  const [message, setMessage] = useState<GeneratedMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when message loads
  useEffect(() => {
    if (message) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [message]);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMood(pickerMood);
      setIsTransitioning(false);
      fetchMessage(pickerMood);
    }, 400);
  };

  const fetchMessage = async (mood: MoodType) => {
    setLoading(true);
    const data = await generateComfortMessage(mood);
    setMessage(data);
    setLoading(false);
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        setSelectedMood(null);
        setMessage(null);
        setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans text-slate-700 overflow-x-hidden flex flex-col">
      
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Vibrant Purplish Pink Circle Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-fuchsia-400/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-pink-400/30 rounded-full blur-[90px] mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        <BackgroundParticles />
      </div>

      {/* Main Container */}
      {/* 
         Structure for perfect centering + scrolling:
         1. main: flex-grow ensures it fills available space between header (none) and footer.
         2. main: flex-col items-center centers content horizontally.
         3. REMOVED justify-center on main: This prevents top-clipping when content is too long.
         4. Content Wrapper: 'my-auto' centers vertically if space is available, but flows normally if content is tall.
         5. py-12: Adds breathing room so centered content isn't flush with edges on small screens.
      */}
      <main className={`relative z-10 flex-grow flex flex-col items-center w-full px-4 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        <div className="w-full max-w-2xl my-auto py-12">
          {!selectedMood ? (
            // HOME VIEW
            <GlassCard className="p-10 md:p-14 text-center flex flex-col items-center justify-center min-h-[500px]">
              
              <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-800 mb-2 tracking-wide text-center">
                Open when...
              </h1>
              
              <div className="mx-auto my-8 w-24 h-24 rounded-full bg-white/40 border border-white/60 flex items-center justify-center shadow-sm transition-all duration-300">
                 <MoodIcon mood={pickerMood} className="w-10 h-10 text-fuchsia-500 transition-all duration-300 transform scale-110" />
              </div>

              <div className="mx-auto relative w-full max-w-xs h-40 mb-8">
                 <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/60 to-transparent z-10 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/60 to-transparent z-10 pointer-events-none"></div>

                 <div 
                   ref={scrollContainerRef}
                   className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-[30%]"
                 >
                   <div className="flex flex-col gap-1 items-center">
                      {Object.values(MoodType).map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setPickerMood(mood)}
                          className={`
                            snap-center w-full py-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center
                            ${pickerMood === mood 
                              ? 'bg-fuchsia-100/50 text-fuchsia-700 scale-100 font-semibold shadow-sm backdrop-blur-sm' 
                              : 'text-slate-400 scale-90 hover:text-slate-600 hover:bg-white/20'}
                          `}
                        >
                          <span className="text-lg tracking-wider">{mood.toLowerCase()}</span>
                        </button>
                      ))}
                   </div>
                 </div>
              </div>

              <button
                onClick={handleEnter}
                className="
                  group relative overflow-hidden
                  px-10 py-3 rounded-full 
                  bg-slate-800 text-white 
                  hover:shadow-lg hover:shadow-fuchsia-300/50 hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <span className="relative z-10 flex items-center gap-2 font-medium tracking-widest text-sm uppercase">
                  Open Envelope <Heart className="w-3 h-3 fill-current" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

            </GlassCard>
          ) : (
            // MESSAGE VIEW
            <GlassCard className="p-8 md:p-16 flex flex-col items-center text-center">
              
              {loading ? (
                <div className="flex flex-col items-center animate-fade-in min-h-[400px] justify-center">
                  <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-fuchsia-200 border-t-fuchsia-500 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <MoodIcon mood={selectedMood} className="w-6 h-6 text-fuchsia-400 opacity-50" />
                      </div>
                  </div>
                  <p className="mt-6 text-slate-400 font-serif italic text-lg animate-pulse">
                    Writing a note for Zoloo...
                  </p>
                </div>
              ) : (
                <div className="w-full animate-fade-in relative">
                   <button 
                      onClick={handleReset}
                      className="absolute top-[-1rem] left-[-1rem] md:top-0 md:left-0 text-slate-400 hover:text-fuchsia-600 transition-colors p-2 rounded-full hover:bg-white/50"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                  <div className="mb-6 flex justify-center mt-4 md:mt-0">
                    <div className="p-3 bg-fuchsia-50 rounded-full text-fuchsia-500 shadow-inner">
                      <MoodIcon mood={selectedMood} className="w-8 h-8" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif text-slate-800 mb-6 leading-relaxed">
                    {message?.title}
                  </h2>

                  <div className="prose prose-slate max-w-none mb-8">
                    <p className="text-base md:text-lg text-slate-600 leading-8 font-sans whitespace-pre-wrap">
                      {message?.content}
                    </p>
                  </div>

                  {message?.playlist && message.playlist.length > 0 && (
                    <div className="mb-8 mx-auto w-full max-w-md">
                      <div className="flex items-center justify-center gap-2 text-fuchsia-500 mb-3 opacity-80">
                        <Music className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Songs for the vibe</span>
                      </div>
                      <div className="bg-white/40 border border-white/60 rounded-2xl p-4 shadow-sm backdrop-blur-md">
                        <ul className="space-y-3">
                          {message.playlist.map((song, idx) => (
                            <li key={idx} className="flex flex-col text-sm border-b border-fuchsia-100 last:border-0 pb-2 last:pb-0">
                              <span className="font-semibold text-slate-700">{song.title}</span>
                              <span className="text-slate-500 text-xs">{song.artist}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent mx-auto mb-6"></div>

                  <p className="text-slate-500 font-serif italic text-lg">
                    {message?.closing}
                  </p>
                </div>
              )}
            </GlassCard>
          )}
        </div>

      </main>

      <footer className="w-full text-center pb-6 opacity-50 hover:opacity-100 transition-opacity z-10">
        <p className="text-xs text-slate-400 font-sans tracking-widest uppercase">
          Made for Zoloo
        </p>
      </footer>
    </div>
  );
};

export default App;
