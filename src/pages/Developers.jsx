import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import {
  FaInstagram,
  FaUsers,
  FaFacebook,
  FaLinkedin,
  FaCode,
  FaPalette,
  FaUserTie,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from 'react-icons/fa'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'
import teamData from '../jsonData/developers.json'
import '../styles/developers.css'
import { NavbarDemo } from '../components/Navbar'
import TerminalLoader from '../components/Loader'


const defaultTiltOptions = {
  reverse: true,
  max: 35,
  perspective: 1000,
  scale: 1.0,
  speed: 1000,
  transition: true,
  axis: null,
  reset: true,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
}

const MemberCard = ({ member, index }) => {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  return (
    <Tilt options={defaultTiltOptions}>
      <div
        className="group perspective h-96 w-full sm:w-80 md:w-72 lg:w-64"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d   ${flipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 backface-hidden bg-arch-bg-alt overflow-hidden border border-arch-line group-hover:border-arch-line transition-all duration-500">
            <div className="absolute inset-0 bg-tech-grid opacity-10"></div>
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-arch-line opacity-70 group-hover:border-arch-line transition-all"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-arch-line opacity-70 group-hover:border-arch-line transition-all"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-arch-line opacity-70 group-hover:border-arch-line transition-all"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-arch-line opacity-70 group-hover:border-arch-line transition-all"></div>
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="relative mb-6">
                <div className="relative w-32 h-32 rounded-full">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border border-arch-line group-hover:border-arch-line transition-all duration-500"
                  />
                </div>
                <div className="absolute -inset-3 rounded-full bg-arch-ink group-hover:bg-arch-ink transition-all group-hover:text-arch-bg"></div>
              </div>
              <div className="text-center px-2">
                <h3 className="text-xl font-bold mb-2 text-arch-ink group-hover:text-arch-ink transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-lg text-arch-ink-3 group-hover:text-arch-ink transition-colors duration-300">
                  {member.role}
                </p>
                {member.year && (
                  <p className="text-arch-ink text-sm mt-1">{member.year}</p>
                )}
              </div>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-xs bg-arch-card px-3 py-1.5 rounded-full border border-arch-line group-hover:border-arch-line transition-all">
                  <span className="mr-2 text-arch-ink">View details</span>
                  <FaArrowRight className="text-arch-ink" />
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-arch-card overflow-hidden border border-arch-line">
            <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>
            <div className="absolute inset-0 border border-arch-line group-hover:border-arch-line transition-all"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-1 bg-arch-card bg-clip-text text-transparent">
                  {member.name}
                </h3>
                <p className="text-sm text-arch-ink">{member.role}</p>
                {member.year && (
                  <p className="text-arch-ink text-xs mt-1">{member.year}</p>
                )}
              </div>
              <div className="flex gap-3 text-xl mb-6">
                {member.social.instagram && (
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-arch-card rounded-full hover:bg-arch-card transition-all transform hover:scale-110 border border-arch-line hover:border-arch-line"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram className="text-arch-ink text-lg" />
                  </a>
                )}
                {member.social.facebook && (
                  <a
                    href={member.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-arch-card rounded-full hover:bg-arch-ink transition-all transform hover:scale-110 border border-arch-line hover:border-arch-ink hover:text-arch-bg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaFacebook className="text-arch-ink text-lg" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-arch-card rounded-full hover:bg-arch-ink transition-all transform hover:scale-110 border border-arch-line hover:border-arch-ink hover:text-arch-bg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin className="text-arch-ink text-lg" />
                  </a>
                )}
              </div>
              <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                <div className="flex items-center text-xs bg-arch-card px-3 py-1 rounded-full border border-arch-line">
                  <span className="mr-2 text-arch-ink">View profile</span>
                  <FaArrowRight className="rotate-180 text-arch-ink" />
                </div>
              </div>
              <div className="absolute top-4 flex space-x-1">
                <div className="w-2 h-2 bg-arch-ink rounded-full"></div>
                <div className="w-2 h-2 bg-arch-ink rounded-full delay-300"></div>
                <div className="w-2 h-2 bg-arch-ink rounded-full delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  )
}

const Carousel = ({ children, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const members = React.Children.toArray(children)
  const totalItems = members.length
  const totalSlides = Math.ceil(totalItems / itemsPerView)
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640)
        setItemsPerView(1)
      else if (window.innerWidth < 1024)
        setItemsPerView(2)
      else setItemsPerView(4)
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }


  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    delta: 50,
    trackTouch: true,
    trackMouse: false,
  })


  const startIndex = currentIndex * itemsPerView
  const visibleItems = members.slice(startIndex, startIndex + itemsPerView)

  if (totalItems === 0)
    return <p className="text-center text-arch-ink">No members found</p>

  useEffect(() => {

    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      setIsLoading(false);
      return;
    }

    const imageLoaded = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setIsLoading(false);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded);
      }
    });


    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      images.forEach(img => {
        img.removeEventListener('load', imageLoaded);
        img.removeEventListener('error', imageLoaded);
      });
    };
  }, []);
  if (isLoading) {
    return <TerminalLoader />;
  }
  return (
    <div className={`relative   ${className}`}>
      <div className="relative flex items-center px-8 sm:px-12 lg:px-16">
        <button
          onClick={prev}
          className="lg:ml-9 absolute top-1/2 -translate-y-1/2 left-2 sm:-left-8 lg:-left-16 bg-arch-ink border border-arch-ink text-arch-bg p-2 sm:p-3 lg:p-4 rounded-full hover:bg-arch-ink hover:text-arch-bg hover:scale-110 transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </button>
        <div
          {...handlers}
          className="flex-1 overflow-visible cursor-grab active:cursor-grabbing"
        >
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20"
            initial={false}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'tween',
              ease: 'easeOut',
              duration: 0.3,
            }}
          >
            {visibleItems}
          </motion.div>
        </div>
        <button
          onClick={next}
          className="absolute lg:mr-9 top-1/2 -translate-y-1/2 right-2 sm:-right-20 lg:-right-24 bg-arch-ink border border-arch-ink text-arch-bg p-2 sm:p-3 lg:p-4 rounded-full hover:bg-arch-ink hover:text-arch-bg hover:scale-110 transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all   ${currentIndex === idx ? 'bg-arch-ink' : 'bg-arch-bg-alt'
              } hover:bg-arch-ink hover:text-arch-bg`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const Developers = () => {
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('selectedCategory') || 'all'
  })


  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory)
  }, [selectedCategory])


  const getCurrentMembers = () => {
    return selectedCategory === 'all'
      ? teamData.categories.contributors?.members || []
      : teamData.categories[selectedCategory]?.members || []
  }


  const categories = {
    all: {
      name: 'All Contributors',
      icon: FaUsers,
      count: teamData.categories.contributors?.members.length || 0,
    },
    leads: {
      name: 'Team Leads',
      icon: FaUserTie,
      count: teamData.categories.leads?.members.length || 0,
    },
    developers: {
      name: 'Developers',
      icon: FaCode,
      count: teamData.categories.developers?.members.length || 0,
    },
    designers: {
      name: 'Designers',
      icon: FaPalette,
      count: teamData.categories.designers?.members.length || 0,
    },
    ml: {
      name: 'ML',
      icon: FaUsers,
      count: teamData.categories.ml?.members.length || 0,
    },
  }

  return (
    <div className="relative min-h-screen bg-arch-bg text-arch-ink px-4 sm:px-6 py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-arch-ink text-xs animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: '2s',
                top: '-20px',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:100px_100px] opacity-5"></div>
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-10">
            <path
              d="M0,100 Q200,50 400,150 T800,50 T1200,200 T1600,0"
              stroke="cyan"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10,10"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="20"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <div className="absolute w-20 h-20 border border-arch-line animate-float-1"></div>
            <div className="absolute w-16 h-16 border border-arch-line rounded-full right-20 top-1/4 animate-float-2"></div>
            <div className="absolute w-24 h-24 border border-arch-line rotate-45 bottom-1/3 left-1/4 animate-float-3"></div>
            <div className="absolute w-72 h-72 bg-arch-ink rounded-full animate-pulse-slow top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-arch-ink rounded-full animate-pulse-slow-delayed bottom-20 right-10"></div>
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-6xl font-bold mb-4 text-arch-ink"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            Development Team
          </h1>
          <p className="text-lg sm:text-xl text-arch-ink max-w-3xl mx-auto">
            The talented individuals who design, develop, and maintain the CSS
            website and digital presence
          </p>
        </div>

        {/* Top Section: Text + Image */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16 p-6 md:p-8 bg-arch-card border border-arch-line relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] md:bg-[length:80px_80px] opacity-20"></div>
          <div className="absolute inset-0 opacity-20 md:opacity-30 hidden sm:block">
            <svg width="100%" height="100%" className="absolute inset-0">
              <path
                d="M0,50 Q150,0 300,100 T600,50 T900,150 T1200,50"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,200 Q200,150 400,250 T800,200 T1200,300 T1600,200"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient
                  id="circuitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00f7ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00ccff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00a2ff" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-arch-ink text-xs opacity-70 animate-matrix-rain"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.7}s`,
                  top: '-5%',
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-arch-ink rounded-full hidden sm:block"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-arch-ink rounded-full delay-1000"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-arch-ink rounded-full delay-1500 hidden sm:block"></div>
          <div className="absolute inset-0 border border-arch-line md:border pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-l md:border-t-2 md:border-l-2 border-arch-line"></div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-r md:border-t-2 md:border-r-2 border-arch-line"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-l md:border-b-2 md:border-l-2 border-arch-line"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-r md:border-b-2 md:border-r-2 border-arch-line"></div>
          </div>
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="absolute -left-3 md:-left-4 top-3 w-1.5 md:w-2 h-12 md:h-16 bg-arch-card rounded-full"></div>
            <div className="relative pl-4 md:pl-6">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-arch-ink rounded-full mr-2"></div>
                <span className="text-arch-ink text-xs md:text-sm">
                  SYSTEM_TERMINAL
                </span>
              </div>
              <p className="text-arch-ink-3 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl">
                <span className="text-arch-ink">$~ </span>
                Our development team combines technical expertise with creative
                vision to build innovative digital experiences. Each member
                brings unique skills that contribute to our society's
                technological advancement.
              </p>
              <div className="flex items-center mt-3 md:mt-4">
                <span className="text-arch-ink text-sm md:text-base mr-2">
                  $~
                </span>
                <div className="w-1.5 h-4 md:w-2 md:h-5 bg-arch-ink animate-blink"></div>
              </div>
              <div className="flex flex-wrap mt-4 md:mt-6 gap-3 md:gap-6">
                <div className="flex items-center bg-arch-card p-1.5 md:p-2 border border-arch-line">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-arch-ink rounded-full mr-1.5 md:mr-2"></div>
                  <span className="text-arch-ink text-xs md:text-sm">
                    ACTIVE_DEV
                  </span>
                </div>
                <div className="flex items-center bg-arch-card p-1.5 md:p-2 border border-arch-line">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-arch-ink rounded-full mr-1.5 md:mr-2 delay-1000"></div>
                  <span className="text-arch-ink text-xs md:text-sm">
                    CODE_INNOVATION
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="absolute -inset-2 md:-inset-4 bg-arch-ink"></div>
              <div className="relative overflow-hidden border border-arch-line group bg-arch-card">
                <div className="absolute inset-0 bg-arch-card pointer-events-none"></div>
                <img
                  src="/images/developers.png"
                  alt="Development team"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute w-full h-0.5 md:h-1 bg-arch-card top-1/3 animate-scan opacity-80"></div>
                <div className="absolute top-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-l md:border-t-2 md:border-l-2 border-arch-line opacity-80"></div>
                <div className="absolute top-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-r md:border-t-2 md:border-r-2 border-arch-line opacity-80"></div>
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-l md:border-b-2 md:border-l-2 border-arch-line opacity-80"></div>
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-r md:border-b-2 md:border-r-2 border-arch-line opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-arch-card p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex justify-between items-center">
                    <span className="text-arch-ink text-xs md:text-sm">
                      DEV_TEAM_IMG
                    </span>
                    <span className="text-arch-ink text-xs md:text-sm">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-arch-ink h-0.5 md:h-1 mt-1 rounded-full">
                    <div className="w-full h-full bg-arch-ink rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-arch-ink rounded-full border border-arch-ink animate-float-1 hidden sm:block"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 md:w-5 md:h-5 bg-arch-ink rounded-full border border-arch-ink animate-float-2 hidden sm:block"></div>
            </div>
          </div>
        </div>

        {/* Category Tabs Section */}
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mt-10 mb-12 p-6 bg-arch-card border border-arch-line relative overflow-hidden">
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-arch-ink rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-arch-ink rounded-full"></div>
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-arch-line"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-arch-line"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-arch-line"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-arch-line"></div>
            <div className="relative mb-6 lg:mb-0 lg:mr-8">
              <div className="flex items-center">
                <h2 className="text-2xl md:text-3xl font-bold bg-arch-card bg-clip-text text-transparent">
                  Filter by Role
                </h2>
                <div className="ml-4 w-1 h-8 bg-arch-card rounded-full"></div>
              </div>
              <p className="text-arch-ink text-sm mt-2 ml-6">
                SELECT_TEAM_CATEGORY
              </p>
            </div>
            <div className="relative flex flex-wrap justify-center gap-2 p-4 bg-arch-card border border-arch-line">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-arch-line opacity-70"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-arch-line opacity-70"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-arch-line opacity-70"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-arch-line opacity-70"></div>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`relative px-4 sm:px-5 py-2 font-bold tracking-wider transition-all duration-300 flex items-center   ${selectedCategory === key
                      ? 'bg-arch-card text-arch-ink border border-arch-line'
                      : 'bg-arch-card text-arch-ink-3 border border-arch-line hover:border-arch-line hover:text-arch-ink'
                    }   overflow-hidden group`}
                >
                  {React.createElement(category.icon, { className: 'mr-2' })}
                  {selectedCategory === key && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-arch-ink rounded-full"></div>
                  )}
                  <div
                    className={`absolute inset-0 bg-arch-card transition-all duration-300   ${selectedCategory === key
                        ? ''
                        : ''
                      }`}
                  ></div>
                  <span
                    className={`relative z-10   ${selectedCategory === key ? 'drop-' : ''}`}
                  >
                    {category.name} ({category.count})
                  </span>
                  {selectedCategory === key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-arch-ink"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team Members Section */}
          <div className="relative mt-12">
            <h2 className="text-3xl sm:text-4xl mb-8 font-semibold text-left border-l-4 border-arch-line pl-4 text-arch-ink flex items-center">
              {React.createElement(categories[selectedCategory].icon, {
                className: 'mr-3',
              })}
              {categories[selectedCategory].name} ({getCurrentMembers().length})
            </h2>
            <div className='flex justify-center items-center'>
              <Carousel className="w-full" key={selectedCategory}>
                {getCurrentMembers().map((member, index) => (
                  <MemberCard
                    key={`${selectedCategory}-${index}`}
                    member={member}
                    index={index}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Developers