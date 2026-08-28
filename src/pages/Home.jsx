import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Suspense,
} from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

import { StackingCards, StackingCardItem } from '../components/ui/StackingCards'
import Chatbot from '../components/ui/Chatbot'
import { NavbarDemo } from '../components/Navbar'

import CssLogo3D from '../components/ui/CssLogo3D'
// import DiwaliPopup from '../components/DiwaliPopup'
// import SponsorPopup from '../components/SponsorPopup'
// Register GSAP plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Memoize testimonials data to prevent re-renders
const PILLARS_TESTIMONIALS = [
  {
    src: 'https://cs.nits.ac.in/storage/FacultyDetails/IMG_175345198568838dd11b534.jpg',
    name: 'Umakanta Majhi',
    designation: 'Faculty Advisor',
    tag: '// FACULTY_ADVISOR',
    quote:
      'Promoting a culture of innovation and creativity. We encourage students to think outside the box, experiment with new ideas, and develop solutions that make a difference.',
    bio:
      'Dr. Umakanta Majhi serves as the Faculty Advisor for the Computer Science Society. With over a decade of research and teaching experience in the Department of Computer Science & Engineering at NIT Silchar, he provides academic and technical direction to the society. He works closely with student leaders to align society activities with modern engineering standards and research domains.',
    focus:
      'Empowering research-driven projects, academic mentorship, departmental coordination, and organizing technical symposiums.',
  },
  {
    src: 'https://res.cloudinary.com/dp4sknsba/image/upload/v1760007735/Swapneel_Bhaiya_ltkb53.jpg',
    name: 'Swapnil Dansana',
    designation: 'President',
    tag: '// EXECUTIVE_PRESIDENT',
    quote:
      "Encouraging innovative thinking and research-oriented approach. We support projects in AI, ML, web development, and emerging technologies to push boundaries of what's possible.",
    bio:
      'Swapnil Dansana leads the society as the President. Under his guidance, the society has scaled its tech stack and organized institute-level hackathons. He focuses on creating collaborative pipelines for projects in Artificial Intelligence, Machine Learning, and Web development.',
    focus:
      'Executive governance, industrial collaboration, project pipelines, and tech-symposium oversight.',
  },
  {
    src: 'https://res.cloudinary.com/dp4sknsba/image/upload/v1760007829/Amborish_xqum5s.jpg',
    name: 'Amborish Sarmah',
    designation: 'General Secretary',
    tag: '// GENERAL_SECRETARY',
    quote:
      'Creating a supportive network where students can learn, grow, and collaborate. We organize tech talks, networking events, and mentorship programs to foster meaningful connections.',
    bio:
      'Amborish Sarmah is the General Secretary, overseeing operations, event schedules, and cross-society coordination. He acts as the main facilitator between the executive wing, alumni networks, and the general student body to drive massive engagement in technical bootcamps.',
    focus:
      'Operations management, workshop schedules, alumni liaison, and campus-wide community building.',
  },
  {
    src: 'https://res.cloudinary.com/dcdxyfnfo/image/upload/v1757535079/WhatsApp_Image_2025-08-31_at_11.28.29_AM_-_002_RAJ_KUMAR_ROY_uopc4j.webp',
    name: 'Raj Kumar Roy',
    designation: 'Vice President',
    tag: '// VICE_PRESIDENT',
    quote:
      'Collaborating to solve challenges, share knowledge, and build things that matter. We provide platforms for students to showcase skills, build projects, and prepare for careers.',
    bio:
      'Raj Kumar Roy serves as the Vice President, supporting strategic initiatives and hackathon architectures. He is passionate about setting up software development environments, hosting coding contests, and guiding junior members in foundational data structures and algorithms.',
    focus:
      'Hackathon architecture, competitive programming bootcamps, and technical mentoring.',
  },
  {
    src: 'https://res.cloudinary.com/dcdxyfnfo/image/upload/v1757535268/IMG-20250510-WA0014_-_CSE_100_TARUN_CHANDAK_w0cny9.webp',
    name: 'Tarun Chandak',
    designation: 'Finance and Ops Co-ordinator',
    tag: '// FINANCE_OPS_LEAD',
    quote:
      'Fostering a culture of continuous learning and curiosity. We encourage students to explore new technologies, participate in hackathons, and stay updated with industry trends.',
    bio:
      'Tarun Chandak manages the finance portfolios and operational logistics of the society. He coordinates budget allocations, sponsor distributions, and ensures smooth material operations during major hackathons and technical exhibitions.',
    focus:
      'Financial modeling, sponsorship logistics, procurement operations, and venue management.',
  },
]

const SPONSORS_LIST = [
  {
    name: 'Unstop',
    href: 'https://unstop.com',
    type: 'Official Platform Partner',
    isSvg: true,
    logoKey: 'unstop',
  },
  {
    name: 'Matiks',
    href: 'https://matiks.in',
    type: 'Official Tech Partner',
    isSvg: true,
    logoKey: 'matiks',
  },
  {
    name: 'Campa Cola',
    logo: 'https://res.cloudinary.com/dp4sknsba/image/upload/v1761978610/WhatsApp_Image_2025-10-31_at_17.10.58_722ac4a3_ar2y9k.jpg',
    href: 'https://campabeverages.com/',
    type: 'Official Beverage Partner',
    isSvg: false,
  },
  {
    name: 'Momo Magic Cafe',
    logo: 'https://res.cloudinary.com/dp4sknsba/image/upload/v1761978633/download_iwxpso.png',
    href: 'https://momomagiccafe.in/',
    type: 'Official Food Partner',
    isSvg: false,
  },
  {
    name: 'Pizza Hut',
    href: 'https://www.pizzahut.co.in/',
    type: 'Official Food Partner',
    isSvg: true,
    logoKey: 'pizzahut',
  },
]

const renderSponsorLogo = (logoKey) => {
  switch (logoKey) {
    case 'unstop':
      return (
        <svg viewBox="0 0 120 40" className="h-8 w-auto">
          <rect width="120" height="40" rx="6" fill="#0f294a" />
          <circle cx="22" cy="20" r="7" fill="#1e40af" />
          <circle cx="25" cy="20" r="4.5" fill="#facc15" />
          <circle cx="22" cy="20" r="2.5" fill="#3b82f6" />
          <text x="38" y="25" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">unstop</text>
        </svg>
      )
    case 'matiks':
      return (
        <svg viewBox="0 0 120 40" className="h-8 w-auto">
          <text x="12" y="24" fill="#00ff66" fontSize="15" fontWeight="bold" fontFamily="monospace" letterSpacing="2">MΛTIKS</text>
          <path d="M 12 30 L 85 30 L 93 22" stroke="#00f0ff" strokeWidth="1.5" fill="none" />
          <circle cx="93" cy="22" r="2" fill="#00f0ff" />
        </svg>
      )
    case 'pizzahut':
      return (
        <svg viewBox="0 0 120 40" className="h-8 w-auto">
          <path d="M 15 18 Q 30 9 60 9 Q 90 9 105 18 Q 80 16 60 16 Q 40 16 15 18 Z" fill="#ef4444" />
          <path d="M 25 19 L 95 19 L 90 22 L 30 22 Z" fill="#f59e0b" />
          <text x="25" y="34" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="Arial Black, sans-serif" letterSpacing="0.5">Pizza Hut</text>
        </svg>
      )
    default:
      return null
  }
}

// Preload critical images
const preloadImages = () => {
  if (typeof window === 'undefined') return

  const images = [
    'images/about.png',
    ...PILLARS_TESTIMONIALS.map((testimonial) => testimonial.src),
  ]

  images.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Separate LoadingScreen component
const LoadingScreen = React.memo(({ loadingProgress }) => (
  <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
    {/* Optimized Matrix background with reduced elements */}
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 text-xs animate-[fall_3s_linear_infinite]"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            top: '-20px',
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </div>
      ))}
    </div>

    {/* Main loader content */}
    <div className="relative z-10 text-center">
      {/* CSS Logo */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 font-mono mb-4">
          CSS
        </h1>
        <p className="text-cyan-400 font-mono text-lg">
          Computer Science Society
        </p>
      </div>

      {/* Terminal-style loader */}
      <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-6 max-w-md mx-auto backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-cyan-400 font-mono text-sm">
            LOADING_SYSTEM
          </span>
        </div>

        <div className="space-y-2 font-mono text-left">
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Initializing components...
          </p>
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Loading assets...
          </p>
          <p className="text-green-400 text-sm">
            <span className="text-cyan-400">$~ </span>Starting services...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-cyan-400 font-mono mb-1">
            <span>Progress</span>
            <span>{Math.min(100, Math.round(loadingProgress))}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, loadingProgress)}%` }}
            ></div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer text */}
      <p className="text-gray-400 text-sm mt-6 font-mono">
        NIT Silchar • Computer Science & Engineering
      </p>
    </div>
  </div>
))

function Home() {
  const [showContent, setShowContent] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)
  const svgRef = useRef(null)
  const animationRef = useRef(null)
  const videoRef = useRef(null)

  const [showSponsorPopup, setShowSponsorPopup] = useState(false)
  const [showSecondSponsorPopup, setShowSecondSponsorPopup] = useState(false)
  const [sponsorPopupShown, setSponsorPopupShown] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        const aboutSectionTop = aboutSection.offsetTop
        const scrollPosition = window.scrollY + window.innerHeight / 2

        // Show navbar when we reach about section
        setShowNavbar(scrollPosition >= aboutSectionTop)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sponsorsSection = document.getElementById('sponsors')
      if (sponsorsSection && !sponsorPopupShown) {
        const rect = sponsorsSection.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setShowSponsorPopup(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sponsorPopupShown])
  // Memoize event handlers
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setInput('')
    }
  }, [])

  const isMobileDevice = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])

  const getTextOrientation = useCallback(() => {
    if (typeof window === 'undefined') return 'horizontal'

    const isMobile = isMobileDevice()
    if (!isMobile) return 'horizontal'

    // For mobile, check if we should use vertical layout
    return window.innerHeight > window.innerWidth ? 'vertical' : 'horizontal'
  }, [isMobileDevice])

  // Memoized text configuration
  const textConfig = useMemo(() => {
    const orientation = getTextOrientation()
    const isMobile = isMobileDevice()
    if (orientation === 'vertical') {
      return {
        fontSize: isMobile ? '300' : '220',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        letterSpacing: '0',
        writingMode: 'tb', // top to bottom (vertical)
        glyphOrientationVertical: '0',
      }
    } else {
      return {
        fontSize: isMobile ? '200' : '320',
        textAnchor: 'middle',
        dominantBaseline: 'middle',
        letterSpacing: '0',
        writingMode: 'lr', // left to right (horizontal)
      }
    }
  }, [getTextOrientation, isMobileDevice])
  const getViewBox = useCallback(() => {
    const isMobile = isMobileDevice()
    const orientation = getTextOrientation()

    if (isMobile && orientation === 'vertical') {
      return '0 0 800 600' // Taller viewBox for vertical text
    } else if (isMobile) {
      return '0 0 1200 800' // Wider viewBox for mobile horizontal
    }
    return '0 0 800 600' // Default for desktop
  }, [isMobileDevice, getTextOrientation])

  const MaskText = useMemo(() => {
    const orientation = getTextOrientation()
    const fontFamily =
      "goldman, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

    if (orientation === 'vertical') {
      // Vertical text layout - each character on a new line
      return (
        <g className="vi-mask-group">
          {/* C - Top of screen */}
          <text
            x="50%"
            y="4%"
            fontSize={textConfig.fontSize}
            textAnchor="middle"
            fill="white"
            dominantBaseline="middle"
            fontFamily={fontFamily}
            fontWeight="1000"
            stroke="white"
            strokeWidth="20px"
            paintOrder="stroke"
          >
            C
          </text>
          {/* S - Middle of screen */}
          <text
            x="50%"
            y="56%"
            fontSize={textConfig.fontSize}
            textAnchor="middle"
            fill="white"
            fontFamily={fontFamily}
            fontWeight="1000"
            stroke="white"
            strokeWidth="20px"
            paintOrder="stroke"
          >
            S
          </text>
          {/* S - Bottom of screen */}
          <text
            x="50%"
            y="97%"
            fontSize={textConfig.fontSize}
            textAnchor="middle"
            fill="white"
            fontFamily={fontFamily}
            fontWeight="1000"
            stroke="white"
            strokeWidth="20px"
            paintOrder="stroke"
          >
            S
          </text>
        </g>
      )
    } else {
      // Horizontal text layout
      return (
        <g className="vi-mask-group">
          <text
            x="50%"
            y="50%"
            fontSize={textConfig.fontSize}
            textAnchor={textConfig.textAnchor}
            fill="white"
            dominantBaseline={textConfig.dominantBaseline}
            fontFamily="Arial Black"
            letterSpacing={textConfig.letterSpacing}
            z-index="1000"
          >
            CSS
          </text>
        </g>
      )
    }
  }, [textConfig, getTextOrientation])
  const cssFontSize = useMemo(
    () => (isMobileDevice() ? '250' : '320'),
    [isMobileDevice]
  )

  // Optimized loading simulation
  useEffect(() => {
    if (!isMounted) return

    window.scrollTo(0, 0)

    // Preload images early
    preloadImages()

    let progressInterval
    let timer
    let fallbackTimer

    const simulateLoading = () => {
      let progress = 0
      progressInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(progressInterval)
          return
        }
        progress += Math.random() * 15
        if (progress >= 100) {
          setLoadingProgress(100)
          clearInterval(progressInterval)
          // Give a small delay for smooth transition
          setTimeout(() => {
            if (isMounted) setIsLoading(false)
          }, 200)
        } else {
          setLoadingProgress(progress)
        }
      }, 150)
    }

    // Start loading simulation
    simulateLoading()

    // Check if critical resources are loaded
    const checkCriticalResources = () => {
      const video = document.querySelector('.bg-video')
      if (video && video.readyState >= 3) {
        clearInterval(progressInterval)
        setLoadingProgress(100)
        setTimeout(() => {
          if (isMounted) setIsLoading(false)
        }, 200)
      }
    }

    // Set up resource checking
    const video = document.querySelector('.bg-video')
    if (video) {
      video.addEventListener('loadeddata', checkCriticalResources)
      video.addEventListener('canplay', checkCriticalResources)
    }

    // ScrollTrigger refresh with debounce
    timer = setTimeout(() => {
      if (isMounted) {
        ScrollTrigger.refresh()
      }
    }, 500)

    // Fallback timeout
    fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false)
        clearInterval(progressInterval)
      }
    }, 2500)

    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
      clearInterval(progressInterval)

      const video = document.querySelector('.bg-video')
      if (video) {
        video.removeEventListener('loadeddata', checkCriticalResources)
        video.removeEventListener('canplay', checkCriticalResources)
      }
    }
  }, [isMounted])

  // Optimized GSAP animations with reduced dependencies
  useGSAP(() => {
    if (!isMounted) return

    if (animationRef.current) {
      animationRef.current.kill()
    }

    const isMobile = isMobileDevice()
    const orientation = getTextOrientation()

    let initialScale, finalScale

    if (isMobile && orientation === 'vertical') {
      // Adjust scales for vertical text on mobile
      const screenRatio = window.innerHeight / window.innerWidth
      initialScale = screenRatio > 1.6 ? 0.7 : 0.7
      finalScale = 15 // Increased for better vertical coverage
    } else if (isMobile) {
      const screenRatio = window.innerHeight / window.innerWidth
      initialScale = screenRatio > 1.6 ? 0.5 : 0.5
      finalScale = 20
    } else {
      initialScale = 1.15
      finalScale = 15
    }

    // Batch GSAP operations
    gsap.set('.vi-mask-group', {
      scale: initialScale,
      transformOrigin: 'center center',
    })

    animationRef.current = gsap.to('.vi-mask-group', {
      rotate: orientation === 'vertical' ? 0 : 10,
      scale: finalScale,
      transformOrigin: '50% 50%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.svg-container',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        onEnter: () => setShowContent(true),
        onLeaveBack: () => setShowContent(false),
      },
    })

    gsap.to('.bg-video', {
      opacity: 0.5,
      scrollTrigger: {
        trigger: '.about',
        start: 'top center',
        end: 'top top',
        scrub: true,
      },
    })
    gsap.to('.chat-launcher', {
      autoAlpha: 1, // Fades in and handles visibility
      scale: 1, // Scales it from its default 0.5 to 1
      duration: 0.5,
      scrollTrigger: {
        trigger: '.about', // The element that triggers the animation
        start: 'top center', // Starts when the top of ".about" hits the viewport center
        toggleActions: 'play none none reverse', // Fades in on scroll down, fades out on scroll up
      },
    })

    // Throttled resize handler
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (isMounted) {
          ScrollTrigger.refresh()
        }
      }, 250)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [isMobileDevice, isMounted, getTextOrientation])

  // Optimized video element with preload and lazy loading
  const VideoBackground = useMemo(
    () => (
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover bg-video"
        onLoadedData={() => {
          // Video loaded callback for better loading detection
          if (isLoading && loadingProgress < 90 && isMounted) {
            setLoadingProgress(90)
          }
        }}
      >
        <source
          src="https://res.cloudinary.com/dp4sknsba/video/upload/v1765811525/WhatsApp_Video_2025-12-15_at_20.29.46_61490805_my0otm.mp4"
          type="video/mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">CSS</h1>
        </div>
      </video>
    ),
    [isLoading, loadingProgress, isMounted]
  )

  if (!isMounted) {
    return null
  }

  return (
    <>
      {isLoading && <LoadingScreen loadingProgress={loadingProgress} />}

      <div className={`w-full relative bg-black `}>
        <Chatbot />

        <div className="svg-container sticky top-0 z-[100] w-full h-screen flex items-center justify-center bg-red">
          <svg
            ref={svgRef}
            viewBox={getViewBox()}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                {MaskText}
              </mask>
            </defs>

            <foreignObject width="100%" height="100%" mask="url(#viMask)">
              {VideoBackground}
            </foreignObject>
          </svg>
        </div>

        {showNavbar && (
          <div className="hidden md:block">
            <NavbarDemo />
          </div>
        )}

        {/* About Section - Reduced padding for mobile */}
        <section
          id="about"
          className="about relative min-h-[65vh] md:min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-4 py-1 md:py-3.5 overflow-hidden"
        >
          <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="md:flex-[1.4] flex-1 bg-black/70 rounded-xl border border-cyan-500/20 p-5 md:p-8 lg:p-12 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <div className="flex items-center mb-3 md:mb-6">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-cyan-400 font-mono text-sm md:text-md">
                  ABOUT_TERMINAL
                </span>
              </div>
              <div className="space-y-3 md:space-y-6 font-mono">
                <p className="text-xl md:text-3xl font-bold text-green-400 tracking-wide">
                  <span className="text-cyan-400">$~ </span> mkdir{' '}
                  <span className="text-xl md:text-3xl">
                    Computer-Science-Society
                  </span>
                </p>
                <p className="text-sm md:text-xl text-gray-300 leading-relaxed">
                  <span className="text-emerald-400 font-mono">$~</span> cat{' '}
                  <span className="text-white">About.txt</span>
                  <br />
                  The{' '}
                  <span className="highlight font-semibold text-base md:text-2xl text-white">
                    Computer Science Society
                  </span>
                  , run by the CSE department of
                  <span className="highlight font-semibold text-base md:text-2xl text-white">
                    {' '}
                    NIT Silchar
                  </span>
                  , aims to impart academic, technical, and socio-cultural
                  awareness to the students of our college.
                </p>
              </div>
              <div className="flex items-center mt-3 md:mt-6">
                <span className="text-cyan-400 font-mono text-sm md:text-lg mr-2">
                  $~
                </span>
                {/* <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none border-none text-sm md:text-lg font-mono text-white w-full caret-cyan-400"
                  placeholder="type a command..."
                  autoFocus
                /> */}
              </div>
            </div>

            {/* 3D Logo Canvas Container */}
            <div className="md:flex-[0.8] flex-1 flex justify-center items-center w-full">
              <Suspense fallback={
                <div className="w-full h-[320px] md:h-[420px] flex items-center justify-center border border-cyan-500/20 rounded-2xl bg-black/40 backdrop-blur-md">
                  <div className="text-cyan-400 font-mono text-sm animate-pulse">Initializing 3D Interface...</div>
                </div>
              }>
                <CssLogo3D
                  onLoad={() => {
                    // 3D canvas loaded callback
                    if (isLoading && loadingProgress < 80 && isMounted) {
                      setLoadingProgress(80)
                    }
                  }}
                />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}

        {/* Sponsors Section */}
        <section
          id="sponsors"
          className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-4 py-8 md:py-12 overflow-hidden"
        >
          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-16 px-2">
              <div className="flex items-center justify-center mb-4 md:mb-6">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                <div
                  className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-1 md:mr-2 animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2 animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                ></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm bg-cyan-900/30 px-2 md:px-3 py-1 rounded-full border border-cyan-500/30">
                  SPONSORS_TERMINAL
                </span>
              </div>

              <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 font-mono">
                <span className="text-cyan-400">$~ </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400">
                  Our Valued Partners
                </span>
              </h2>

              <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed bg-black/30 px-4 py-3 md:px-6 md:py-3 rounded-lg border border-cyan-500/20">
                We are grateful for the support from our partners who help us
                empower the next generation of tech leaders.
              </p>
            </div>

            {/* Minimalist Marquee Sponsors Row - Clean Logos Only */}
            <div className="relative z-10 w-full overflow-hidden py-10 border-y border-slate-900/60 bg-transparent">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes marqueeScroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee-loop {
                  display: flex;
                  width: max-content;
                  animation: marqueeScroll 30s linear infinite;
                }
                .animate-marquee-loop:hover {
                  animation-play-state: paused;
                }
              `}} />
              <div className="animate-marquee-loop flex items-center">
                {[...SPONSORS_LIST, ...SPONSORS_LIST].map((sponsor, index) => (
                  <a
                    key={`${sponsor.name}-${index}`}
                    href={sponsor.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-12 shrink-0 flex items-center justify-center opacity-65 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0 transition-all duration-300"
                  >
                    {/* Logo container (Larger and cleaner) */}
                    <div className="h-16 w-36 flex items-center justify-center overflow-hidden">
                      {sponsor.isSvg ? (
                        renderSponsorLogo(sponsor.logoKey)
                      ) : (
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          loading="lazy"
                          className="h-full w-full object-contain brightness-110 contrast-125"
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* CTA Section - Responsive layout */}
            <div className="mt-8 md:mt-12 lg:mt-16 text-center">
              <div className="inline-flex flex-col md:flex-row items-center gap-3 md:gap-4 lg:gap-6 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 backdrop-blur-md">
                <span className="text-cyan-400 font-mono text-xs md:text-sm lg:text-base">
                  $~ become-a-sponsor --help
                </span>
                <button className="px-4 py-2 md:px-6 md:py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-mono text-xs md:text-sm rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30">
                  Join as Sponsor
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* <SponsorPopup
          isOpen={showSponsorPopup}
          onClose={() => {
            setShowSponsorPopup(false)
            setSponsorPopupShown(true)
            // Show second popup after a short delay
            setTimeout(() => {
              setShowSecondSponsorPopup(true)
            }, 500) // 500ms delay between popups
          }}
          sponsorData={{
            name: 'Campa Cola',
            posterUrl:
              'https://res.cloudinary.com/dp4sknsba/image/upload/v1761985648/Freshers_Beverage_1_icue0p.jpg',
            websiteUrl: 'https://campabeverages.com/',
            type: 'Official Beverage Partner',
          }}
        />

        <SponsorPopup
          isOpen={showSecondSponsorPopup}
          onClose={() => setShowSecondSponsorPopup(false)}
          sponsorData={{
            name: 'Momo Magic Cafe',
            posterUrl:
              'https://res.cloudinary.com/dp4sknsba/image/upload/v1761996566/Freshers_Food_Final_znhgie.jpg',
            websiteUrl: 'https://momomagiccafe.in/',
            type: 'Official Food Partner',
          }}
        /> */}

        {/* Pillars Section */}
        <section id="pillars" className="relative min-h-[90vh] md:min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center px-3 py-1 md:py-7">
          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-6 md:mb-16 px-2">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-1 md:mr-2"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full mr-1 md:mr-2"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2"></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  PILLARS_OF_CSS_TERMINAL
                </span>
              </div>

              <h2 className="text-xl md:text-5xl font-bold text-white mb-2 md:mb-4 font-mono">
                <span className="text-cyan-400">$~ </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                  Pillars of CSS
                </span>
              </h2>

              <p className="text-xs md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The five foundational pillars that define the Computer Science
                Society and drive our mission forward.
              </p>
            </div>

            {/* Stacking Cards Component */}
            <div className="w-full max-w-5xl mx-auto mt-8">
              <StackingCards
                totalCards={PILLARS_TESTIMONIALS.length}
                scaleMultiplier={0.04}
                className="relative flex flex-col gap-10 md:gap-16 pb-[50vh]"
              >
                {PILLARS_TESTIMONIALS.map((pillar, index) => {
                  const layoutId = `expandable-pillar-card-${pillar.name.replace(/ /g, '-')}`;
                  return (
                    <StackingCardItem
                      key={pillar.name}
                      index={index}
                      topPosition={`${80 + index * 24}px`}
                      className="w-full h-[420px] sm:h-[400px] md:h-[350px]"
                    >
                      {/* Closed Card Container (Split Layout: Left Image, Right Text) */}
                      <motion.div
                        layoutId={layoutId}
                        onClick={() => setExpandedIndex(index)}
                        className="cursor-pointer bg-[#020617]/90 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl h-full flex flex-col md:flex-row relative overflow-hidden group select-none"
                        whileHover="hover"
                      >
                        {/* Left Side: Profile Image */}
                        <div className="relative w-full md:w-1/3 h-40 md:h-full overflow-hidden bg-black shrink-0 border-b md:border-b-0 md:border-r border-cyan-500/15">
                          <motion.img
                            layoutId={`image-${layoutId}`}
                            src={pillar.src}
                            alt={pillar.name}
                            className="h-full w-full object-cover object-center"
                            variants={{
                              hover: { scale: 1.05 }
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                        </div>

                        {/* Right Side: Text & Quotes */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between h-full relative">
                          {/* Floating Terminal header dots */}
                          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                              <span className="text-[10px] font-mono text-cyan-400 ml-1.5">PILLAR_0{index + 1}_LOG</span>
                            </div>
                            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              STATUS: ACTIVE
                            </span>
                          </div>

                          {/* Member info */}
                          <div className="flex flex-col mt-2">
                            <motion.p
                              layoutId={`subtitle-${layoutId}`}
                              className="text-cyan-400 font-mono text-[10px] tracking-wider uppercase mb-1"
                            >
                              {pillar.designation}
                            </motion.p>
                            <motion.h3
                              layoutId={`title-${layoutId}`}
                              className="text-lg md:text-xl font-bold font-mono text-white tracking-tight"
                            >
                              {pillar.name}
                            </motion.h3>
                          </div>

                          {/* Quote preview */}
                          <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic mt-4 font-sans font-light grow flex items-center">
                            "{pillar.quote}"
                          </p>

                          {/* Cyber Click-to-expand Action Indicator */}
                          <div className="flex justify-end items-center mt-3 text-[9px] font-mono text-cyan-500/70 group-hover:text-cyan-400 transition-colors duration-300">
                            <span>expand_profile_logs --execute</span>
                            <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    </StackingCardItem>
                  )
                })}
              </StackingCards>
            </div>

            {/* Additional Info */}
            <div className="mt-6 md:mt-12 text-center">
              <div className="inline-flex items-center px-3 py-1 md:px-6 md:py-3 rounded-full bg-cyan-900/30 border border-cyan-500/50">
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  $~ cat pillars.txt | more...
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* AnimatePresence for Expandable Modal */}
        <AnimatePresence>
          {expandedIndex !== null && (() => {
            const pillar = PILLARS_TESTIMONIALS[expandedIndex];
            const layoutId = `expandable-pillar-card-${pillar.name.replace(/ /g, '-')}`;
            return (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
                {/* Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExpandedIndex(null)}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />
                
                {/* Modal Container */}
                <motion.div
                  layoutId={layoutId}
                  className="relative w-full max-w-4xl h-[85vh] md:h-[75vh] bg-[#020617] border border-cyan-500/30 rounded-2xl overflow-hidden z-10 flex flex-col md:flex-row shadow-2xl shadow-cyan-500/10"
                >
                  {/* Floating Close Button */}
                  <button 
                    onClick={() => setExpandedIndex(null)} 
                    className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center bg-black/60 hover:bg-slate-900 rounded-full border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-colors backdrop-blur-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  
                  {/* Left Pane - Portrait Photo */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-full md:w-1/2 bg-black border-r border-cyan-500/10">
                    <motion.img 
                      layoutId={`image-${layoutId}`} 
                      src={pillar.src} 
                      alt={pillar.name}
                      className="h-full w-full object-cover object-center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                  </div>
                  
                  {/* Right Pane - Scrollable Bio Content */}
                  <div className="p-6 md:p-10 w-full md:w-1/2 flex flex-col h-full overflow-y-auto bg-slate-950/40 select-none">
                    <motion.p 
                      layoutId={`subtitle-${layoutId}`} 
                      className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2"
                    >
                      {pillar.tag}
                    </motion.p>
                    
                    <motion.h3 
                      layoutId={`title-${layoutId}`} 
                      className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight mb-6 pb-4 border-b border-cyan-500/10"
                    >
                      {pillar.name}
                    </motion.h3>
                    
                    {/* Biography and Focus Details */}
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: 0.15 }}
                      className="font-mono text-slate-300 text-xs md:text-sm leading-relaxed flex flex-col gap-6"
                    >
                      {/* Departmental Designation */}
                      <div>
                        <h4 className="text-cyan-400 font-bold tracking-wider mb-1 uppercase text-[11px]">// DESIGNATION</h4>
                        <p className="text-white text-sm">{pillar.designation}</p>
                      </div>

                      {/* Quote */}
                      <div>
                        <h4 className="text-cyan-400 font-bold tracking-wider mb-1 uppercase text-[11px]">// INSPIRATIONAL_QUOTE</h4>
                        <p className="italic text-slate-200 border-l-2 border-cyan-500/40 pl-3 py-1 font-sans font-light text-sm md:text-md">
                          "{pillar.quote}"
                        </p>
                      </div>

                      {/* Biography */}
                      <div>
                        <h4 className="text-cyan-400 font-bold tracking-wider mb-1.5 uppercase text-[11px]">// BIOGRAPHY</h4>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{pillar.bio}</p>
                      </div>

                      {/* Focus */}
                      <div>
                        <h4 className="text-cyan-400 font-bold tracking-wider mb-1.5 uppercase text-[11px]">// OPERATIONAL_FOCUS</h4>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{pillar.focus}</p>
                      </div>

                      {/* Close Button */}
                      <button 
                        onClick={() => setExpandedIndex(null)}
                        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-900/40 to-slate-900/40 hover:from-cyan-900/60 hover:to-slate-900/60 text-cyan-400 border border-cyan-500/30 font-bold rounded-lg hover:shadow-md hover:shadow-cyan-500/10 transition-all self-start text-[11px]"
                      >
                        CLOSE_PROFILE_TERMINAL
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </div>
    </>
  )
}

export default React.memo(Home)
