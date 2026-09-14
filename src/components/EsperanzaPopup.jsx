import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EsperanzaPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't show popup if already on the Esperanza page
    if (location.pathname === '/esperanza') {
      setIsOpen(false);
      return;
    }

    // Check if user dismissed the popup in the current session
    const hasDismissed = sessionStorage.getItem('esperanza_popup_dismissed');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleClose = () => {
    sessionStorage.setItem('esperanza_popup_dismissed', 'true');
    setIsOpen(false);
  };

  const handleRegisterClick = () => {
    sessionStorage.setItem('esperanza_popup_dismissed', 'true');
    setIsOpen(false);
    navigate('/esperanza');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden border border-arch-line bg-arch-bg p-6 sm:p-8 shadow-2xl text-arch-ink"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close announcement"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border border-arch-line/60 text-arch-muted transition-colors hover:border-arch-ink hover:text-arch-ink"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Badge */}
            <div className="mb-4">
              <span className="arch-label inline-block bg-arch-ink px-3 py-1 text-[9px] uppercase tracking-widest text-arch-bg font-semibold">
                // ANNUAL FRESHERS EVENT
              </span>
            </div>

            {/* Logo Image */}
            <div className="relative mb-6 flex justify-center py-4 bg-arch-bg-alt/70 border border-arch-line/40">
              <img
                src="/images/esperanzaLogo.png"
                alt="Esperanza Logo"
                className="h-32 sm:h-40 object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="arch-title text-2xl sm:text-3xl font-bold tracking-tight text-arch-ink">
                ESPERANZA 2026
              </h2>
              <p className="arch-body mt-2 text-xs sm:text-sm text-arch-muted leading-relaxed max-w-sm mx-auto">
                Registrations are live for Rampwalk, Rizz Show, and Cultural performances. Secure your spot today!
              </p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleRegisterClick}
                className="arch-btn arch-btn-solid w-full sm:flex-1 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <span>Register for Esperanza</span>
              </button>
              <button
                onClick={handleClose}
                className="arch-btn arch-btn-ghost w-full sm:w-auto px-5 py-3.5 text-xs font-medium text-arch-muted hover:text-arch-ink transition-colors"
              >
                <span>Dismiss</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EsperanzaPopup;
