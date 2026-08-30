import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SLIDE_DURATION = 6500; // 6.5 seconds per slide to give enough time to read the fun content

const WelcomeStoryPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true';

    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const progressInterval = useRef(null);
    const startTimeRef = useRef(null);
    const pausedProgressRef = useRef(0);

    const slides = [
        {
            title: "THE GRIND IS OVER!",
            subtitle: "YOU MADE IT TO NIT SILCHAR CSE",
            bg: "bg-[#FFFDF5]",
            accent: "bg-[#FF6B6B]",
            content: (
                <div className="flex flex-col items-center justify-center text-center h-full px-4 relative select-none">
                    {/* Retro Grid Background Decor */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:30px_30px]" />
                    
                    {/* Floating Emojis/Stickers */}
                    <div className="absolute top-10 right-6 text-5xl md:text-7xl animate-bounce">🎉</div>
                    <div className="absolute bottom-16 left-6 text-5xl md:text-7xl animate-spin-slow">✦</div>
                    
                    {/* Title Banner */}
                    <div className="border-4 border-black bg-[#FFD93D] p-5 sm:p-7 shadow-[8px_8px_0px_0px_#000] -rotate-2 max-w-2xl relative z-10">
                        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] bg-black text-white px-3 py-1 font-black">BYE BYE JEE ADVANCED!</span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-black leading-none uppercase tracking-tighter mt-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            CONGRATULATIONS!
                        </h1>
                    </div>

                    <div className="border-4 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] rotate-1 mt-8 max-w-lg relative z-10">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-black leading-relaxed">
                            Years of coaching classes, solving Irodov, drawing free-body diagrams, and organic chemistry mechanisms... 
                            <strong> The grind is officially over!</strong> You are now a part of the elite CSE batch at NIT Silchar.
                        </p>
                       
                    </div>
                </div>
            )
        },
        {
            title: "ABOUT CSS-NITS",
            subtitle: "WHAT IS THE COMPUTER SCIENCE SOCIETY?",
            bg: "bg-[#FFFDF5]",
            accent: "bg-[#FFD93D]",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 relative select-none">
                    <div className="absolute top-12 left-10 text-5xl md:text-7xl rotate-12">★</div>
                    <div className="absolute bottom-16 right-10 text-5xl md:text-7xl -rotate-12">★</div>

                    <div className="border-4 border-black bg-[#FF6B6B] p-4 px-6 rotate-[-1deg] text-center shadow-[6px_6px_0px_0px_#000] mb-8">
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            MEET CSS-NITS
                        </h2>
                    </div>

                    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] max-w-xl text-center rotate-1 relative z-10">
                        <p className="text-sm sm:text-base font-bold leading-relaxed text-black mb-4">
                            The <strong>Computer Science Society (CSS)</strong>, run by the CSE department of NIT Silchar, aims to impart academic, technical, and socio-cultural awareness.
                        </p>
                        <p className="text-sm sm:text-base font-bold leading-relaxed text-black">
                            Culturally, we host epic technical symposiums &amp; workshops. Technically, we develop applications and websites for our campus and society!
                        </p>
                      
                    </div>
                </div>
            )
        },
        {
            title: "DISCOVER THE WINGS",
            subtitle: "OUR DIVERSE ECOSYSTEM",
            bg: "bg-[#FFFDF5]",
            accent: "bg-[#C4B5FD]",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 relative select-none">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] bg-[size:20px_20px]" />
                    
                    <div className="border-4 border-black bg-[#C4B5FD] p-3 px-6 rotate-1 text-center shadow-[6px_6px_0px_0px_#000] mb-6">
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-black uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            THE WINGS
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full relative z-10">
                        <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000] -rotate-1">
                            <span className="text-xs bg-[#FFD93D] border border-black px-2 py-0.5 font-mono">CP / DSA</span>
                            <p className="text-xs font-bold text-black mt-2">Strengthening problem-solving skills and DSA concepts to crack coding tests.</p>
                        </div>
                        <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000] rotate-1">
                            <span className="text-xs bg-[#FF6B6B] text-white border border-black px-2 py-0.5 font-mono">DEV / ML</span>
                            <p className="text-xs font-bold text-black mt-2">Upgrading the official App and Website, plus developing machine learning models.</p>
                        </div>
                        <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000] rotate-1">
                            <span className="text-xs bg-[#C4B5FD] border border-black px-2 py-0.5 font-mono">DESIGN / LITERARY</span>
                            <p className="text-xs font-bold text-black mt-2">Crafting visual designs, UI/UX projects, and writing zines like BITSCRIBE magazine.</p>
                        </div>
                        <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000] -rotate-1">
                            <span className="text-xs bg-black text-white border border-black px-2 py-0.5 font-mono">EXEC / PR</span>
                            <p className="text-xs font-bold text-black mt-2">Backbone operations, resource coordination, and managing public relations.</p>
                        </div>
                    </div>
                </div>
            )
        },
       
        {
            title: "YOUR JOURNEY AHEAD",
            subtitle: "WELCOME TO THE FUTURE",
            bg: "bg-[#FFFDF5]",
            accent: "bg-[#C4B5FD]",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center relative select-none">
                    <div className="absolute top-12 left-10 text-5xl rotate-12">★</div>
                    <div className="absolute bottom-16 right-10 text-5xl -rotate-12">★</div>

                    <div className="border-4 border-black bg-[#C4B5FD] p-5 shadow-[8px_8px_0px_0px_#000] max-w-xl rotate-[-1deg]">
                        <h2 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            IT'S GOING TO BE GREAT!
                        </h2>
                        <p className="text-sm sm:text-base font-bold text-black leading-relaxed">
                            Your journey ahead at NIT Silchar is going to be legendary. You will collaborate with seniors, explore advanced fields of computer science, and build items that matter.
                        </p>
                    
                    </div>
                </div>
            )
        },
        {
            title: "THE FINAL STEP",
            subtitle: "JOIN THE GROUP",
            bg: "bg-[#FFFDF5]",
            accent: "bg-[#FFD93D]",
            content: (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center relative select-none">
                    <div className="absolute top-8 right-12 text-6xl text-[#FFD93D] animate-bounce">★</div>
                    <div className="absolute bottom-10 left-12 text-5xl text-[#C4B5FD] animate-spin-slow">✦</div>

                    <div className="border-4 border-black bg-[#FFD93D] p-5 shadow-[8px_8px_0px_0px_#000] rotate-[-1deg] max-w-xl mb-8">
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            JOIN THE GANG
                        </h2>
                        <p className="text-sm sm:text-base font-bold text-black leading-relaxed">
                            Orientation events, wing recruitment notifications, coding sessions, and syllabus study guides—we share all announcement links directly inside the Freshers group.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                        {/* Whatsapp mechanical button */}
                        <a
                            href="https://chat.whatsapp.com/KMF4khkU4aAJRYiUOfKi5c?s=cl&p=a&mlu=0&ilr=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#22C55E] hover:bg-[#1eb053] text-black font-black uppercase text-xs sm:text-sm tracking-wider border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all rounded-none cursor-pointer"
                        >
                            <span>💬 JOIN FRESHERS GROUP</span>
                        </a>

                        {/* Finish Story button */}
                        <button
                            onClick={handleFinishStory}
                            className="bg-white hover:bg-zinc-100 text-black font-black uppercase text-xs sm:text-sm tracking-wider border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all rounded-none cursor-pointer"
                        >
                            <span>ENTER MAIN SITE ➔</span>
                        </button>
                    </div>
                </div>
            )
        }
    ];

    // Finish / Skip story
    function handleFinishStory() {
        if (!isPreview) {
            localStorage.setItem('viewedWelcomeStory', 'true');
            navigate('/dashboard');
        } else {
            navigate('/admin-dashboard');
        }
    }

    // Auto-play control logic
    const startProgressTimer = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        
        startTimeRef.current = Date.now() - (pausedProgressRef.current * SLIDE_DURATION);

        progressInterval.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            setProgress(pct);

            if (pct >= 100) {
                clearInterval(progressInterval.current);
                handleNextSlide();
            }
        }, 16);
    };

    const handleNextSlide = () => {
        setProgress(0);
        pausedProgressRef.current = 0;
        setCurrentSlide(prev => {
            if (prev < slides.length - 1) {
                return prev + 1;
            } else {
                setIsPlaying(false);
                return prev;
            }
        });
    };

    const handlePrevSlide = () => {
        setProgress(0);
        pausedProgressRef.current = 0;
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : 0));
        setIsPlaying(true);
    };

    useEffect(() => {
        if (isPlaying) {
            startProgressTimer();
        } else {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [currentSlide, isPlaying]);

    // Handle tap left/right navigation
    const handleScreenTap = (e) => {
        const screenWidth = window.innerWidth;
        const tapX = e.clientX;

        // Skip clicking buttons/links
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }

        if (tapX < screenWidth * 0.3) {
            handlePrevSlide();
        } else {
            if (currentSlide < slides.length - 1) {
                handleNextSlide();
            } else {
                handleFinishStory();
            }
        }
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                if (currentSlide < slides.length - 1) {
                    handleNextSlide();
                } else {
                    handleFinishStory();
                }
            } else if (e.key === 'ArrowLeft') {
                handlePrevSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    const activeSlideData = slides[currentSlide];

    return (
        <div 
            className={`min-h-screen w-full ${activeSlideData.bg} text-black font-bold flex flex-col justify-between overflow-hidden relative p-4 select-none`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {/* Top Navigation & Indicators */}
            <div className="w-full max-w-3xl mx-auto z-30 pt-4 px-2">
                {/* Story Indicators */}
                <div className="flex gap-1.5 mb-4">
                    {slides.map((_, index) => {
                        let fillWidth = '0%';
                        if (index < currentSlide) fillWidth = '100%';
                        if (index === currentSlide) fillWidth = `${progress}%`;

                        return (
                            <div key={index} className="h-2 flex-1 bg-black/15 border-2 border-black rounded-none overflow-hidden bg-white">
                                <div 
                                    className={`h-full ${slides[currentSlide].accent} transition-all duration-75`} 
                                    style={{ width: fillWidth }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Info & Header */}
                <div className="flex justify-between items-center bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-3.5 h-3.5 bg-black animate-pulse" />
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider">CSS WELCOME STORY</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (isPlaying) {
                                    pausedProgressRef.current = progress / 100;
                                }
                                setIsPlaying(!isPlaying);
                            }}
                            className="bg-white hover:bg-zinc-100 border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                        >
                            {isPlaying ? "⏸ Pause" : "▶ Play"}
                        </button>

                        <button 
                            onClick={handleFinishStory}
                            className="bg-[#FF6B6B] hover:bg-[#ff5757] text-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                        >
                            Skip ✕
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide Body */}
            <div 
                className="flex-1 w-full max-w-3xl mx-auto flex items-center justify-center cursor-pointer z-20"
                onClick={handleScreenTap}
            >
                {activeSlideData.content}
            </div>

            {/* Bottom Controls Indicator */}
            <div className="w-full max-w-3xl mx-auto text-center py-4 z-30 select-none">
                <p className="text-[10px] sm:text-xs text-black/50 uppercase tracking-widest font-black">
                    Tap left to go back | Tap right to go forward
                </p>
                {isPreview && (
                    <div className="mt-2 inline-block bg-[#FFD93D] border-2 border-black px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] -rotate-1">
                        Admin Preview Mode
                    </div>
                )}
            </div>

            {/* Decorative Grid and Background Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />
        </div>
    );
};

export default WelcomeStoryPage;
