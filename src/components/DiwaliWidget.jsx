import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import AdminPanel from './AdminPanelDiwali';
import DiyaIcon from './DiyaIcon';

const DiwaliWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const { user, profile: authProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const adminStatus =
      authProfile?.role === 'admin' ||
      authProfile?.is_admin === true ||
      authProfile?.admin === true ||
      (authProfile?.email && authProfile.email.includes('admin')) ||
      (user?.email && user.email.includes('admin'));

    setIsAdmin(!!adminStatus);
  }, [user, authProfile]);

  return (
    <div className="fixed bottom-6 right-6 z-[160] font-sans">
      {/* Floating Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Diwali Wishes"
        className="group relative flex items-center gap-2.5 bg-arch-card border border-arch-line px-3 py-2 shadow-lg hover:border-arch-ink transition-all duration-300"
      >
        <DiyaIcon size="sm" />
        <span className="text-xs font-mono font-medium text-arch-ink">
          Diwali Wall
        </span>
        <span className="text-xs font-mono text-arch-muted ml-0.5">
          {isOpen ? '✕' : '↑'}
        </span>
      </motion.button>

      {/* Popout Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-12 right-0 w-[340px] sm:w-[380px] max-w-[calc(100vw-2rem)] bg-arch-card border border-arch-line shadow-2xl overflow-hidden z-20"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-arch-line bg-arch-bg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="arch-title text-sm font-semibold text-arch-ink">
                  Diwali Wishes
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-arch-muted hover:text-arch-ink text-sm p-1 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-arch-line bg-arch-bg font-mono text-xs">
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 py-2 text-center transition-colors border-b-2 font-medium ${
                  activeTab === 'view'
                    ? 'border-arch-ink text-arch-ink bg-arch-card'
                    : 'border-transparent text-arch-muted hover:text-arch-ink'
                }`}
              >
                Wishes
              </button>
              <button
                onClick={() => setActiveTab('send')}
                className={`flex-1 py-2 text-center transition-colors border-b-2 font-medium ${
                  activeTab === 'send'
                    ? 'border-arch-ink text-arch-ink bg-arch-card'
                    : 'border-transparent text-arch-muted hover:text-arch-ink'
                }`}
              >
                + Write
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex-1 py-2 text-center transition-colors border-b-2 font-medium ${
                    activeTab === 'admin'
                      ? 'border-arch-ink text-arch-ink bg-arch-card'
                      : 'border-transparent text-arch-muted hover:text-arch-ink'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="p-3.5 max-h-[380px] overflow-y-auto">
              {activeTab === 'view' && <MessageList />}
              {activeTab === 'send' && (
                <MessageForm onSuccess={() => setActiveTab('view')} />
              )}
              {activeTab === 'admin' && isAdmin && <AdminPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiwaliWidget;
