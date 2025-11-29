import { useState, useEffect, useRef } from "react";
import { Heart, Music, VolumeX, Download, ChevronDown } from "lucide-react";

import { SECTIONS } from "./constants";

export default function App() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setCurrentSection(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [showCard]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log("Play failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const openCard = () => {
    setShowCard(true);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.log("Play failed:", err);
        });
      }
    }, 300);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = "/card.pdf";
    link.download = "Anniversary_Card_Sayang.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToNext = () => {
    setHasScrolled(true);
    if (sectionsRef.current[1]) {
      sectionsRef.current[1].scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!showCard) {
    return (
      <div className="min-h-screen bg-linear-to-br from-rose-100 via-pink-100 to-red-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
        </div>

        <div className="text-center z-10 px-6 max-w-lg mx-auto">
          <div className="mb-6">
            <Heart
              className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto animate-pulse"
              style={{ animationDuration: "1.5s" }}
            />
          </div>

          <h1
            className="text-5xl font-light text-rose-900 mb-4 leading-tight"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            For My Wife
          </h1>

          <p
            className="text-lg text-rose-700 mb-10 font-light leading-relaxed"
            style={{ fontFamily: "'Indie Flower', cursive" }}
          >
            Tap to open your anniversary card
          </p>

          <button
            onClick={openCard}
            className="bg-linear-to-r from-rose-500 to-pink-500 text-white px-14 py-4 rounded-full text-lg font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Open Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-amber-50">
      <audio ref={audioRef} loop preload="metadata" style={{ display: "none" }}>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Progress indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-md">
        {SECTIONS.map((_, index) => (
          <div
            key={index}
            className={`w-2 rounded-full transition-all duration-300 ${
              currentSection === index
                ? "bg-rose-500 h-2.5"
                : "bg-rose-300/50 h-2"
            }`}
          ></div>
        ))}
      </div>

      {/* Fixed controls */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-between px-6 pointer-events-none">
        <button
          onClick={downloadPDF}
          className="bg-white/80 backdrop-blur-sm text-rose-600 p-3.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all pointer-events-auto"
        >
          <Download className="w-6 h-6" />
        </button>

        <button
          onClick={toggleMusic}
          className="bg-white/80 backdrop-blur-sm text-rose-600 p-3.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all pointer-events-auto"
        >
          {isPlaying ? (
            <Music className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sections */}
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        {SECTIONS.map((section, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) sectionsRef.current[index] = el;
            }}
            className="snap-start min-h-screen flex items-center justify-center px-6 py-10 relative"
          >
            {section.isIntro ? (
              <div className="text-center animate-fade-in overflow-y-auto max-h-screen">
                {/* Illustration */}
                <div className="mb-8 mx-auto w-56 h-56 rounded-3xl flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src="/illos.png"
                    alt="Anniversary illustration"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex justify-center items-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                  <Heart
                    className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <Heart
                    className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>

                <h1
                  className="text-2xl font-light text-rose-900 mb-3 leading-tight"
                  style={{ fontFamily: "'Homemade Apple', cursive" }}
                >
                  {section.title}
                </h1>
                <p
                  className="text-4xl text-rose-700 font-light italic mb-8"
                  style={{ fontFamily: "'Indie Flower', cursive" }}
                >
                  {section.subtitle}
                </p>

                {!hasScrolled && (
                  <button
                    onClick={scrollToNext}
                    className="animate-bounce text-rose-500 active:scale-95 transition-transform"
                  >
                    <ChevronDown className="w-8 h-8" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-xl px-6 animate-fade-in overflow-y-auto max-h-screen">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-rose-100/50 overflow-hidden">
                  <h2
                    className="text-3xl font-semibold text-rose-800 mb-6 leading-tight"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {section.title}
                  </h2>

                  <p
                    className="text-rose-950 leading-relaxed mb-6"
                    style={{
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: "1.05rem",
                    }}
                  >
                    {section.content}
                  </p>

                  {section.signature && (
                    <div className="text-right pt-6 border-t border-rose-200/50 mt-6">
                      <p
                        className="text-lg text-rose-700 font-light italic mb-2"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                      >
                        Forever yours,
                      </p>
                      <p
                        className="text-2xl text-rose-900 font-semibold"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                      >
                        {section.signature}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-8 gap-2">
                  <Heart
                    className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <Heart
                    className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                  <Heart
                    className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <Heart
                    className="w-4 h-4 text-rose-300 fill-rose-300 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
