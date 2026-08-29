import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '/src/supabaseClient.js';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ChatSystem = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('Anonymous');
    const [room, setRoom] = useState('general');
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showRoomDropdown, setShowRoomDropdown] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const subscriptionRef = useRef(null);
    const adminSubscriptionRef = useRef(null);
    const { user, profile, requiresCollegeVerification } = useAuth();
    const navigate = useNavigate();

    // Track if user has manually scrolled up
    const userHasScrolledRef = useRef(false);
    const previousMessagesLengthRef = useRef(0);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    // Available chat rooms
    useEffect(() => {
        if(user && requiresCollegeVerification){
            navigate('/college-verification');
            return;
        }
    },[user, requiresCollegeVerification, navigate]);
    
    const rooms = [
        { id: 'general', name: 'General Chat', icon: '💬' },
        { id: 'events', name: 'Events Discussion', icon: '🎪' },
        { id: 'tech', name: 'Tech Talk', icon: '💻' },
        { id: 'help', name: 'Help & Support', icon: '🤝' },
        { id: 'random', name: 'Random', icon: '🎲' }
    ];

    // Check if user is near the bottom of the chat
    const isNearBottom = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return true;
        
        const threshold = 100;
        const position = container.scrollTop + container.clientHeight;
        const height = container.scrollHeight;
        
        return height - position <= threshold;
    }, []);

    // Scroll to bottom function
    const scrollToBottom = useCallback((behavior = "smooth") => {
        if (isScrollingRef.current) return;
        
        const container = messagesContainerRef.current;
        if (!container) return;

        isScrollingRef.current = true;
        
        container.scrollTo({
            top: container.scrollHeight,
            behavior: behavior
        });

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            if (behavior === 'smooth') {
                userHasScrolledRef.current = false;
            }
        }, 150);
    }, []);

    const handleScroll = useCallback(() => {
        if (isScrollingRef.current) return;
        
        if (!isNearBottom()) {
            userHasScrolledRef.current = true;
        } else {
            userHasScrolledRef.current = false;
        }
    }, [isNearBottom]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => {
                container.removeEventListener('scroll', handleScroll);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, [handleScroll]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const isFirstLoad = previousMessagesLengthRef.current === 0;
        const newMessageAdded = messages.length > previousMessagesLengthRef.current;
        const isUserAtBottom = !userHasScrolledRef.current;

        if (isFirstLoad) {
            setTimeout(() => scrollToBottom('auto'), 100);
        } else if (newMessageAdded && isUserAtBottom) {
            setTimeout(() => scrollToBottom('smooth'), 100);
        }

        previousMessagesLengthRef.current = messages.length;
    }, [messages, scrollToBottom]);

    useEffect(() => {
        userHasScrolledRef.current = false;
        previousMessagesLengthRef.current = 0;
        isScrollingRef.current = false;
        
        if (messagesContainerRef.current) {
            setTimeout(() => {
                if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = 0;
                }
            }, 50);
        }
        
        loadMessages();
        setupRealtimeSubscription();
    }, [room]);

    useEffect(() => {
        const handleFocus = () => {
            userHasScrolledRef.current = true;
        };

        const handleBlur = () => {
            setTimeout(() => {
                if (isNearBottom()) {
                    userHasScrolledRef.current = false;
                }
            }, 200);
        };

        const messageInput = document.querySelector('input[type="text"]');
        if (messageInput) {
            messageInput.addEventListener('focus', handleFocus);
            messageInput.addEventListener('blur', handleBlur);
            
            return () => {
                messageInput.removeEventListener('focus', handleFocus);
                messageInput.removeEventListener('blur', handleBlur);
            };
        }
    }, [isNearBottom]);

    useEffect(() => {
  if(user && profile){
    // Always use email username if available
    if(profile.verified_college_email){
      setUsername(profile.verified_college_email.split('@')[0]);
    } else if(profile.email){
      setUsername(profile.email.split('@')[0]);
    } else {
      setUsername(profile.full_name || 'User');
    }
  } else {
    const adjectives = ['Swift', 'Clever', 'Mysterious', 'Digital', 'Cyber', 'Quantum', 'Neon', 'Cosmic'];
    const nouns = ['Phoenix', 'Wolf', 'Dragon', 'Tiger', 'Eagle', 'Fox', 'Hawk', 'Panther'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
    setUsername(randomName);
  }
  checkAdminStatus();
  loadMessages();
  setupRealtimeSubscription();
  
  return () => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }
    if (adminSubscriptionRef.current) {
      supabase.removeChannel(adminSubscriptionRef.current);
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };
}, [user, profile]);

    const checkAdminStatus = async () => {
        if (!user) {
            setIsAdmin(false);
            return;
        }
        
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                setIsAdmin(false);
                return;
            }

            const adminStatus = 
                profile?.role === 'admin' || 
                profile?.is_admin === true ||
                profile?.admin === true ||
                (profile?.email && profile.email.includes('admin')) ||
                (user?.email && user.email.includes('admin'));

            setIsAdmin(adminStatus);

            if (adminStatus) {
                setupAdminRealtimeSubscription();
            }

        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

    const loadMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id,
                    message,
                    room,
                    created_at,
                  
                    profiles (
                        user_id,
                        full_name,
                        email,
                        avatar_url,
                        is_admin,
                        college_email_verified
                    )
                    `)

                .eq('room', room)
                .order('created_at', { ascending: true })
                .limit(100);

            if (error) {
                console.error('Error loading messages:', error);
                return;
            }

            setMessages((data || []).map(normalizeMessage));

        } catch (error) {
            console.error('Error in loadMessages:', error);
        } finally {
            setLoading(false);
        }
    };
    const normalizeMessage = (msg) => {
  // Get username from joined profiles table
  const profile = msg.profiles || {};
  
  // Get the email to extract username from
  const email = profile.verified_college_email || profile.email || '';
  
  // Always use the email username (part before @) if email exists
  // Otherwise use full_name as fallback
  const username = email 
    ? email.split('@')[0]  // Always take the part before @
    : profile.full_name || 'User';
  
  // Check if this message belongs to current user
  const isOwnMessage = msg.user_id === user?.id;

  return {
    ...msg,
    username,
    isOwnMessage,
    // Keep the original email for display if needed
    email: email || null
  };
};

    const setupRealtimeSubscription = async () => {
  try {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    const subscription = supabase
      .channel(`public:chat_messages:room=eq.${room}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room=eq.${room}`
        },
        async (payload) => {
          // Fetch the full message with profile data
          const { data: fullMessage, error } = await supabase
            .from('chat_messages')
            .select(`
              id,
              message,
              room,
              created_at,
              user_id,
              profiles (
                user_id,
                full_name,
                email,
                verified_college_email
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && fullMessage) {
            const normalizedMsg = normalizeMessage(fullMessage);
            setMessages(prev => {
              const exists = prev.some(m => m.id === normalizedMsg.id);
              return exists ? prev : [...prev, normalizedMsg];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room=eq.${room}`
        },
        (payload) => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'CHANNEL_ERROR') {
          setTimeout(() => setupRealtimeSubscription(), 2000);
        }
      });

    subscriptionRef.current = subscription;

  } catch (error) {
    console.error('Error setting up real-time subscription:', error);
    setTimeout(() => setupRealtimeSubscription(), 3000);
  }
};

    const setupAdminRealtimeSubscription = async () => {
        if (!isAdmin) return;

        try {
            if (adminSubscriptionRef.current) {
                supabase.removeChannel(adminSubscriptionRef.current);
            }

            const adminSubscription = supabase
                .channel('admin-chat-monitor')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'chat_messages'
                    },
                    (payload) => {
                        if (payload.eventType === 'DELETE') {
                            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
                        } else if (payload.eventType === 'INSERT' && payload.new.room === room) {
                            setMessages(prev => {
                                const exists = prev.some(msg => msg.id === payload.new.id);
                                if (!exists) {
                                    return [...prev, payload.new];
                                }
                                return prev;
                            });
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('Admin subscription status:', status);
                });

            adminSubscriptionRef.current = adminSubscription;

        } catch (error) {
            console.error('Error setting up admin subscription:', error);
        }
    };

    const sendMessage = async (e) => {
  e.preventDefault();
  
  if (!newMessage.trim()) return;

  setLoading(true);
  const messageText = newMessage.trim();

  try {
    const tempMessage = {
      id: `temp_${Date.now()}`,
      message: messageText,
      room,
      created_at: new Date().toISOString(),
      username, // Use the local username as placeholder
      isOwnMessage: true,
      isSending: true,
      user_id: user?.id // Add user_id for temp message
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    userHasScrolledRef.current = false;
    setTimeout(() => scrollToBottom('smooth'), 100);

    // Insert message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          message: messageText,
          room: room,
        }
      ])
      .select()
      .single();

    if (error) {
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Failed to send message: ' + error.message);
      return;
    }

    // Fetch the full message with profile data
    if (data) {
      const { data: fullMessage, error: fetchError } = await supabase
        .from('chat_messages')
        .select(`
          id,
          message,
          room,
          created_at,
          user_id,
          profiles (
            user_id,
            full_name,
            email,
            verified_college_email
          )
        `)
        .eq('id', data.id)
        .single();

      if (!fetchError && fullMessage) {
        const normalizedMsg = normalizeMessage(fullMessage);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? { ...normalizedMsg, isSending: false } : msg
          )
        );
      } else {
        // Fallback: use temp message without profile data
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? { 
              ...data, 
              username,
              isOwnMessage: true,
              isSending: false 
            } : msg
          )
        );
      }
    }

  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message. Please try again.');
  } finally {
    setLoading(false);
  }
};

    const deleteMessage = async (messageId) => {
        if (!isAdmin) {
            alert('Only admins can delete messages.');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;

        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message.');
            loadMessages();
        }
    };

    const clearChat = async () => {
        if (!isAdmin) {
            alert('Only admins can clear the chat.');
            return;
        }

        if (window.confirm('Are you sure you want to clear all messages in this room? This action cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('chat_messages')
                    .delete()
                    .eq('room', room);

                if (error) throw error;
                
                setMessages([]);
            } catch (error) {
                console.error('Error clearing chat:', error);
                alert('Failed to clear chat.');
            }
        }
    };

    const clearAllChats = async () => {
        if (!isAdmin) {
            alert('Only admins can clear all chats.');
            return;
        }

        if (window.confirm('Are you sure you want to clear ALL messages in ALL rooms? This action cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('chat_messages')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000');

                if (error) throw error;
                
                setMessages([]);
            } catch (error) {
                console.error('Error clearing all chats:', error);
                alert('Failed to clear all chats.');
            }
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDepartmentName = (email) => {
        if (!email) return '';
        const domain = email.toLowerCase().split('@')[1];
        const departmentMap = {
            'nits.ac.in': 'NIT Silchar',
            'cse.nits.ac.in': 'CSE',
            'ece.nits.ac.in': 'ECE',
            'eee.nits.ac.in': 'EEE',
            'me.nits.ac.in': 'ME',
            'ce.nits.ac.in': 'CE',
            'maths.nits.ac.in': 'Maths',
            'physics.nits.ac.in': 'Physics',
            'chemistry.nits.ac.in': 'Chemistry',
            'hss.nits.ac.in': 'HSS',
            'mba.nits.ac.in': 'MBA'
        };
        return departmentMap[domain] || domain;
    };

    const currentRoom = rooms.find(r => r.id === room);
    
    if (user && requiresCollegeVerification) {
        return (
            <div className="min-h-screen bg-arch-bg flex items-center justify-center">
                <div className="text-arch-ink text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto mb-4"></div>
                    <p>Redirecting to verification...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-arch-bg text-arch-ink">
            {/* Mobile Header  */}
            <div className="sticky top-0 z-10 bg-arch-card border-b border-arch-line md:hidden">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full   ${isConnected ? 'bg-arch-ink' : 'bg-arch-ink'}`}></div>
                            <h1 className="text-lg font-bold text-arch-ink">CSS Chat</h1>
                            {isAdmin && (
                                <span className="text-xs bg-arch-ink text-arch-bg px-2 py-1 border border-arch-ink">
                                    Admin
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="p-2 bg-arch-ink border border-arch-ink"
                            >
                                ℹ️
                            </button>
                        </div>
                    </div>
                    
                    {/* Room Dropdown for Mobile */}
                    <div className="mt-3 relative">
                        <select
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className="w-full p-3 bg-arch-bg-alt border border-arch-line text-arch-ink appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                backgroundSize: '16px',
                                paddingRight: '40px'
                            }}
                        >
                            {rooms.map(roomItem => (
                                <option 
                                    key={roomItem.id} 
                                    value={roomItem.id}
                                    className="bg-arch-bg-alt text-arch-ink"
                                >
                                    {roomItem.icon} {roomItem.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-0 md:pt-8 px-4 pb-4 max-w-6xl mx-auto">
                {/* Desktop Header */}
                <div className="hidden md:flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2" >
                            CSS Community Chat
                        </h1>
                        <p className="text-arch-ink text-lg">
                            Anonymous real-time chat - No registration required!
                        </p>
                    </div>
                    
                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex flex-col gap-2 bg-arch-bg-alt border border-arch-line p-4">
                            <h3 className="text-arch-ink font-bold text-sm mb-2">🛡️ Admin Controls</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={clearChat}
                                    className="px-3 py-2 bg-arch-ink border border-arch-ink text-arch-bg hover:bg-arch-ink transition-all text-sm hover:text-arch-bg"
                                >
                                    Clear Room
                                </button>
                                <button
                                    onClick={clearAllChats}
                                    className="px-3 py-2 bg-arch-ink border border-arch-ink text-arch-bg hover:bg-arch-ink transition-all text-sm hover:text-arch-bg"
                                    title="Clear ALL chat rooms"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center items-center gap-4 text-sm">
                        <div className={`flex items-center gap-2   ${isConnected ? 'text-arch-ink' : 'text-arch-ink'}`}>
                            <div className={`w-3 h-3 rounded-full   ${isConnected ? 'bg-arch-ink' : 'bg-arch-ink'}`}></div>
                            {isConnected ? 'Real-time Connected' : 'Real-time Disconnected'}
                        </div>
                        <div className="text-arch-ink">
                            💬 {messages.length} messages
                        </div>
                        {isAdmin && (
                            <div className="text-arch-ink flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-arch-ink"></div>
                                Admin Mode
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CHAT CONTAINER */}
                <div className="bg-arch-card border border-arch-line overflow-hidden">
                    {/* Desktop Room Selection */}
                    <div className="hidden md:block border-b border-arch-line p-4 bg-arch-card">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {rooms.map(roomItem => (
                                <button
                                    key={roomItem.id}
                                    onClick={() => setRoom(roomItem.id)}
                                    className={`px-4 py-2 border transition-all flex items-center gap-2   ${
                                        room === roomItem.id
                                            ? 'bg-arch-ink border-arch-ink text-arch-bg'
                                            : 'bg-arch-bg-alt border-arch-line text-arch-ink-3 hover:border-arch-line'
                                    }`}
                                >
                                    <span>{roomItem.icon}</span>
                                    {roomItem.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        {/* Chat Container */}
                        <div className="flex-1 flex flex-col">
                            {/* Messages Header */}
                            <div className="border-b border-arch-line p-3 md:p-4 bg-arch-card flex justify-between items-center">
                                <h3 className="text-sm md:text-lg font-bold text-arch-ink flex items-center gap-2">
                                    <span className="hidden md:inline">{currentRoom?.icon}</span>
                                    <span>{currentRoom?.name}</span>
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={loadMessages}
                                        className="px-2 py-1 md:px-3 md:py-1 bg-arch-ink border border-arch-ink text-arch-bg hover:bg-arch-ink transition-all text-xs md:text-sm hover:text-arch-bg"
                                    >
                                        🔄
                                    </button>
                                </div>
                            </div>

                            {/* Messages Container*/}
                            <div 
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-arch-card"
                                style={{ 
                                    height: '60vh', 
                                    maxHeight: '60vh',
                                    WebkitOverflowScrolling: 'touch',
                                    overflowAnchor: 'none'
                                }}
                            >
                                {messages.length === 0 ? (
                                    <div className="text-center text-arch-ink-3 py-8 h-full flex items-center justify-center">
                                        <div>
                                            <div className="text-4xl mb-2">💬</div>
                                            <p className="text-sm md:text-base">No messages yet. Start the conversation!</p>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                       <div
  key={msg.id}
  className={`group p-3 border transition-all relative   ${
    msg.isOwnMessage
      ? 'bg-arch-ink border-arch-ink md:ml-8'
      : 'bg-arch-bg-alt border-arch-line md:mr-8'
  }      ${msg.isSending ? 'opacity-70' : ''}`}
>
  {/* Admin Delete Button */}
  {isAdmin && !msg.isSending && !msg.isOwnMessage && (
    <button
      onClick={() => deleteMessage(msg.id)}
      className="absolute -top-2 -right-2 bg-arch-ink hover:bg-arch-ink text-arch-bg rounded-full w-6 h-6 flex items-center justify-center text-xs border border-arch-ink transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-arch-bg"
      title="Delete message (Admin)"
    >
      ×
    </button>
  )}
  
  <div className="flex justify-between items-start mb-1">
    <div className="flex items-center gap-2">
      <span className={`font-bold text-sm md:text-base   ${
        msg.isOwnMessage
          ? 'text-arch-ink' 
          : msg.username === 'System'
          ? 'text-arch-ink'
          : 'text-arch-ink'
      }`}>
        {/* {msg.username} */}
        Anonymous
      </span>
      {msg.isOwnMessage && (
        <span className="text-xs bg-arch-ink text-arch-bg px-2 py-1">
          {msg.isSending ? 'Sending...' : 'You'}
        </span>
      )}
      {msg.room !== room && (
        <span className="text-xs bg-arch-ink text-arch-bg px-2 py-1 border border-arch-ink">
          {rooms.find(r => r.id === msg.room)?.icon} {msg.room}
        </span>
      )}
    </div>
    <span className="text-xs text-arch-ink-3">
      {formatTime(msg.created_at)}
    </span>
  </div>
  <p className="text-arch-ink-3 text-sm whitespace-pre-wrap break-words">
    {msg.message}
  </p>
</div>
                                    ))
                                )}
                                <div ref={messagesEndRef} style={{ height: '1px' }} />
                            </div>

                            {/* Message Input */}
                            <div className="border-t border-arch-line p-3 md:p-4 bg-arch-card">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-arch-ink placeholder-gray-400 text-sm md:text-base"
                                        maxLength={500}
                                        disabled={loading}
                                        onFocus={() => userHasScrolledRef.current = true}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || loading}
                                        className="px-4 py-2 md:px-6 md:py-3 bg-arch-ink border border-arch-ink text-arch-bg font-semibold hover:bg-arch-ink disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base hover:text-arch-bg"
                                    >
                                        {loading ? '⏳' : 'Send'}
                                    </button>
                                </form>
                                <div className="flex justify-between items-center mt-2 text-xs text-arch-ink-3">
                                    <div>
                                        You: <span className="text-arch-ink">{username}</span>
                                        {isAdmin && <span className="text-arch-ink ml-2">• Admin</span>}
                                    </div>
                                    <div>
                                        {newMessage.length}/500
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        {(showSidebar || window.innerWidth >= 768) && (
                            <div className={`fixed inset-0 z-40 md:relative md:z-auto bg-arch-card md:bg-arch-card   ${
                                showSidebar ? 'block' : 'hidden md:block'
                            }`}>
                                <div className="absolute top-0 right-0 bottom-0 w-80 max-w-full bg-arch-card border-l border-arch-line md:border-l-0 md:border-arch-line md:relative md:w-80">
                                    {/* Mobile Close Button */}
                                    <div className="md:hidden p-4 border-b border-arch-line flex justify-between items-center">
                                        <h4 className="font-bold text-arch-ink">Chat Info</h4>
                                        <button
                                            onClick={() => setShowSidebar(false)}
                                            className="p-2 bg-arch-ink border border-arch-ink text-arch-bg"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="p-4 h-full overflow-y-auto">
                                        <h4 className="hidden md:block font-bold text-arch-ink mb-4">Chat Info</h4>
                                        
                                        <div className="space-y-4">
                                            <div className="bg-arch-bg-alt p-3 border border-arch-line">
                                                <h5 className="font-semibold text-sm mb-2">📝 Chat Rules</h5>
                                                <ul className="text-xs text-arch-ink-3 space-y-1">
                                                    <li>• Be respectful to others</li>
                                                    <li>• No spam or advertising</li>
                                                    <li>• Keep conversations appropriate</li>
                                                    <li>• Have fun! 🎉</li>
                                                </ul>
                                            </div>

                                            <div className="bg-arch-bg-alt p-3 border border-arch-line">
                                                <h5 className="font-semibold text-sm mb-2">🌐 Rooms</h5>
                                                <div className="text-xs text-arch-ink-3">
                                                    {rooms.map(roomItem => (
                                                        <div 
                                                            key={roomItem.id}
                                                            className={`flex items-center gap-2 py-1   ${
                                                                room === roomItem.id ? 'text-arch-ink' : ''
                                                            }`}
                                                        >
                                                            {roomItem.icon} {roomItem.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-arch-bg-alt p-3 border border-arch-line">
                                                <h5 className="font-semibold text-sm mb-2">⚡ Real-time Status</h5>
                                                <ul className="text-xs text-arch-ink-3 space-y-1">
                                                    <li className={isConnected ? 'text-green-400' : 'text-red-400'}>
                                                        • {isConnected ? 'Connected to real-time' : 'Disconnected from real-time'}
                                                    </li>
                                                    <li>• Messages update instantly</li>
                                                    <li>• No page refresh needed</li>
                                                    <li>• Works across all devices</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showSidebar && (
                <div 
                    className="fixed inset-0 z-30 bg-arch-card md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
        </div>
    );
};

export default ChatSystem;