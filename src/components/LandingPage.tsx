import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 scale-110 transition-transform duration-1000">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
          style={{ filter: 'grayscale(100%) contrast(120%)' }}
        >
          <source
            src="/image/sccp.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className={`mb-8 animate-vibrate ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
          <img 
            src="/image/sccp.png" 
            alt="Corinthians Logo" 
            className="w-20 h-20"
          />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-gray-200 text-2xl md:text-3xl font-light mb-4 animate-fade-in tracking-[0.2em] uppercase">
            Sport Club
          </h1>
          <div className="overflow-hidden">
            <h2 className="text-white text-6xl md:text-8xl font-bold animate-slide-up tracking-tight">
              CORINTHIANS
            </h2>
          </div>
          <p className="text-gray-400 mt-6 animate-scale-in text-lg tracking-wider">
            DESDE 1910
          </p>
        </div>

        <div className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full transition-all duration-500 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-lg tracking-wide">ENTRAR</span>
            <ArrowRight
              className={`w-5 h-5 transition-all duration-500 ${
                isHovered ? 'translate-x-1' : ''
              }`}
            />
            <div
              className={`absolute -inset-1 rounded-full blur-xl bg-white transition-all duration-500 ${
                isHovered ? 'opacity-30' : 'opacity-0'
              }`}
            />
          </button>
        </div>

        <div className={`absolute bottom-8 text-center ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-500`}>
          <p className="text-gray-400 text-sm tracking-widest">TODO PODEROSO TIMÃO</p>
        </div>
      </div>
    </div>
  );
}