import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DiyaIcon from './DiyaIcon';

const DiwaliPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    const hasDismissed = sessionStorage.getItem('css_diwali_popup_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('css_diwali_popup_dismissed', 'true');
    setIsOpen(false);
  };

  const displayName = profile?.full_name?.split(' ')[0] || (user?.email ? user.email.split('@')[0] : null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md overflow-hidden border border-arch-line bg-arch-card shadow-2xl text-arch-ink"
          >
            {/* Minimal ambient warm halo */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/10 blur-xl" />

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center border border-arch-line/70 text-arch-muted hover:border-arch-ink hover:text-arch-ink bg-arch-bg/85 backdrop-blur-xs transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Diwali GIF Banner */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-transparent  border-arch-line flex items-center justify-center">
              <img
                src="/images/diwali.gif"
                alt="Happy Diwali Celebration Banner"
                className="w-full h-full object-cover bg-transparent select-none"
              />
            </div>

            {/* Modal Body & Greeting */}
            <div className="p-4 pt-0.5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DiyaIcon size="sm" />
                <span className="arch-label text-[10px] tracking-widest text-amber-800">
                  // HAPPY DIWALI
                </span>
                <DiyaIcon size="sm" />
              </div>

              <h2 className="arch-title text-2xl font-bold tracking-tight text-arch-ink mt-1">
                {displayName ? `Wishing You Light, ${displayName}` : 'Festive Greetings'}
              </h2>

              <p className="arch-body text-xs text-arch-muted mt-2 max-w-sm mx-auto leading-relaxed">
                May this Diwali spark clarity, breakthroughs, and joy in everything you build.
              </p>

              {/* Clean CTA */}
              <div className="mt-5">
                <button
                  onClick={handleClose}
                  className="arch-btn arch-btn-solid w-full py-3 text-xs font-mono font-medium tracking-widest uppercase cursor-pointer"
                >
                  <span>Continue</span>
                </button>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[10px] font-mono text-arch-faint tracking-wider">
                  COMPUTER SCIENCE SOCIETY · NITS
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DiwaliPopup;
