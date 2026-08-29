import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

import { StackingCards, StackingCardItem } from '../components/ui/StackingCards'
import Chatbot from '../components/ui/Chatbot'
import { Link } from 'react-router-dom'
import LiquidEther from '../components/ui/LiquidEther'
import ArchIntro from '../components/ArchIntro'
import ComputerModel from '../components/ui/ComputerModel'
import {
  useArchReveal,
  useArchProgress,
  archSpring,
  archTween,
  ARCH_EASE,
} from '../hooks/useArchAnim'
// import DiwaliPopup from '../components/DiwaliPopup'
// import SponsorPopup from '../components/SponsorPopup'
// Register GSAP plugins only once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ARCH palette for the liquid field — module scope so the array identity is
// stable across renders (LiquidEther keys its WebGL setup on `colors`).
const LIQUID_COLORS = ['#E0DED8', '#A8A399', '#3A3A38']
const LIQUID_STYLE = { width: '100%', height: '100%' }

// Memoize testimonials data to prevent re-renders
const PILLARS_TESTIMONIALS = [
  {
    src: 'https://cs.nits.ac.in/storage/FacultyDetails/IMG_175345198568838dd11b534.jpg',
    name: 'Umakanta Majhi',
    designation: 'Faculty Advisor',
    tag: '// FACULTY_ADVISOR',
    quote:
      'Promoting a culture of innovation and creativity. We encourage students to think outside the box, experiment with new ideas, and develop solutions that make a difference.',
    bio: 'Dr. Umakanta Majhi serves as the Faculty Advisor for the Computer Science Society. With over a decade of research and teaching experience in the Department of Computer Science & Engineering at NIT Silchar, he provides academic and technical direction to the society. He works closely with student leaders to align society activities with modern engineering standards and research domains.',
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
    bio: 'Swapnil Dansana leads the society as the President. Under his guidance, the society has scaled its tech stack and organized institute-level hackathons. He focuses on creating collaborative pipelines for projects in Artificial Intelligence, Machine Learning, and Web development.',
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
    bio: 'Amborish Sarmah is the General Secretary, overseeing operations, event schedules, and cross-society coordination. He acts as the main facilitator between the executive wing, alumni networks, and the general student body to drive massive engagement in technical bootcamps.',
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
    bio: 'Raj Kumar Roy serves as the Vice President, supporting strategic initiatives and hackathon architectures. He is passionate about setting up software development environments, hosting coding contests, and guiding junior members in foundational data structures and algorithms.',
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
    bio: 'Tarun Chandak manages the finance portfolios and operational logistics of the society. He coordinates budget allocations, sponsor distributions, and ensures smooth material operations during major hackathons and technical exhibitions.',
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
          <text
            x="38"
            y="25"
            fill="#ffffff"
            fontSize="13"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.5"
          >
            unstop
          </text>
        </svg>
      )
    case 'matiks':
      return (
        <svg viewBox="0 0 120 40" className="h-8 w-auto">
          <text
            x="12"
            y="24"
            fill="#00ff66"
            fontSize="15"
            fontWeight="bold"
            fontFamily="monospace"
            letterSpacing="2"
          >
            MΛTIKS
          </text>
          <path
            d="M 12 30 L 85 30 L 93 22"
            stroke="#00f0ff"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="93" cy="22" r="2" fill="#00f0ff" />
        </svg>
      )
    case 'pizzahut':
      return (
        <svg viewBox="0 0 120 40" className="h-8 w-auto">
          <path
            d="M 15 18 Q 30 9 60 9 Q 90 9 105 18 Q 80 16 60 16 Q 40 16 15 18 Z"
            fill="#ef4444"
          />
          <path d="M 25 19 L 95 19 L 90 22 L 30 22 Z" fill="#f59e0b" />
          <text
            x="25"
            y="34"
            fill="#ffffff"
            fontSize="9.5"
            fontWeight="bold"
            fontFamily="Arial Black, sans-serif"
            letterSpacing="0.5"
          >
            Pizza Hut
          </text>
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
    'images/css-logo-mark.png',
    ...PILLARS_TESTIMONIALS.map((testimonial) => testimonial.src),
  ]

  images.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

function Home() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [introDone, setIntroDone] = useState(false)

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
    }
  }, [isMounted])

  // ARCH scroll reveals (presentation only)
  const archScope = useRef(null)
  const progressRef = useRef(null)
  const liquidRef = useRef(null)
  const tickerRef = useRef(null)
  const sponsorViewRef = useRef(null)
  const sponsorTrackRef = useRef(null)
  const sponsorTweenRef = useRef(null)

  useArchReveal(archScope, [isMounted, introDone])
  useArchProgress(progressRef, [isMounted, introDone])

  // Hold the page still until the curtains have opened.
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [introDone])

  // Chat launcher reveal + ScrollTrigger housekeeping.
  useGSAP(() => {
    if (!isMounted) return

    gsap.to('.chat-launcher', {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.about',
        start: 'top center',
        toggleActions: 'play none none reverse',
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
    }
  }, [isMounted])

  // Hero liquid fade-in + wing marquee. Presentation only.
  useEffect(() => {
    if (!isMounted || !introDone) return

    const ctx = gsap.context(() => {
      if (liquidRef.current) {
        gsap.fromTo(
          liquidRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.8, ease: ARCH_EASE }
        )
      }

      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 26,
          ease: 'none',
          repeat: -1,
        })
      }
    })

    return () => ctx.revert()
  }, [isMounted, introDone])

  // Sponsors: infinite 3D carousel. Cards rotate away from centre as they
  // travel, so the strip reads as a slowly turning cylinder.
  useEffect(() => {
    const track = sponsorTrackRef.current
    const view = sponsorViewRef.current
    if (!track || !view || !introDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = gsap.utils.toArray('[data-sponsor-card]', track)
    if (!cards.length) return

    const tween = gsap.to(track, {
      xPercent: -100 / 3,
      duration: 38,
      ease: 'none',
      repeat: -1,
    })
    sponsorTweenRef.current = tween

    const setters = cards.map((c) => ({
      ry: gsap.quickSetter(c, 'rotationY', 'deg'),
      z: gsap.quickSetter(c, 'z', 'px'),
      o: gsap.quickSetter(c, 'opacity'),
    }))

    const onTick = () => {
      const vr = view.getBoundingClientRect()
      // Skip the per-card work while the strip is off screen.
      if (vr.bottom < -200 || vr.top > window.innerHeight + 200) return

      const mid = vr.left + vr.width / 2
      const half = vr.width / 2 || 1

      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect()
        const dx = (r.left + r.width / 2 - mid) / half
        const clamped = Math.max(-1.4, Math.min(1.4, dx))
        setters[i].ry(-clamped * 24)
        setters[i].z(-Math.abs(clamped) * 150)
        // Only the faintest falloff — partner logos never read as disabled.
        setters[i].o(1 - Math.min(0.18, Math.abs(clamped) * 0.16))
      })
    }

    gsap.ticker.add(onTick)

    return () => {
      gsap.ticker.remove(onTick)
      tween.kill()
      sponsorTweenRef.current = null
    }
  }, [introDone])

  const slowSponsors = () => sponsorTweenRef.current?.timeScale(0.12)
  const resumeSponsors = () => sponsorTweenRef.current?.timeScale(1)

  if (!isMounted) {
    return null
  }

  return (
    <>
      {!introDone && (
        <ArchIntro
          progress={loadingProgress}
          ready={!isLoading}
          onDone={() => setIntroDone(true)}
        />
      )}

      {/* Scroll progress rail */}
      <div ref={progressRef} className="arch-progress" />

      <div ref={archScope} className="relative w-full text-arch-ink">
        {/* ── LIQUID FIELD ──────────────────────────────────────
            One fixed canvas behind the entire page. Content sections
            carry a beige scrim so copy stays legible over it. */}
        <div ref={liquidRef} className="fixed inset-0 z-0">
          <LiquidEther
            colors={LIQUID_COLORS}
            backgroundColor="#F4F3EF"
            mouseForce={18}
            cursorSize={110}
            isViscous={false}
            viscous={30}
            iterationsViscous={24}
            iterationsPoisson={24}
            resolution={0.42}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.4}
            autoIntensity={1.9}
            takeoverDuration={0.3}
            autoResumeDelay={2600}
            autoRampDuration={0.8}
            style={LIQUID_STYLE}
          />
        </div>

        <div className="relative z-10">
          <Chatbot />

          {/* ── HERO ──────────────────────────────────────────── */}
          <section className="relative flex min-h-screen w-full flex-col justify-between px-6 pb-8 pt-[76px] md:px-10">
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 py-12 md:grid-cols-12 md:gap-8">
              {/* Statement */}
              <div className="md:col-span-7">
                <h1
                  data-arch="lines"
                  className="arch-display arch-on-liquid text-[clamp(2.5rem,6.6vw,6.75rem)]"
                >
                  <span className="arch-split-line">
                    <span className="arch-line-inner">Computer</span>
                  </span>
                  <span className="arch-split-line">
                    <span className="arch-line-inner">Science</span>
                  </span>
                  <span className="arch-split-line">
                    <span className="arch-line-inner">Society</span>
                  </span>
                </h1>

                <div className="mt-10" data-arch="fade" data-arch-delay="0.25">
                  <p className="arch-lead arch-on-liquid max-w-lg">
                    The Computer Science Society of NIT Silchar — building the
                    structures students learn and ship inside.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a href="#about" className="arch-btn arch-btn-solid">
                      <span>Explore the society</span>
                    </a>
                    <Link to="/events" className="arch-btn">
                      <span>See events</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Workstation — follows the cursor */}
              <div
                className="h-[280px] w-full sm:h-[360px] md:col-span-5 lg:h-[520px]"
                data-arch="fade"
                data-arch-delay="0.35"
              >
                <ComputerModel />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-center border-t border-arch-line/70 py-5">
              <span className="arch-label text-center arch-on-liquid">
                Scroll ↓
              </span>
            </div>
          </section>

          {/* ── TICKER ────────────────────────────────────────── */}
          <section className="relative overflow-hidden border-y border-arch-ink bg-arch-ink py-5">
            <div
              ref={tickerRef}
              className="flex w-max items-center gap-16 whitespace-nowrap"
            >
              {[...Array(2)].map((_, dup) => (
                <React.Fragment key={dup}>
                  {[
                    'Development',
                    'Competitive Programming',
                    'Machine Learning',
                    'Design',
                    'Public Relations',
                    'Literature',
                    'Executive',
                  ].map((w) => (
                    <span
                      key={`${dup}-${w}`}
                      className="text-[13px] font-medium uppercase tracking-[0.18em] text-arch-bg"
                    >
                      {w}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* ── ABOUT ─────────────────────────────────────────── */}
          <section
            id="about"
            className="about relative w-full border-b border-arch-line bg-arch-bg/88 px-6 py-24 md:px-10 md:py-40"
          >
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
                {/* Statement */}
                <div className="md:col-span-7">
                  <h2
                    data-arch="lines"
                    className="arch-display text-[clamp(2.25rem,6vw,5.5rem)]"
                  >
                    <span className="arch-split-line">
                      <span className="arch-line-inner">Participate,</span>
                    </span>
                    <span className="arch-split-line">
                      <span className="arch-line-inner">
                        enjoy &amp; learn.
                      </span>
                    </span>
                  </h2>

                  <div
                    className="mt-12 max-w-xl"
                    data-arch="fade"
                    data-arch-delay="0.15"
                  >
                    <p className="arch-lead">
                      Run by the CSE department of NIT Silchar, the society
                      exists to impart academic, technical, and socio-cultural
                      awareness to the students of our college.
                    </p>
                    <p className="arch-body mt-6">
                      We build the structures — events, wings, mentorship, and
                      open projects — that let students learn in public and ship
                      real work.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      {/* legacy terminal input, kept for future use
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="arch-input"
                        placeholder="type a command..."
                        autoFocus
                      /> */}
                      <a href="#pillars" className="arch-btn">
                        <span>Meet the pillars</span>
                      </a>
                      <Link to="/wings" className="arch-btn arch-btn-ghost">
                        <span>Explore the wings</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* The society mark as a plain badge — flat black on a
                    black ring, no shader. */}
                <div className="md:col-span-5">
                  <figure className="flex items-center justify-center px-4 py-6 md:px-10 md:py-10">
                    <div
                      className="relative flex aspect-square w-full max-w-[420px] items-center justify-center rounded-full border border-arch-line p-9 md:p-12"
                      data-arch="fade"
                    >
                      <img
                        src="/images/css-logo-mark.png"
                        alt="Computer Science Society, NIT Silchar"
                        loading="lazy"
                        onLoad={() => {
                          // figure loaded callback
                          if (isLoading && loadingProgress < 80 && isMounted) {
                            setLoadingProgress(80)
                          }
                        }}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </section>

          {/* ── SPONSORS ──────────────────────────────────────── */}
          <section
            id="sponsors"
            className="relative w-full border-b border-arch-line bg-arch-bg/88 px-0 py-24 md:py-40"
          >
            <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-6">
                  <h2
                    data-arch="lines"
                    className="arch-display text-[clamp(2.25rem,6vw,5rem)]"
                  >
                    <span className="arch-split-line">
                      <span className="arch-line-inner">Our valued</span>
                    </span>
                    <span className="arch-split-line">
                      <span className="arch-line-inner">partners.</span>
                    </span>
                  </h2>
                </div>
                <div className="flex items-end md:col-span-6">
                  <p
                    className="arch-lead max-w-md"
                    data-arch="fade"
                    data-arch-delay="0.1"
                  >
                    We are grateful for the support from our partners who help
                    us empower the next generation of tech leaders.
                  </p>
                </div>
              </div>
            </div>

            {/* Infinite 3D carousel */}
            <div
              ref={sponsorViewRef}
              onMouseEnter={slowSponsors}
              onMouseLeave={resumeSponsors}
              className="arch-carousel relative mt-16 overflow-hidden border-y border-arch-line py-16"
            >
              <div
                ref={sponsorTrackRef}
                className="arch-carousel-track flex w-max items-stretch gap-6 px-3"
              >
                {[0, 1, 2].map((dup) =>
                  SPONSORS_LIST.map((sponsor) => (
                    <a
                      key={`${dup}-${sponsor.name}`}
                      data-sponsor-card
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-hidden={dup !== 0 ? 'true' : undefined}
                      tabIndex={dup !== 0 ? -1 : undefined}
                      className="group flex w-[280px] shrink-0 flex-col justify-between border border-arch-line bg-arch-card transition-colors duration-500 hover:border-arch-ink md:w-[340px]"
                    >
                      <div className="flex h-40 items-center justify-center px-8">
                        {sponsor.isSvg ? (
                          renderSponsorLogo(sponsor.logoKey)
                        ) : (
                          <img
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            loading="lazy"
                            className="max-h-20 max-w-full object-contain"
                          />
                        )}
                      </div>

                      <div className="flex items-end justify-between border-t border-arch-line px-7 py-5">
                        <div>
                          <p className="text-[17px] font-medium tracking-[-0.02em] text-arch-ink">
                            {sponsor.name}
                          </p>
                          <p className="mt-1 text-[13px] leading-snug text-arch-ink-3">
                            {sponsor.type}
                          </p>
                        </div>
                        <span className="shrink-0 translate-x-[-6px] text-arch-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="square"
                              strokeWidth="1.5"
                              d="M7 17 17 7M9 7h8v8"
                            />
                          </svg>
                        </span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
              <div
                className="mt-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
                data-arch="fade"
              >
                <p className="arch-lead max-w-md">
                  Interested in partnering with the society for the coming
                  season?
                </p>
                <button className="arch-btn shrink-0">
                  <span>Join as Sponsor</span>
                </button>
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

          {/* ── PILLARS ───────────────────────────────────────── */}
          <section
            id="pillars"
            className="relative w-full bg-arch-bg/88 px-6 py-24 md:px-10 md:py-40"
          >
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-6">
                  <h2
                    data-arch="lines"
                    className="arch-display text-[clamp(2.25rem,6vw,5rem)]"
                  >
                    <span className="arch-split-line">
                      <span className="arch-line-inner">Pillars of</span>
                    </span>
                    <span className="arch-split-line">
                      <span className="arch-line-inner">the society.</span>
                    </span>
                  </h2>
                </div>
                <div className="flex items-end md:col-span-6">
                  <p
                    className="arch-lead max-w-md"
                    data-arch="fade"
                    data-arch-delay="0.1"
                  >
                    The five foundational pillars that define the Computer
                    Science Society and drive our mission forward.
                  </p>
                </div>
              </div>

              {/* Stacking profile cards */}
              <div className="mx-auto mt-20 w-full max-w-5xl">
                <StackingCards
                  totalCards={PILLARS_TESTIMONIALS.length}
                  scaleMultiplier={0.04}
                  className="relative flex flex-col gap-10 md:gap-16 pb-[50vh]"
                >
                  {PILLARS_TESTIMONIALS.map((pillar, index) => {
                    const layoutId = `expandable-pillar-card-${pillar.name.replace(/ /g, '-')}`
                    return (
                      <StackingCardItem
                        key={pillar.name}
                        index={index}
                        topPosition={`${100 + index * 24}px`}
                        className="w-full h-[440px] sm:h-[410px] md:h-[360px]"
                      >
                        <motion.div
                          layoutId={layoutId}
                          onClick={() => setExpandedIndex(index)}
                          className="group relative flex h-full cursor-pointer select-none flex-col overflow-hidden border border-arch-line bg-arch-card md:flex-row"
                          whileHover="hover"
                          transition={archSpring}
                        >
                          {/* Portrait */}
                          <div className="relative h-40 w-full shrink-0 overflow-hidden border-b border-arch-line bg-arch-bg-alt md:h-full md:w-1/3 md:border-b-0 md:border-r">
                            <motion.img
                              layoutId={`image-${layoutId}`}
                              src={pillar.src}
                              alt={pillar.name}
                              className="h-full w-full object-cover object-center"
                              variants={{ hover: { scale: 1.04 } }}
                              transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </div>

                          {/* Text */}
                          <div className="relative flex h-full flex-1 flex-col justify-between p-6 md:p-10">
                            <div className="flex flex-col">
                              <motion.p
                                layoutId={`subtitle-${layoutId}`}
                                className="arch-label mb-3"
                              >
                                {pillar.designation}
                              </motion.p>
                              <motion.h3
                                layoutId={`title-${layoutId}`}
                                className="arch-title text-2xl md:text-3xl"
                              >
                                {pillar.name}
                              </motion.h3>
                            </div>

                            <p className="arch-body mt-5 line-clamp-3 grow">
                              {pillar.quote}
                            </p>

                            <div className="mt-4 flex items-center justify-end gap-2 text-arch-ink-3 transition-colors duration-500 group-hover:text-arch-ink">
                              <span className="arch-label">Read profile</span>
                              <svg
                                className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="square"
                                  strokeWidth="1.5"
                                  d="M5 12h14M13 6l6 6-6 6"
                                />
                              </svg>
                            </div>
                          </div>
                        </motion.div>
                      </StackingCardItem>
                    )
                  })}
                </StackingCards>
              </div>
            </div>
          </section>
        </div>

        {/* ── EXPANDED PROFILE ────────────────────────────────── */}
        <AnimatePresence>
          {expandedIndex !== null &&
            (() => {
              const pillar = PILLARS_TESTIMONIALS[expandedIndex]
              const layoutId = `expandable-pillar-card-${pillar.name.replace(/ /g, '-')}`
              return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={archTween}
                    onClick={() => setExpandedIndex(null)}
                    className="absolute inset-0 bg-arch-ink/25"
                  />

                  <motion.div
                    layoutId={layoutId}
                    transition={archSpring}
                    className="relative z-10 flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden border border-arch-line bg-arch-card md:h-[75vh] md:flex-row"
                  >
                    <button
                      onClick={() => setExpandedIndex(null)}
                      aria-label="Close profile"
                      className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-arch-line bg-arch-card text-arch-ink transition-colors duration-300 hover:bg-arch-ink hover:text-arch-bg"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>

                    {/* Portrait */}
                    <div className="relative h-48 w-full shrink-0 overflow-hidden border-b border-arch-line bg-arch-bg-alt md:h-full md:w-1/2 md:border-b-0 md:border-r">
                      <motion.img
                        layoutId={`image-${layoutId}`}
                        src={pillar.src}
                        alt={pillar.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Bio */}
                    <div className="flex h-full w-full select-none flex-col overflow-y-auto p-6 md:w-1/2 md:p-10">
                      <motion.p
                        layoutId={`subtitle-${layoutId}`}
                        className="arch-label mb-4"
                      >
                        {pillar.designation}
                      </motion.p>

                      <motion.h3
                        layoutId={`title-${layoutId}`}
                        className="arch-title mb-8 border-b border-arch-line pb-6 text-3xl md:text-4xl"
                      >
                        {pillar.name}
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{
                          delay: 0.15,
                          duration: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex flex-col gap-8"
                      >
                        <div>
                          <p className="arch-label mb-3">Quote</p>
                          <p className="arch-lead border-l border-arch-ink pl-4">
                            {pillar.quote}
                          </p>
                        </div>

                        <div>
                          <p className="arch-label mb-3">Biography</p>
                          <p className="arch-body">{pillar.bio}</p>
                        </div>

                        <div>
                          <p className="arch-label mb-3">Focus</p>
                          <p className="arch-body">{pillar.focus}</p>
                        </div>

                        <button
                          onClick={() => setExpandedIndex(null)}
                          className="arch-btn self-start"
                        >
                          <span>Close</span>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              )
            })()}
        </AnimatePresence>
      </div>
    </>
  )
}

export default React.memo(Home)
