import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Star, 
  Smartphone, 
  Info, 
  Cpu, 
  Database, 
  Activity,
  Linkedin,
  Instagram,
  Facebook,
  ExternalLink
} from 'lucide-react'
import { FcAndroidOs } from "react-icons/fc"
import { IoLogoApple } from "react-icons/io5"

const AppDownload = () => {
  const screenshots = [
    { src: '/app/1000263222.png', alt: 'Splash Authentication' },
    { src: '/app/1000263223.png', alt: 'Sports Credits & Points' },
    { src: '/app/1000263226.png', alt: 'Community Feed & Ceremony' },
    { src: '/app/WhatsApp%20Image%202026-02-07%20at%2010.48.38%20AM.jpeg', alt: 'Match Center' },
    { src: '/app/WhatsApp%20Image%202026-02-07%20at%205.13.39%20PM.jpeg', alt: 'Feed View' },
    { src: '/app/WhatsApp%20Image%202026-02-07%20at%205.15.55%20PM.jpeg', alt: 'Events Schedule' },
    { src: '/app/WhatsApp%20Image%202026-02-07%20at%205.33.52%20PM.jpeg', alt: 'Score Details' }
  ]

  const developers = [
    {
      name: 'Nibir Deka',
      role: 'Dev Wing Head, CSS',
      photo: 'https://res.cloudinary.com/dp4sknsba/image/upload/v1786037454/Groom_2_jazg7b.png',
      socials: {
        linkedin: 'https://www.linkedin.com/in/nibirdeka/',
        instagram: 'https://www.instagram.com/nibirdeka.in/',
        facebook: 'https://www.facebook.com/nibir.deka.605645'
      }
    },
    {
      name: 'Kallul Gogoi',
      role: 'Dev Wing Head, CSS',
      photo: 'https://res.cloudinary.com/difnkaes4/image/upload/v1787997230/WhatsApp_Image_2026-08-29_at_3.16.08_PM_xi0y3z.jpg',
      socials: {
        linkedin: 'https://www.linkedin.com/in/kallul-gogoi-00a5152a0/',
        instagram: 'https://www.instagram.com/kallul_gogoi33/',
        facebook: 'https://www.facebook.com/profile.php?id=100067160496166'
      }
    }
  ]

  return (
    <div className="w-full min-h-screen bg-arch-bg text-arch-ink font-sans selection:bg-arch-ink selection:text-arch-bg">
      
      {/* Full-width Announcement Banner directly below the navbar */}
      <div className="w-full bg-[#FCFAF2] border-b border-arch-line py-4 px-6">
        <div className="mx-auto max-w-[1200px] flex items-start gap-4">
          <Info className="h-5 w-5 shrink-0 text-arch-ink-3 mt-0.5" />
          <div>
            <span className="arch-label mb-0.5 block text-xs">Status Notice</span>
            <p className="text-sm text-arch-ink-2 leading-relaxed">
              This application was launched in January for the CSS Olympics. Because the event has concluded, active API servers have been spun down and some features may no longer function as expected.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
        <section className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-arch-line pb-12">
          {/* App Icon Card */}
          <div className="flex shrink-0 items-center justify-center bg-black border-4 border-arch-ink w-32 h-32 md:w-40 md:h-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src="/images/css-logo-mark.png" 
              alt="CSS Logo" 
              className="h-20 w-20 md:h-24 md:w-24 object-contain invert"
            />
          </div>

          {/* App Title & Metadata */}
          <div className="flex-1">
            <span className="arch-label mb-2 block">Official Release</span>
            <h1 className="arch-display text-4xl md:text-6xl leading-tight">
              CSS Olympics
            </h1>
            <p className="text-arch-ink-3 text-base md:text-lg font-medium mt-1">
              Computer Science Society, NIT Silchar
            </p>
            <p className="text-xs text-arch-faint font-mono mt-2">
              package: org.nits.css.olympics
            </p>

            {/* PlayStore Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:flex md:flex-wrap md:items-center md:gap-8 mt-6 border-t border-arch-line pt-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 font-semibold text-lg text-arch-ink">
                  4.9 <Star className="h-4 w-4 fill-arch-ink text-arch-ink" />
                </div>
                <p className="text-[10px] md:text-xs text-arch-faint uppercase tracking-wider font-medium mt-1">50+ Reviews</p>
              </div>
              <div className="hidden md:block h-8 w-px bg-arch-line" />
              
              <div className="text-center md:text-left">
                <p className="font-semibold text-lg text-arch-ink">300+</p>
                <p className="text-[10px] md:text-xs text-arch-faint uppercase tracking-wider font-medium mt-1">Downloads</p>
              </div>
              <div className="hidden md:block h-8 w-px bg-arch-line" />
              
              <div className="text-center md:text-left">
                <p className="font-semibold text-lg text-arch-ink">15 MB</p>
                <p className="text-[10px] md:text-xs text-arch-faint uppercase tracking-wider font-medium mt-1">Size</p>
              </div>
              <div className="hidden md:block h-8 w-px bg-arch-line" />
              
              <div className="text-center md:text-left flex flex-col items-center md:items-start">
                <div className="border border-arch-ink px-1.5 py-0.5 text-xs font-bold leading-none w-fit">
                  PEGI 3
                </div>
                <p className="text-[10px] md:text-xs text-arch-faint uppercase tracking-wider font-medium mt-1">Rated for 3+</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action / Install Buttons */}
        <section className="py-10 border-b border-arch-line flex flex-col sm:flex-row gap-4">
          <a 
            href="/downloads/css-app.apk" 
            download 
            className="arch-btn arch-btn-solid flex items-center justify-center gap-3 px-10 py-4 font-semibold text-sm w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span>Install APK (Android)</span>
          </a>
          <button 
            disabled 
            className="arch-btn arch-btn-ghost flex items-center justify-center gap-3 px-10 py-4 font-semibold text-sm text-arch-faint border-arch-line w-full sm:w-auto cursor-not-allowed"
          >
            <IoLogoApple className="h-5 w-5" />
            <span>iOS TestFlight (Coming Soon)</span>
          </button>
        </section>

        {/* Screenshot Carousel */}
        <section className="py-12 border-b border-arch-line">
          <h2 className="arch-label mb-6">Screenshots</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-6 px-6">
            {screenshots.map((shot, idx) => (
              <div 
                key={idx}
                className="shrink-0 snap-start border border-arch-line bg-arch-card p-2 w-[240px] md:w-[280px]"
              >
                <div className="relative aspect-[9/19.5] overflow-hidden bg-zinc-950">
                  <img 
                    src={shot.src} 
                    alt={shot.alt} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] text-arch-faint text-center font-medium mt-2 font-mono uppercase tracking-wider">
                  {idx + 1}. {shot.alt.split(' ')[0]} Frame
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Content & Metrics Details */}
        <section className="py-12 border-b border-arch-line grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Main Story Content */}
          <div className="md:col-span-8 space-y-6">
            <h2 className="arch-title text-2xl md:text-3xl">About this app</h2>
            <p className="arch-lead">
              Every developer dreams of having real users on their product. This app reached 300+ active users in just 3 days.
            </p>
            <div className="arch-body space-y-4">
              <p>
                During the CSS Olympics organized by the Computer Science Society, NIT Silchar, DEV Wing members Nibir Deka and Kallul Gogoi had a simple idea.
              </p>
              <p>
                What if they built something that made the entire event digital and interactive for CSE students?
              </p>
              <p>
                Instead of building another standard portfolio project, they turned that idea into a real-time event ecosystem using React Native, Express, MongoDB, React, and Redis.
              </p>
              <p>
                Students could register for events, see live schedules, and track match scores in real time.
              </p>
              <p>
                To make it engaging, they added a virtual points investment game where everyone got 1000 points to invest in teams before matches. Spectators became active participants.
              </p>
              <p>
                They also integrated social features where students could post, like, and comment on match moments. 📸
              </p>
              <p className="italic text-arch-ink-3">
                In their upcoming development logs, they will share the bugs they faced, the struggles during development, and how they solved them under real pressure.
              </p>
            </div>
          </div>

          {/* Performance & Metrics Panel */}
          <div className="md:col-span-4 border border-arch-line bg-arch-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="arch-label mb-6 block border-b border-arch-line pb-3">Performance (72 Hours)</h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="p-2 border border-arch-line h-10 w-10 flex items-center justify-center shrink-0">
                    <Activity className="h-5 w-5 text-arch-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-arch-ink text-sm">100,000+ API Calls</h4>
                    <p className="text-xs text-arch-ink-3 mt-0.5">High volume traffic handled smoothly.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="p-2 border border-arch-line h-10 w-10 flex items-center justify-center shrink-0">
                    <Cpu className="h-5 w-5 text-arch-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-arch-ink text-sm">60,000+ Cache Reads</h4>
                    <p className="text-xs text-arch-ink-3 mt-0.5">Redis handled high-frequency queries.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="p-2 border border-arch-line h-10 w-10 flex items-center justify-center shrink-0">
                    <Database className="h-5 w-5 text-arch-ink" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-arch-ink text-sm">MongoDB Stability</h4>
                    <p className="text-xs text-arch-ink-3 mt-0.5">Stayed responsive during peak matches.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border-t border-arch-line pt-6 mt-8">
              <p className="text-xs text-arch-faint leading-relaxed font-mono">
                System design, race conditions, caching, and database indexing optimized for extreme user concurrency.
              </p>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="py-12">
          <h2 className="arch-label mb-8">Developers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developers.map((dev) => (
              <div 
                key={dev.name}
                className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-6 border border-arch-line bg-arch-card p-6"
              >
                {/* Photo */}
                <div className="h-24 w-24 border border-arch-line overflow-hidden shrink-0 bg-arch-bg-alt">
                  <img 
                    src={dev.photo} 
                    alt={dev.name} 
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>

                {/* Info & Socials */}
                <div className="flex-1 min-w-0">
                  <h3 className="arch-title text-xl md:text-2xl truncate">{dev.name}</h3>
                  <p className="text-sm text-arch-ink-3 mt-1 uppercase tracking-wider font-medium text-[11px]">
                    {dev.role}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-arch-ink-3">
                    {dev.socials.linkedin && (
                      <a 
                        href={dev.socials.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${dev.name} LinkedIn`}
                        className="hover:text-arch-ink transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {dev.socials.instagram && (
                      <a 
                        href={dev.socials.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${dev.name} Instagram`}
                        className="hover:text-arch-ink transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {dev.socials.facebook && (
                      <a 
                        href={dev.socials.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`${dev.name} Facebook`}
                        className="hover:text-arch-ink transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default AppDownload