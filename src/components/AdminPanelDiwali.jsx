import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [pendingMessages, setPendingMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const { user, profile: authProfile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPendingMessages();
      fetchStats();
    }
  }, [user]);

  const fetchPendingMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('approved', false)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setPendingMessages(data || []);
    } catch (error) {
      console.error('Error fetching pending messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: totalData } = await supabase.from('messages').select('id', { count: 'exact' });
      const { data: approvedData } = await supabase.from('messages').select('id', { count: 'exact' }).eq('approved', true);
      const { data: pendingData } = await supabase.from('messages').select('id', { count: 'exact' }).eq('approved', false);

      setStats({
        total: totalData?.length || 0,
        approved: approvedData?.length || 0,
        pending: pendingData?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproval = async (messageId, approved) => {
    try {
      if (approved) {
        const { error } = await supabase
          .from('messages')
          .update({ approved: true })
          .eq('id', messageId);

        if (error) throw error;
        showToast('Message approved & published ✨', 'success');
      } else {
        const { error } = await supabase.from('messages').delete().eq('id', messageId);
        if (error) throw error;
        showToast('Message rejected and purged.', 'info');
      }

      setPendingMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      fetchStats();
    } catch (error) {
      console.error('Error processing message:', error);
      showToast('Action failed.', 'error');
    }
  };

  const handleBulkReject = async () => {
    if (
      !window.confirm(
        `Are you sure you want to reject all ${pendingMessages.length} pending messages?`
      )
    ) {
      return;
    }

    try {
      const ids = pendingMessages.map((m) => m.id);
      const { error } = await supabase.from('messages').delete().in('id', ids);
      if (error) throw error;

      showToast(`${ids.length} messages rejected.`, 'info');
      setPendingMessages([]);
      fetchStats();
    } catch (error) {
      console.error('Error bulk rejecting:', error);
      showToast('Failed to purge messages.', 'error');
    }
  };

  const showToast = (msg, type) => {
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-6 right-6 z-[300] px-4 py-2.5 bg-arch-ink text-arch-bg text-xs font-mono tracking-wider uppercase border border-arch-line shadow-2xl transition-all duration-300 transform translate-y-4 opacity-0';
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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-2 border-arch-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Moderation Metrics */}
      <div className="border border-arch-line bg-arch-bg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="arch-label text-[10px] text-arch-muted">
            // Moderation Overview
          </span>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-500/10 px-1.5 py-0.5 border border-amber-600/30">
            Admin Auth Active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="border border-arch-line bg-arch-card p-2 text-center">
            <div className="text-lg font-mono font-bold text-arch-ink tabular-nums">{stats.total}</div>
            <div className="text-[9px] arch-label text-arch-muted">Total</div>
          </div>
          <div className="border border-arch-line bg-arch-card p-2 text-center">
            <div className="text-lg font-mono font-bold text-emerald-700 tabular-nums">{stats.approved}</div>
            <div className="text-[9px] arch-label text-arch-muted">Approved</div>
          </div>
          <div className="border border-arch-line bg-arch-card p-2 text-center">
            <div className="text-lg font-mono font-bold text-amber-700 tabular-nums">{stats.pending}</div>
            <div className="text-[9px] arch-label text-arch-muted">Pending</div>
          </div>
        </div>
      </div>

      {/* Pending List Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="arch-label text-[10px] text-arch-muted">
            // Review Queue ({pendingMessages.length})
          </span>
          {pendingMessages.length > 0 && (
            <button
              onClick={handleBulkReject}
              className="text-[10px] font-mono text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors"
            >
              Purge All
            </button>
          )}
        </div>

        {pendingMessages.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-arch-line bg-arch-bg">
            <div className="text-2xl mb-1">✓</div>
            <p className="arch-title text-xs font-semibold text-arch-ink">Queue Clear</p>
            <p className="text-[11px] font-mono text-arch-muted mt-0.5">
              All submitted wishes have been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {pendingMessages.map((msg) => (
              <div
                key={msg.id}
                className="border border-arch-line bg-arch-card p-3 space-y-2"
              >
                <p className="text-xs font-sans text-arch-ink leading-relaxed">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-arch-muted pt-1 border-t border-arch-line/60">
                  <span>From: {msg.name || 'Anonymous'}</span>
                  <span>{formatDate(msg.timestamp)}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleApproval(msg.id, true)}
                    className="flex-1 py-1.5 text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleApproval(msg.id, false)}
                    className="flex-1 py-1.5 text-xs font-mono font-semibold bg-arch-bg hover:bg-rose-50 text-rose-700 border border-arch-line transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-arch-line flex justify-end">
        <button
          onClick={() => {
            fetchPendingMessages();
            fetchStats();
          }}
          className="text-[10px] font-mono text-arch-muted hover:text-arch-ink flex items-center gap-1"
        >
          <span>↻</span> <span>Refresh Queue</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
