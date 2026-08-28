import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaSignInAlt } from 'react-icons/fa'
import { MdAccountCircle } from "react-icons/md"
import { KeycapButton } from './ui/KeycapButton'

const menuItems = [
    { path: '/', label: 'Home' },
    // { path: '/developers', label: 'Developers' },
    { path: '/members', label: 'Members' },
    { path: '/events', label: 'Events' },
    { path: '/wings', label: 'Wings' },
    { path: '/materials', label: 'Materials' }
]

export const NavbarDemo = () => {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()
    const { user, profile } = useAuth()

    return (
        <motion.nav
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl h-16 bg-slate-950/70 border border-white/[0.08] backdrop-blur-xl shadow-xl shadow-black/40 rounded-2xl flex items-center px-4 md:px-6 transition-all duration-300 font-sans"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div className="flex justify-between items-center w-full">
                {/* Logo - Left on desktop */}
                <div className="flex items-center md:flex-1">
                    <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
                        <img
                            src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg"
                            alt="CSS Logo"
                            className="h-9 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Menu - Center */}
                <div className="hidden md:flex items-center space-x-1 relative">
                    {menuItems.map((item) => (
                        <Link
                            to={item.path}
                            key={item.path}
                            className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-xl group"
                        >
                            <span className={`relative z-10 transition-colors duration-200 ${location.pathname === item.path
                                    ? 'text-white'
                                    : 'text-slate-400 group-hover:text-white'
                                }`}>
                                {item.label}
                            </span>
                            {location.pathname === item.path ? (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-xl"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] rounded-xl transition-colors duration-200" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth/Profile - Right */}
                <div className="hidden md:flex items-center space-x-4 md:flex-1 justify-end">
                    {user ? (
                        <Link to="/dashboard">
                            <KeycapButton className="keycap-wide h-10 px-3 py-1 flex items-center gap-2 bg-slate-900 border border-white/[0.08] hover:border-white/20">
                                <img
                                    src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full border border-white/15 object-cover"
                                />
                                <span className="text-sm font-medium">Profile</span>
                            </KeycapButton>
                        </Link>
                    ) : (
                        <Link to="/auth">
                            <KeycapButton className="keycap-wide keycap-cyan h-10 px-4">
                                <div className="flex items-center gap-2">
                                    <FaSignInAlt className="text-sm" />
                                    <span>Sign In</span>
                                </div>
                            </KeycapButton>
                        </Link>
                    )}
                </div>

                {/* Mobile Layout */}
                <div className="flex md:hidden items-center justify-between w-full">
                    {/* Mobile Menu Button - Left */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:bg-slate-900 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Logo - Center */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                        <Link to="/">
                            <img
                                src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg"
                                alt="CSS Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Mobile Profile/Auth - Right */}
                    <div className="flex items-center">
                        {user ? (
                            <Link to="/dashboard">
                                <img
                                    src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-white/15 object-cover"
                                />
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <div className="p-2 rounded-xl bg-slate-900/60 border border-white/[0.08] text-slate-300">
                                    <MdAccountCircle className="w-5 h-5 text-slate-300" />
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-slate-950/95 border border-white/[0.08] absolute top-18 left-0 w-full shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden p-4 space-y-1.5"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        {menuItems.map((item) => (
                            <Link
                                to={item.path}
                                key={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block"
                            >
                                <div className={`relative px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${location.pathname === item.path
                                        ? 'text-white bg-white/[0.08] border border-white/[0.08]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                    }`}>
                                    {item.label}
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}