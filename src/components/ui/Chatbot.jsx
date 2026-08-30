import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, RotateCcw, Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ARCH_EASE_CSS } from '../../hooks/useArchAnim';
// Side-effect import: this file's own markup no longer uses any of these
// classes, but src/pages/Home.jsx's pillar cards (.flip-card-inner,
// .mac-dots, .neon-border, .card-hover …) do, and Chatbot is the only
// place this stylesheet is imported anywhere in the app. Chatbot renders
// on every route, so this is what keeps that CSS in the bundle at all —
// removing it would silently break the pillars flip animation.
import '../../styles/chatbot.css';

// Built-in intelligent CSS Knowledge Base for immediate local fallback
const KNOWLEDGE_BASE = [
  {
    patterns: ['hi', 'hello', 'hey', 'start', 'greetings', 'who are you', 'help'],
    response: "Welcome to **CSS Bot** — the assistant for the **Computer Science Society**, NIT Silchar. How can I help? Explore events, wings, study materials, certificates, and more.",
    suggestions: ['Upcoming Events', 'Explore Wings', 'Study Materials', 'Get Certificates']
  },
  {
    patterns: ['event', 'events', 'hackathon', 'abacus', 'esperanza', 'competition', 'contest'],
    response: "**CSS Events & Competitions**\nWe organise premier hackathons, coding contests, and symposiums including:\n• **ABACUS** — Flagship Annual Tech Fest\n• **Esperanza** — Freshers Welcome & Hackathons\n• **CP Bootcamps & Workshops**\n\nCheck out the active registrations on our Events portal.",
    link: { text: "View All Events", url: "/events" },
    suggestions: ['Tell me about Abacus', 'Wings of CSS', 'Study Materials']
  },
  {
    patterns: ['abacus', 'fest', 'annual fest', 'flagship'],
    response: "**ABACUS 2025–26** is the flagship annual technical symposium of the Computer Science Society at NIT Silchar, featuring competitive programming, machine learning challenges, UI/UX hackathons, and tech talks from industry pioneers.",
    link: { text: "Explore Abacus", url: "/Abacus" },
    suggestions: ['View Events', 'Who is President?', 'Join as Sponsor']
  },
  {
    patterns: ['wing', 'wings', 'dev', 'development', 'cp', 'competitive programming', 'ml', 'machine learning', 'pr', 'design', 'literature'],
    response: "**The 7 Wings of CSS**\n1. **Executive Wing** — Governance & Leadership\n2. **Development Wing** — Web, Mobile & Full-Stack Apps\n3. **CP Wing** — Algorithms, Data Structures & Contests\n4. **ML Wing** — AI, Data Science & Neural Networks\n5. **Design Wing** — UI/UX, 3D Assets & Graphics\n6. **PR Wing** — Sponsorships, Media & Outreach\n7. **Literature Wing** — Editorials & Tech Documentation",
    link: { text: "Discover Wings", url: "/wings" },
    suggestions: ['Meet the Team', 'Study Materials', 'Events']
  },
  {
    patterns: ['material', 'materials', 'notes', 'pyq', 'study', 'resource', 'resources', 'prep', 'syllabus'],
    response: "**Study Materials & Prep Hub**\nAccess departmental lecture notes, previous year question papers (PYQs), roadmaps, and coding interview cheat sheets, all in one repository.",
    link: { text: "Open Materials Portal", url: "/materials" },
    suggestions: ['Upcoming Events', 'CP Wing', 'Certificates']
  },
  {
    patterns: ['certificate', 'certificates', 'download certificate', 'generate certificate', 'verify'],
    response: "**Certificate Portal**\nVerify participation and download official digital certificates for CSS events by entering your participant ID or roll number.",
    link: { text: "Download Certificates", url: "/certificates" },
    suggestions: ['View Events', 'About CSS', 'Contact Info']
  },
  {
    patterns: ['team', 'president', 'faculty', 'advisor', 'head', 'lead', 'member', 'members', 'general secretary', 'shashank', 'umakanta'],
    response: "**CSS Leadership & Pillars**\n• **Faculty Advisor**: Dr. Umakanta Majhi\n• **President**: Shashank Kukreti\n• **General Secretary**: Soumya Ranjan Dash\n• **Technical Head**: Nilabh Sarmah\n• **Finance & Ops Co-ordinator**: Kartika Jauhari\n\nVisit our Members directory to see the entire team.",
    link: { text: "View Member Directory", url: "/members" },
    suggestions: ['Explore Wings', 'Events', 'Contact Us']
  },
  {
    patterns: ['app', 'apk', 'mobile', 'download app'],
    response: "**CSS Android Mobile App**\nStay updated with event schedules, push notifications, and announcements by downloading our official mobile APK.",
    link: { text: "Download Mobile App", url: "/app-download" },
    suggestions: ['About CSS', 'View Events']
  },
  {
    patterns: ['contact', 'email', 'social', 'instagram', 'linkedin', 'github', 'reach', 'join'],
    response: "**Connect with CSS NIT Silchar**\n• **Email**: computersciencesociety@cse.nits.ac.in\n• **Location**: Dept. of CSE, NIT Silchar, Assam\n• **Socials**: Instagram (@css_nits), LinkedIn, GitHub\n• **Portal**: Sign in to access student forums and chat.",
    link: { text: "Sign In / Dashboard", url: "/dashboard" },
    suggestions: ['Upcoming Events', 'Study Materials']
  }
];

const QUICK_SUGGESTIONS = [
  'Upcoming Events',
  'Wings of CSS',
  'Study Materials',
  'Certificates',
  'Leadership Team',
  'Download App'
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      text: "Hello — I'm **CSS Bot**, the assistant for the Computer Science Society, NIT Silchar.\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Upcoming Events', 'Wings of CSS', 'Study Materials', 'Certificates']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dfRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  useEffect(() => {
    const handleResponse = (event) => {
      event.preventDefault();
      setIsTyping(false);

      let responseText = '';
      let suggestions = [];

      // Extract response from event.detail
      if (event.detail && event.detail.response) {
        const queryResult = event.detail.response.queryResult;
        if (queryResult) {
          responseText = queryResult.fulfillmentText;

          // Parse suggestions if present in quick replies
          if (queryResult.fulfillmentMessages) {
            for (const msg of queryResult.fulfillmentMessages) {
              if (msg.quickReplies) {
                suggestions = msg.quickReplies.quickReplies || [];
              }
            }
          }
        }
      }

      setMessages(prev => {
        // If the only message is the initial greeting, replace it with the live greeting
        if (prev.length === 1 && prev[0].id === 'welcome-msg') {
          return [
            {
              id: `welcome-${Date.now()}`,
              text: responseText || prev[0].text,
              sender: 'bot',
              suggestions: suggestions.length > 0 ? suggestions : prev[0].suggestions,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }

        return [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: responseText || 'I did not understand that. Can you rephrase?',
            sender: 'bot',
            suggestions: suggestions.length > 0 ? suggestions : undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      });
    };

    // Attach listener directly to the df-messenger element
    const dfMessenger = dfRef.current;
    dfMessenger?.addEventListener('df-response-received', handleResponse);
    return () => {
      dfMessenger?.removeEventListener('df-response-received', handleResponse);
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const findFallbackResponse = (query) => {
    const cleanQuery = query.toLowerCase().trim();
    for (const item of KNOWLEDGE_BASE) {
      if (item.patterns.some(pattern => cleanQuery.includes(pattern))) {
        return item;
      }
    }
    return {
      response: `I received your query about: *"${query}"*.\n\nYou can explore our official portals for real-time information, or reach out directly to the CSS team at **computersciencesociety@cse.nits.ac.in**.`,
      suggestions: ['Upcoming Events', 'Explore Wings', 'Study Materials', 'Leadership Team']
    };
  };

  const handleSend = (customText) => {
    const textToSend = typeof customText === 'string' ? customText : inputValue;
    if (!textToSend || textToSend.trim() === '' || isTyping) return;

    const trimmed = textToSend.trim();
    const userMsg = {
      id: `user-${Date.now()}`,
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call Dialogflow Messenger programmatically
    const dfMessenger = dfRef.current;
    if (dfMessenger && typeof dfMessenger.sendQuery === 'function') {
      dfMessenger.sendQuery(trimmed);
    } else {
      // Local fallback in case the external script hasn't loaded
      setTimeout(() => {
        setIsTyping(false);
        const fallback = findFallbackResponse(trimmed);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: fallback.response,
            link: fallback.link,
            suggestions: fallback.suggestions || ['Upcoming Events', 'Wings of CSS', 'Study Materials'],
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        text: "Session reset. I'm **CSS Bot** — how can I help?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Upcoming Events', 'Wings of CSS', 'Study Materials', 'Certificates']
      }
    ]);
    setInputValue('');
    setIsTyping(false);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-[13px] leading-relaxed tracking-[-0.01em]">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Format bold markers **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={idx} className={line.startsWith('•') || /^\d\./.test(line) ? 'pl-2' : ''}>
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={pIdx} className="font-semibold text-arch-ink">{part.slice(2, -2)}</strong>;
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ── Hidden Dialogflow Messenger Element ──────────────────────── */}
      <df-messenger
        ref={dfRef}
        intent="WELCOME"
        chat-title="CSS Bot"
        agent-id="b6e84f81-9c3d-42b4-9d60-0f0fc35cf06a"
        language-code="en"
      ></df-messenger>

      {/* ── Floating Launcher ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[190] select-none">
        <motion.button
          onClick={toggleChat}
          whileTap={{ scale: 0.96 }}
          className="group relative flex h-14 w-14 items-center justify-center border border-arch-ink bg-arch-ink text-arch-bg transition-colors duration-500 hover:bg-arch-bg hover:text-arch-ink"
          aria-label={isOpen ? 'Close CSS Bot' : 'Open CSS Bot'}
        >
          {isOpen ? (
            <X className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <>
              <Bot className="h-5 w-5" strokeWidth={1.5} />
              {hasUnread && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 border border-arch-bg bg-arch-ink transition-colors duration-500 group-hover:bg-arch-bg group-hover:border-arch-ink" />
              )}
            </>
          )}
        </motion.button>
      </div>

      {/* ── Chat Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, y: 12, clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 0.5, ease: ARCH_EASE_CSS }}
            className="fixed bottom-24 right-4 z-[190] flex h-[580px] max-h-[78vh] w-[calc(100vw-2rem)] flex-col overflow-hidden border border-arch-line bg-arch-card sm:right-6 sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-arch-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-arch-line text-arch-ink">
                  <Bot className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="arch-label">CSS Bot</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] tracking-[-0.01em] text-arch-ink-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-arch-ink" />
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="flex h-8 w-8 items-center justify-center text-arch-ink-3 transition-colors duration-300 hover:text-arch-ink"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={toggleChat}
                  title="Close chat"
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center text-arch-ink-3 transition-colors duration-300 hover:text-arch-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] border px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'border-arch-ink bg-arch-ink text-arch-bg'
                        : 'border-arch-line bg-arch-bg text-arch-ink'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Optional Interactive Link Action */}
                    {msg.link && (
                      <button
                        onClick={() => {
                          navigate(msg.link.url);
                          setIsOpen(false);
                        }}
                        className="arch-link mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.06em] text-arch-ink"
                      >
                        <span>{msg.link.text}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>

                  <span className="mt-1.5 px-1 text-[10px] tracking-[0.04em] text-arch-faint">
                    {msg.timestamp}
                  </span>

                  {/* Context Suggestions for Bot */}
                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex max-w-[95%] flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="border border-arch-line px-2.5 py-1 text-[11px] tracking-[-0.01em] text-arch-ink-2 transition-colors duration-300 hover:border-arch-ink hover:bg-arch-ink hover:text-arch-bg"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex w-max items-center gap-2 border border-arch-line bg-arch-bg px-4 py-3">
                  <span className="text-[11px] tracking-[-0.01em] text-arch-ink-3">Typing</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-arch-ink" style={{ animationDelay: '0ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-arch-ink" style={{ animationDelay: '150ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-arch-ink" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Drawer if chat has few messages */}
            {messages.length <= 2 && !isTyping && (
              <div className="shrink-0 border-t border-arch-line px-5 py-3">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] tracking-[0.08em] text-arch-faint">
                  <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                  <span>POPULAR</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {QUICK_SUGGESTIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="whitespace-nowrap border border-arch-line px-2.5 py-1 text-[11px] tracking-[-0.01em] text-arch-ink-2 transition-colors duration-300 hover:border-arch-ink hover:bg-arch-ink hover:text-arch-bg"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <div className="shrink-0 border-t border-arch-line p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 border border-arch-line px-3 py-2 transition-colors duration-300 focus-within:border-arch-ink"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about CSS…"
                  className="flex-1 bg-transparent text-[13px] tracking-[-0.01em] text-arch-ink outline-none placeholder:text-arch-faint"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`flex h-7 w-7 items-center justify-center border transition-colors duration-300 ${
                    inputValue.trim() && !isTyping
                      ? 'border-arch-ink bg-arch-ink text-arch-bg hover:bg-arch-bg hover:text-arch-ink'
                      : 'border-arch-line text-arch-faint'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
