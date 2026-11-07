import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const DiyaLike = ({ messageId, initialLikeCount = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    checkIfLiked();
    fetchLikeCount();
  }, [messageId, user]);

  const getStorageKey = () => `diya_liked_${messageId}`;

  const checkIfLiked = async () => {
    // 1. Check local storage first (instant response for both guests and logged-in users)
    const localLiked = localStorage.getItem(getStorageKey()) === 'true';
    if (localLiked) {
      setIsLiked(true);
      return;
    }

    // 2. If logged in, check database message_likes table
    if (!user) {
      setIsLiked(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('message_likes')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setIsLiked(true);
        localStorage.setItem(getStorageKey(), 'true');
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      // 1. Try reading from message_likes
      const { count, error } = await supabase
        .from('message_likes')
        .select('*', { count: 'exact', head: true })
        .eq('message_id', messageId);

      if (!error && count !== null && count > 0) {
        setLikeCount(count);
        return;
      }

      // 2. Fallback to messages table like_count
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('like_count')
        .eq('id', messageId)
        .maybeSingle();

      if (!msgError && msgData && msgData.like_count !== null) {
        setLikeCount(msgData.like_count);
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    if (isAnimating) return;
    setIsAnimating(true);

    const willLike = !isLiked;
    const newCount = Math.max(0, likeCount + (willLike ? 1 : -1));

    // Optimistic UI update immediately
    setIsLiked(willLike);
    setLikeCount(newCount);
    if (willLike) {
      localStorage.setItem(getStorageKey(), 'true');
      animateLike();
    } else {
      localStorage.removeItem(getStorageKey());
      animateUnlike();
    }

    try {
      let dbUpdated = false;

      // 1. If message_likes table has RLS policy / user is logged in, try message_likes
      if (user) {
        if (willLike) {
          const { error } = await supabase.from('message_likes').insert([
            {
              message_id: messageId,
              user_id: user.id,
            },
          ]);
          if (!error) dbUpdated = true;
        } else {
          const { error } = await supabase
            .from('message_likes')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', user.id);
          if (!error) dbUpdated = true;
        }
      }

      // 2. Also sync to messages table like_count so likes persist reliably
      const { error: updateMsgErr } = await supabase
        .from('messages')
        .update({ like_count: newCount })
        .eq('id', messageId);

      if (!updateMsgErr) {
        dbUpdated = true;
      }

      if (!dbUpdated && !updateMsgErr) {
        console.warn('Could not update like in database, kept locally.');
      }
    } catch (error) {
      console.error('Error toggling diya like:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const animateLike = () => {
    const diyaEl = document.getElementById(`diya-btn-${messageId}`);
    const flameEl = document.getElementById(`flame-like-${messageId}`);

    if (diyaEl && flameEl) {
      const tl = gsap.timeline();
      tl.to(diyaEl, {
        scale: 1.15,
        duration: 0.18,
        ease: 'back.out(2)',
      })
        .to(diyaEl, {
          scale: 1,
          duration: 0.12,
        })
        .fromTo(
          flameEl,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
          '-=0.15'
        );

      // Micro sparks
      const sparks = document.querySelectorAll(`.spark-${messageId}`);
      sparks.forEach((spark, idx) => {
        gsap.fromTo(
          spark,
          { scale: 0, opacity: 1, x: 0, y: 0 },
          {
            scale: 1,
            opacity: 0,
            x: (idx - 1) * 12,
            y: -14,
            duration: 0.45,
            delay: idx * 0.04,
            ease: 'power2.out',
          }
        );
      });
    }
  };

  const animateUnlike = () => {
    const flameEl = document.getElementById(`flame-like-${messageId}`);
    if (flameEl) {
      gsap.to(flameEl, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  };

  const showToast = (msg, type) => {
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-6 right-6 z-[300] px-4 py-2.5 bg-arch-ink text-arch-bg text-xs font-mono tracking-wider uppercase border border-arch-line shadow-xl rounded-none transform translate-y-4 opacity-0 transition-all duration-300';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
      }, 300);
    }, 2800);
  };

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        id={`diya-btn-${messageId}`}
        onClick={handleLike}
        disabled={isAnimating}
        aria-label={isLiked ? 'Extinguish diya' : 'Light diya'}
        title={isLiked ? 'You lit a diya' : 'Light a diya'}
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-all duration-300 border ${
          isLiked
            ? 'border-amber-600/70 bg-amber-500/10 text-amber-900 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            : 'border-arch-line bg-arch-bg hover:border-amber-500/50 hover:bg-amber-500/5 text-arch-muted hover:text-arch-ink'
        }`}
      >
        {/* Diya SVG Icon */}
        <div className="relative w-4 h-4 flex items-center justify-center">
          {/* Flame */}
          <div
            id={`flame-like-${messageId}`}
            className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-2.5 transition-opacity duration-200 pointer-events-none ${
              isLiked ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(ellipse at 50% 90%, #ffffff 0%, #fef08a 30%, #f59e0b 70%, #ea580c 100%)',
              borderRadius: '50% 50% 30% 30% / 60% 60% 40% 40%',
              filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.9))',
            }}
          />

          {/* Sparks */}
          <div className={`spark-${messageId} absolute -top-2 left-1 w-1 h-1 bg-amber-400 rounded-full opacity-0 pointer-events-none`} />
          <div className={`spark-${messageId} absolute -top-2.5 left-2 w-1 h-1 bg-yellow-300 rounded-full opacity-0 pointer-events-none`} />
          <div className={`spark-${messageId} absolute -top-2 left-3 w-1 h-1 bg-orange-400 rounded-full opacity-0 pointer-events-none`} />

          {/* Diya Clay Base */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 13C3 17.5 7 21 12 21C17 21 21 17.5 21 13C21 12 19 12 12 12C5 12 3 12 3 13Z"
              fill={isLiked ? '#b45309' : 'currentColor'}
              opacity={isLiked ? 1 : 0.6}
            />
            <path
              d="M4 13C6 13 9 13.5 12 13.5C15 13.5 18 13 20 13"
              stroke={isLiked ? '#fbbf24' : '#e0ded8'}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Count */}
        <span className={`text-[11px] font-semibold tabular-nums ${isLiked ? 'text-amber-800' : 'text-arch-muted'}`}>
          {likeCount}
        </span>
      </button>
    </div>
  );
};

export default DiyaLike;
