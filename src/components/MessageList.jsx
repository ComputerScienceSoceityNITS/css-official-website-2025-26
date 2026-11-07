import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import DiyaLike from './DiyaLike';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('diwali_messages_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.approved) {
            fetchMessages();
          } else if (payload.eventType === 'UPDATE') {
            fetchMessages();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'message_likes' },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('approved', true);

      if (messagesError) throw messagesError;

      // Check if message_likes has records or fallback to messages.like_count
      const messagesWithLikes = await Promise.all(
        (messagesData || []).map(async (msg) => {
          let count = null;
          try {
            const { count: c, error: countErr } = await supabase
              .from('message_likes')
              .select('*', { count: 'exact', head: true })
              .eq('message_id', msg.id);

            if (!countErr && c !== null && c > 0) {
              count = c;
            }
          } catch {
            // ignore
          }

          return {
            ...msg,
            like_count: count !== null ? count : (msg.like_count || 0),
          };
        })
      );

      const sorted = messagesWithLikes.sort((a, b) => {
        if (b.like_count !== a.like_count) {
          return b.like_count - a.like_count;
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setMessages(sorted);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-5 h-5 border-2 border-arch-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-arch-bg border border-arch-line">
        <p className="arch-body text-xs text-arch-muted">
          No wishes yet. Be the first to share a greeting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {messages.map((item) => {
        // Strip legacy [tag] if present
        const cleanContent = item.message.replace(/^\[(.*?)\]\s*/, '');

        return (
          <div
            key={item.id}
            className="bg-arch-card border border-arch-line p-3 transition-colors hover:border-arch-ink/40"
          >
            <p className="arch-body text-xs text-arch-ink leading-relaxed whitespace-pre-wrap">
              {cleanContent}
            </p>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-arch-line/60">
              <span className="text-[11px] font-mono font-medium text-arch-muted">
                {item.name || 'Anonymous'} · {formatDate(item.timestamp)}
              </span>

              <div className="diya-like-button shrink-0">
                <DiyaLike messageId={item.id} initialLikeCount={item.like_count} />
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
