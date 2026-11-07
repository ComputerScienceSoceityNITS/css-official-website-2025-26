import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSignInAlt } from 'react-icons/fa'
import { archSpring, archTween } from '../hooks/useArchAnim'

const menuItems = [
  { path: '/', label: 'Home' },
  { path: '/members', label: 'Members' },
  { path: '/events', label: 'Events' },
  { path: '/wings', label: 'Wings' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/materials', label: 'Materials' },
  { path: '/app-download', label: 'App' }
]

const LOGO = 'https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg'

const LogoMark = ({ className = 'h-11 w-11' }) => (
  <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-black ${className}`}>
    <img src={LOGO} alt="Computer Science Society" className="h-full w-full object-contain" />
  </span>
)

// Elegant, refined warm Diwali palette for festive rice lights
const festiveLights = [
  { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.75)', wire: 10 },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.75)', wire: 16 },
  { color: '#ea580c', glow: 'rgba(234, 88, 12, 0.75)', wire: 12 },
  { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.75)', wire: 18 },
  { color: '#d97706', glow: 'rgba(217, 119, 6, 0.75)', wire: 14 },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.75)', wire: 12 },
  { color: '#ea580c', glow: 'rgba(234, 88, 12, 0.75)', wire: 17 },
  { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.75)', wire: 13 },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.75)', wire: 19 },
  { color: '#d97706', glow: 'rgba(217, 119, 6, 0.75)', wire: 11 },
  { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.75)', wire: 15 },
  { color: '#ea580c', glow: 'rgba(234, 88, 12, 0.75)', wire: 13 },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.75)', wire: 18 },
  { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.75)', wire: 12 },
]

export const NavbarDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, profile } = useAuth()

  const isHome = location.pathname === '/'
  const solid = scrolled || isOpen || !isHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 z-[200] w-full font-sans transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? 'border-b border-arch-line bg-arch-bg/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(245,158,11,0.04)]'
            : 'border-b border-arch-line/40 bg-arch-bg/60 backdrop-blur-md'
        }`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={archTween}
      >
        {/* Subtle festoon garland (Hanging Micro Diwali Lights across navbar bottom border) */}
        <div className="absolute inset-x-0 bottom-0 h-0 pointer-events-none overflow-visible z-30">
          <div className="relative w-full max-w-[1600px] mx-auto px-6 md:px-10 flex justify-between">
            {festiveLights.map((bulb, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center"
                style={{
                  display: idx % 2 === 1 && typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex'
                }}
              >
                {/* Micro Wire */}
                <div
                  className="w-px bg-amber-800/40"
                  style={{ height: `${bulb.wire}px` }}
                />
                {/* Glow Bulb */}
                <motion.div
                  animate={{
                    opacity: [0.75, 1, 0.65, 0.95],
                    scale: [0.9, 1.1, 0.85, 1],
                  }}
                  transition={{
                    duration: 2.2 + (idx % 4) * 0.4,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                    delay: idx * 0.14,
                  }}
                  className="relative -mt-0.5 rounded-full"
                  style={{
                    width: '5px',
                    height: '6px',
                    backgroundColor: bulb.color,
                    boxShadow: `0 0 6px ${bulb.glow}, 0 0 12px ${bulb.glow}`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10">
          {/* Identity */}
          <Link
            to="/"
            aria-label="Computer Science Society — home"
            className="flex items-center gap-3.5 transition-opacity duration-300 hover:opacity-80"
          >
            <LogoMark className="h-11 w-11" />
            <div className="hidden leading-[1.15] sm:block">
              <div className="flex items-center gap-2">
                <span className="block text-[15px] font-semibold tracking-[-0.02em] text-arch-ink">
                  Computer Science Society
                </span>
                {/* Minimal Diwali Pill */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-amber-600/40 bg-amber-500/10 text-amber-900 rounded-none">
                  <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                  Diwali
                </span>
              </div>
              <span className="mt-0.5 block text-[11px] font-mono uppercase tracking-[0.16em] text-arch-muted">
                NIT Silchar
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  to={item.path}
                  key={item.path}
                  aria-current={active ? 'page' : undefined}
                  className="group relative px-4 py-2.5"
                >
                  <span
                    className={`relative z-10 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      active ? 'text-arch-ink' : 'text-arch-muted group-hover:text-arch-ink'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active ? (
                    <motion.span
                      layoutId="active-nav-line"
                      className="absolute inset-x-4 bottom-1 h-0.5 bg-arch-ink"
                      transition={archSpring}
                    />
                  ) : (
                    <span className="absolute inset-x-4 bottom-1 h-0.5 origin-right scale-x-0 bg-arch-ink/40 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop Account */}
          <div className="hidden items-center md:flex">
            {user ? (
              <Link to="/dashboard">
                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={archSpring}
                  className="flex items-center gap-2.5 border border-arch-line bg-arch-card px-3.5 py-2 transition-colors duration-300 hover:border-arch-ink shadow-sm"
                >
                  <img
                    src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                    alt=""
                    className="h-6 w-6 rounded-full border border-arch-line object-cover"
                  />
                  <span className="text-xs font-mono font-medium text-arch-ink">
                    {profile?.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </motion.div>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  transition={archSpring}
                  className="arch-btn arch-btn-solid px-5 py-2.5 text-xs font-mono tracking-widest uppercase"
                >
                  <FaSignInAlt className="text-[10px]" />
                  <span>Sign In</span>
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-arch-line bg-arch-card text-arch-ink transition-colors duration-200 hover:border-arch-ink md:hidden"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="square"
                strokeWidth="1.5"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 17h16'}
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[190] overflow-y-auto bg-arch-bg pt-[76px] md:hidden"
          >
            <nav className="flex min-h-[calc(100vh-76px)] flex-col justify-between px-6 pb-10 pt-4">
              <ul>
                {menuItems.map((item, i) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-arch-line"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-4 ${location.pathname === item.path ? 'text-arch-ink' : 'text-arch-muted'}`}
                    >
                      <span className="arch-title text-2xl font-medium">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-8">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3.5 border border-arch-line bg-arch-card p-3.5"
                  >
                    <img
                      src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                      alt=""
                      className="h-9 w-9 rounded-full border border-arch-line object-cover"
                    />
                    <div>
                      <span className="block text-sm font-medium text-arch-ink">
                        {profile?.full_name || 'Your Profile'}
                      </span>
                      <span className="text-xs text-arch-muted font-mono">
                        View Dashboard &amp; Events
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <button className="arch-btn arch-btn-solid w-full py-3.5 font-mono text-xs tracking-wider">
                      <FaSignInAlt className="text-xs" />
                      <span>Sign In</span>
                    </button>
                  </Link>
                )}
                <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-arch-faint">
                  <span>NIT SILCHAR</span>
                  <span className="text-amber-800">🪔 SHUBH DEEPAVALI</span>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
export default NavbarDemo
