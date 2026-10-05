import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSignInAlt } from 'react-icons/fa'
import { archSpring, archTween } from '../hooks/useArchAnim'

const menuItems = [
    { path: '/', label: 'Home' },
    // { path: '/developers', label: 'Developers' },
    { path: '/members', label: 'Members' },
    { path: '/events', label: 'Events' },
    { path: '/wings', label: 'Wings' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/materials', label: 'Materials' },
    { path: '/app-download', label: 'App' }
]

const LOGO = 'https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg'

/**
 * The society mark is white artwork drawn for the old dark theme, so it
 * disappears on beige. It sits on a black chip instead of being recoloured:
 * that reads correctly whether the source has a transparent or a black
 * background, and looks deliberate rather than patched.
 */
const LogoMark = ({ className = 'h-11 w-11' }) => (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-black   ${className}`}>
        <img src={LOGO} alt="Computer Science Society" className="h-full w-full object-contain" />
    </span>
)

export const NavbarDemo = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const { user, profile } = useAuth()

    const isHome = location.pathname === '/'
    // Transparent only over the home hero; every other route needs the bar
    // to sit on its own ground so copy never runs underneath it.
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
                className={`fixed top-0 left-0 z-[200] w-full font-sans transition-[background-color,border-color,backdrop-filter] duration-500   ${solid
                        ? 'border-b border-arch-line bg-arch-bg/94 backdrop-blur-xl'
                        : 'border-b border-transparent bg-transparent'
                    }`}
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={archTween}
            >
                <div className="mx-auto flex h-[76px] w-full max-w-[1600px] items-center justify-between gap-6 px-6 md:px-10">
                    {/* Identity */}
                    <Link
                        to="/"
                        aria-label="Computer Science Society — home"
                        className="flex items-center gap-3.5 transition-opacity duration-300 hover:opacity-70"
                    >
                        <LogoMark className="h-11 w-11" />
                        <span className="hidden leading-[1.15] sm:block">
                            <span className="block text-[15px] font-semibold tracking-[-0.02em] text-arch-ink">
                                Computer Science Society
                            </span>
                            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-arch-ink-3">
                                NIT Silchar
                            </span>
                        </span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden items-center gap-2 md:flex">
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
                                        className={`relative z-10 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300   ${active ? 'text-arch-ink' : 'text-arch-ink-3 group-hover:text-arch-ink'
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                    {active ? (
                                        <motion.span
                                            layoutId="active-pill"
                                            className="absolute inset-x-4 bottom-1 h-px bg-arch-ink"
                                            transition={archSpring}
                                        />
                                    ) : (
                                        <span className="absolute inset-x-4 bottom-1 h-px origin-right scale-x-0 bg-arch-ink/45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop account */}
                    <div className="hidden items-center md:flex">
                        {user ? (
                            <Link to="/dashboard">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={archSpring}
                                    className="flex items-center gap-3 border border-arch-line bg-arch-card px-4 py-2.5 transition-colors duration-300 hover:border-arch-ink"
                                >
                                    <img
                                        src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                                        alt=""
                                        className="h-6 w-6 rounded-full border border-arch-line object-cover"
                                    />
                                    <span className="text-sm font-medium tracking-[-0.005em] text-arch-ink">
                                        Profile
                                    </span>
                                </motion.div>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    transition={archSpring}
                                    className="arch-btn arch-btn-solid px-6 py-3"
                                >
                                    <FaSignInAlt className="text-[11px]" />
                                    <span>Sign In</span>
                                </motion.button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile trigger — the sheet is the whole nav now */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-arch-line bg-arch-card text-arch-ink transition-colors duration-300 hover:border-arch-ink md:hidden"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="square"
                                strokeWidth="1.5"
                                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 17h16'}
                            />
                        </svg>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile sheet */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[190] overflow-y-auto bg-arch-bg pt-[76px] md:hidden"
                    >
                        <nav className="flex min-h-[calc(100vh-76px)] flex-col justify-between px-6 pb-12 pt-6">
                            <ul>
                                {menuItems.map((item, i) => (
                                    <motion.li
                                        key={item.path}
                                        initial={{ opacity: 0, y: 22 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                        className="border-b border-arch-line"
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block py-5   ${location.pathname === item.path ? 'text-arch-ink' : 'text-arch-ink-3'
                                                }`}
                                        >
                                            <span className="arch-title text-[2rem]">{item.label}</span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Account — replaces the old bottom tab bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="pt-12"
                            >
                                {user ? (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 border border-arch-line bg-arch-card px-5 py-4"
                                    >
                                        <img
                                            src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                                            alt=""
                                            className="h-10 w-10 rounded-full border border-arch-line object-cover"
                                        />
                                        <span>
                                            <span className="block text-[15px] font-medium tracking-[-0.01em] text-arch-ink">
                                                Your profile
                                            </span>
                                            <span className="mt-0.5 block text-[13px] text-arch-ink-3">
                                                Dashboard &amp; registrations
                                            </span>
                                        </span>
                                    </Link>
                                ) : (
                                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                                        <button className="arch-btn arch-btn-solid w-full py-4">
                                            <FaSignInAlt className="text-[11px]" />
                                            <span>Sign In</span>
                                        </button>
                                    </Link>
                                )}

                                <p className="arch-body mt-10 text-[13px]">
                                    National Institute of Technology, Silchar
                                </p>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
