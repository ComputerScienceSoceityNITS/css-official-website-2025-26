import React, { useState } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const MessageForm = ({ onSuccess }) => {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');
  const [name, setName] = useState(profile?.full_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast('Please enter your wish.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = name.trim() || profile?.full_name || (user?.email ? user.email.split('@')[0] : 'Anonymous');

      const { error } = await supabase.from('messages').insert([
        {
          message: message.trim(),
          name: displayName,
          approved: false,
        },
      ]);

      if (error) throw error;

      showToast('Wish sent for review ✨', 'success');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting Diwali wish:', error);
      const isRlsError = error?.code === '42501' || error?.message?.includes('row-level security');
      showToast(
        isRlsError
          ? 'Posting wishes is restricted by security policy. Please contact admin.'
          : error?.message || 'Failed to send wish.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg) => {
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-6 right-6 z-[300] px-4 py-2 bg-arch-ink text-arch-bg text-xs font-mono tracking-wider uppercase border border-arch-line shadow-2xl transition-all duration-300 transform translate-y-3 opacity-0';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
      }, 300);
    }, 2400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="arch-label text-[10px] text-arch-muted">
            // Message *
          </label>
          <span className="text-[10px] font-mono text-arch-faint">
            {message.length}/280
          </span>
        </div>
        <textarea
          value={message}
          maxLength={280}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share a wish or festive greeting..."
          className="w-full h-24 p-3 bg-arch-bg border border-arch-line text-arch-ink placeholder:text-arch-faint text-xs leading-relaxed font-sans focus:outline-none focus:border-arch-ink focus:bg-arch-card transition-colors resize-none"
          required
        />
      </div>

      <div>
        <label className="arch-label block text-[10px] text-arch-muted mb-1.5">
          // Signed As
        </label>
        <input
          type="text"
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
          placeholder={user ? profile?.full_name || 'Your Name' : 'Anonymous'}
          className="w-full px-3 py-2 bg-arch-bg border border-arch-line text-arch-ink placeholder:text-arch-faint text-xs font-mono focus:outline-none focus:border-arch-ink focus:bg-arch-card transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        className="arch-btn arch-btn-solid w-full py-2.5 text-xs font-mono tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border border-arch-bg border-t-transparent rounded-full animate-spin" />
            <span>Sending...</span>
          </span>
        ) : (
          <span>Post Wish</span>
        )}
      </button>
    </form>
  );
};

export default MessageForm;
