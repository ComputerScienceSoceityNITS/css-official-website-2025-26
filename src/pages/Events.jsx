// pages/EventsList.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useArchReveal } from "../hooks/useArchAnim";
import ArchPageLoader from "../components/ArchPageLoader";
import { ArchChars } from "../components/ArchType";
import { Link, Navigate } from "react-router-dom";
import eventsContent from "../constants/events";
import { FaArrowRight, FaExternalLinkAlt, FaLock, FaCheck, FaHandPointer, FaInfoCircle, FaTrophy, FaGraduationCap, FaWhatsapp, FaMapMarkerAlt, FaCalendar, FaTimes } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/eventsAnimation.css";

function EventCard({
  slug,
  name,
  description,
  organizer,
  status,
  image,
  registrationLink,
  moreEvents,
  requiresAuth = false,
  onRegister,
  isRegistered = false,
  isCompleted = false,
  isDirectRegistration = true,
  isCSEOnly = false,
  section,
  venue,
  event_flow,
  whatsapp_group_link,
  onClick
}) {
  const [hovered, setHovered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (requiresAuth && !user) {
      toast.warning('Please log in to register for this event');
      return;
    }
    
    if (onRegister && user && !isRegistered) {
      setRegistering(true);
      await onRegister();
      setRegistering(false);
    }
  };

  // Accent helper
  const getEventVisualSettings = (sec, completed) => {
    if (completed) {
      return {
        borderClass: "border-arch-line opacity-75",
        accentBar: "bg-arch-faint",
        badgeText: "Completed",
        badgeClass: "bg-arch-bg-alt text-arch-muted border border-arch-line",
      };
    }
    switch (sec?.toLowerCase()) {
      case "yearly":
        return {
          borderClass: "border-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]",
          accentBar: "bg-amber-500",
          badgeText: "⭐ Flagship",
          badgeClass: "bg-amber-500/10 text-amber-700 border border-amber-500/30",
        };
      case "technical":
        return {
          borderClass: "border-cyan-500/20 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]",
          accentBar: "bg-cyan-500",
          badgeText: "💻 Technical",
          badgeClass: "bg-cyan-500/10 text-cyan-700 border border-cyan-500/30",
        };
      case "cultural":
        return {
          borderClass: "border-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.06)]",
          accentBar: "bg-purple-500",
          badgeText: "🎭 Cultural",
          badgeClass: "bg-purple-500/10 text-purple-700 border border-purple-500/30",
        };
      default:
        return {
          borderClass: "border-arch-line hover:border-arch-ink/30",
          accentBar: "bg-arch-ink",
          badgeText: sec || "Event",
          badgeClass: "bg-arch-bg-alt text-arch-ink border border-arch-line",
        };
    }
  };

  const settings = getEventVisualSettings(section, isCompleted);

  return (
    <div className="w-full min-w-0" data-arch="fade">
      <article
        className={`group relative flex h-full min-h-[440px] flex-col border bg-arch-card transition-all duration-500 cursor-pointer ${settings.borderClass}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Accent Top Bar */}
        <div className={`h-[3px] w-full ${settings.accentBar} transition-transform duration-500`} />

        {/* Poster */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-arch-line bg-arch-bg-alt">
          <img
            src={image || 'https://via.placeholder.com/400x300'}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/F4F3EF/1C1C1C?text=Event'
            }}
          />

          {/* Tags */}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5 z-10">
            <span className={`arch-label px-2.5 py-1 rounded-none font-bold text-[9px] shadow-sm ${settings.badgeClass}`}>
              {settings.badgeText}
            </span>
            {isCSEOnly && !isCompleted && (
              <span className="arch-label bg-arch-card text-arch-ink border border-arch-line px-2 py-1 text-[9px]">CSE only</span>
            )}
            {isRegistered && !isCompleted && (
              <span className="arch-label bg-arch-ink px-2 py-1 text-arch-bg text-[9px]">Registered</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between border-b border-arch-line pb-3">
            <span className="arch-label text-[10px]">{status}</span>
            <span className="arch-label text-[10px]">{organizer}</span>
          </div>

          <h3 className="arch-title mt-4 text-xl group-hover:text-arch-ink transition-colors duration-300">{name}</h3>
          
          {venue && (
            <p className="text-xs text-arch-muted font-medium mt-1.5 flex items-center gap-1">
              <FaMapMarkerAlt className="text-arch-faint shrink-0" size={10} />
              <span>{venue}</span>
            </p>
          )}

          <p className="arch-body mt-3 text-sm line-clamp-3 grow">{description}</p>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            {!isCompleted && registrationLink ? (
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="arch-btn w-full py-2.5 text-xs font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Register Now</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </a>
            ) : !isCompleted && onRegister && isDirectRegistration ? (
              <button
                onClick={handleRegisterClick}
                disabled={isRegistered || registering}
                className="arch-btn w-full py-2.5 text-xs font-semibold"
              >
                {registering ? (
                  <>
                    <span className="h-3 w-3 animate-spin border border-current border-t-transparent" />
                    <span>Registering…</span>
                  </>
                ) : isRegistered ? (
                  <>
                    <FaCheck className="text-[10px]" />
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Register Now</span>
                )}
              </button>
            ) : !isCompleted && !isDirectRegistration ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="arch-btn w-full py-2.5 text-xs font-semibold"
              >
                <span>View Sub-Events</span>
                <FaArrowRight className="text-[10px]" />
              </button>
            ) : null}

            {/* Join WhatsApp Group Button directly on Card if registered */}
            {isRegistered && !isCompleted && whatsapp_group_link && (
              <a
                href={whatsapp_group_link}
                target="_blank"
                rel="noopener noreferrer"
                className="arch-btn w-full py-2.5 text-xs font-semibold bg-green-600/10 hover:bg-green-600/20 text-green-700 border-green-600/30 hover:border-green-600 flex items-center justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp className="text-sm shrink-0" />
                <span>Join WhatsApp Group</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function EventDetailModal({
  event,
  onClose,
  isRegistered,
  isCompleted,
  registering,
  onRegister,
  user
}) {
  if (!event) return null;

  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'TBD';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-arch-card border border-arch-line text-arch-ink p-6 md:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-arch-muted hover:text-arch-ink transition-colors"
          >
            <FaTimes size={20} />
          </button>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-4">
            {/* Left side: Poster & Quick Info */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <figure className="relative overflow-hidden border border-arch-line aspect-[4/5] bg-arch-bg-alt w-full">
                <img
                  src={event.poster_url || event['poster-url'] || 'https://via.placeholder.com/400x500/F4F3EF/1C1C1C?text=Event'}
                  alt={event.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x500/F4F3EF/1C1C1C?text=Event';
                  }}
                />
              </figure>

              {/* Quick Info Grid */}
              <div className="space-y-3 bg-arch-bg-alt p-4 border border-arch-line text-sm">
                <div>
                  <span className="arch-label block text-[10px]">Organizer</span>
                  <span className="font-semibold text-arch-ink">{event.organizer || 'Computer Science Society'}</span>
                </div>
                <div>
                  <span className="arch-label block text-[10px]">Date & Time</span>
                  <span className="font-semibold text-arch-ink flex items-center gap-1.5 mt-0.5">
                    <FaCalendar size={12} className="text-arch-muted shrink-0" />
                    {dateStr}
                  </span>
                </div>
                <div>
                  <span className="arch-label block text-[10px]">Venue</span>
                  <span className="font-semibold text-arch-ink flex items-center gap-1.5 mt-0.5">
                    <FaMapMarkerAlt size={12} className="text-arch-muted shrink-0" />
                    {event.venue || 'TBD'}
                  </span>
                </div>
                {event.max_participants && (
                  <div>
                    <span className="arch-label block text-[10px]">Capacity</span>
                    <span className="font-semibold text-arch-ink">
                      {event.current_participants || 0} / {event.max_participants} registered
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Detailed Description & Event Flow */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Section Badge */}
                <span className="inline-block px-2.5 py-1 bg-arch-bg-alt text-arch-ink text-xs font-semibold uppercase tracking-wider mb-3">
                  {event.section || 'General'}
                </span>

                <h2 className="arch-title text-2xl md:text-3xl font-bold mb-4">{event.name}</h2>
                
                {/* Description */}
                <div className="mb-6">
                  <span className="arch-label block text-[10px] mb-2">About The Event</span>
                  <p className="arch-body text-sm leading-relaxed whitespace-pre-line text-arch-ink-soft">
                    {event.description}
                  </p>
                </div>

                {/* Event Flow */}
                {event.event_flow && (
                  <div className="mb-6 border-t border-arch-line pt-4">
                    <span className="arch-label block text-[10px] mb-3">Event Flow / Timeline</span>
                    <div className="bg-arch-bg-alt border border-arch-line p-4 rounded-none max-h-[220px] overflow-y-auto">
                      <p className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-line text-arch-ink-soft">
                        {event.event_flow}
                      </p>
                    </div>
                  </div>
                )}

                {/* CSE Only Warning */}
                {event.is_cse_only && !isCompleted && (
                  <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                    <FaGraduationCap className="text-amber-600 mt-0.5 shrink-0" size={16} />
                    <div className="text-xs text-amber-700">
                      <span className="font-bold">CSE Exclusive:</span> Only students with a validated <code className="bg-amber-500/20 px-1 rounded">@cse.nits.ac.in</code> email can register.
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="border-t border-arch-line pt-4 mt-6">
                {!isCompleted && event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arch-btn w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Register on External Platform</span>
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                ) : !isCompleted && onRegister && event.is_direct_registration ? (
                  <div className="space-y-3">
                    <button
                      onClick={onRegister}
                      disabled={isRegistered || registering}
                      className="arch-btn w-full"
                    >
                      {registering ? (
                        <>
                          <span className="h-3 w-3 animate-spin border border-current border-t-transparent" />
                          <span>Registering…</span>
                        </>
                      ) : isRegistered ? (
                        <>
                          <FaCheck className="text-[10px]" />
                          <span>Registered Successfully</span>
                        </>
                      ) : (
                        <span>Register Now</span>
                      )}
                    </button>

                    {/* WhatsApp button inside Modal */}
                    {isRegistered && event.whatsapp_group_link && (
                      <a
                        href={event.whatsapp_group_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="arch-btn w-full bg-green-600/10 hover:bg-green-600/20 text-green-700 border-green-600/30 hover:border-green-600 flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp className="text-base" />
                        <span>Join WhatsApp Group</span>
                      </a>
                    )}
                  </div>
                ) : !isCompleted && !event.is_direct_registration ? (
                  <Link to={`/events/${event.slug}`} className="arch-btn w-full">
                    <span>View Sub-Events</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                ) : isCompleted ? (
                  <div className="text-center py-2 bg-arch-bg-alt border border-arch-line text-sm text-arch-muted font-medium">
                    This event has been completed.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * The events masthead. The title rises character by character, and beside
 * it a vertical cycler steps through what the society actually runs — the
 * hero states the programme instead of describing it. The list is rendered
 * with the first entry repeated at the end so the loop can step back to the
 * top without a visible rewind.
 */
const PROGRAMME = [
  'DSA Marathons',
  'Dev Workshops',
  'ML Sessions',
  'Design Labs',
  'CSS Olympics',
  'ESPERANZA',
  'CSS ABACUS',
];

function ProgrammeCycler() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const steps = PROGRAMME.length; // the duplicate at the end makes this seamless
    const tl = gsap.timeline({ repeat: -1 });

    for (let i = 1; i <= steps; i++) {
      tl.to(track, {
        yPercent: (-100 / (steps + 1)) * i,
        duration: 0.72,
        ease: 'power3.inOut',
        delay: 1.5,
      });
    }
    tl.set(track, { yPercent: 0 });

    return () => tl.kill();
  }, []);

  return (
    <div className="arch-cycle">
      <div ref={trackRef} className="arch-cycle-track">
        {[...PROGRAMME, PROGRAMME[0]].map((w, i) => (
          <div key={`${w}-${i}`} className="arch-cycle-item">
            {w}
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ title, description }) {
  return (
    <header className="relative overflow-hidden pt-28 md:pt-36">
      <div className="grid grid-cols-1 items-end gap-12 pb-14 md:grid-cols-12 md:gap-8 md:pb-20">
        <div className="md:col-span-7">
          <p className="arch-label mb-8" data-arch="fade">
            Participate, enjoy &amp; learn
          </p>

          <div data-arch="scrub-x" data-arch-x="-3">
            <h1 data-arch="chars" className="arch-display text-[clamp(3rem,9vw,8rem)]">
              <ArchChars text={title} />
            </h1>
          </div>

          {/* what the programme actually contains */}
          <div
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1"
            data-arch="fade"
            data-arch-delay="0.25"
          >
            <span className="arch-label">This year</span>
            <div className="arch-title text-[clamp(1.35rem,3.4vw,2.5rem)] text-arch-ink">
              <ProgrammeCycler />
            </div>
          </div>

          <p
            className="arch-body mt-10 max-w-2xl"
            data-arch="fade"
            data-arch-delay="0.35"
          >
            {description}
          </p>
        </div>

        {/* A fanned stack of programme posters — the actual artwork the
            society publishes, rather than a decorative stock photo. */}
        <div className="md:col-span-5" data-arch="scrub-x" data-arch-x="3">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
            {[
              { src: '/images/demo3.jpeg', cls: 'left-0 top-6 w-[62%] -rotate-[5deg]', d: '0.1' },
              { src: '/images/demo5.jpeg', cls: 'right-0 top-0 w-[62%] rotate-[4deg]', d: '0.2' },
              { src: '/images/demo1.jpeg', cls: 'bottom-0 left-1/2 w-[66%] -translate-x-1/2', d: '0.3' },
            ].map((poster) => (
              <figure
                key={poster.src}
                data-arch="fade"
                data-arch-delay={poster.d}
                className={`absolute overflow-hidden border border-arch-line bg-arch-card   ${poster.cls}`}
              >
                <img
                  src={poster.src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div data-arch="fade" data-arch-delay="0.45" className="h-px w-full bg-arch-line" />
    </header>
  );
}

export default function EventsList() {
  const { body } = eventsContent;
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [databaseEvents, setDatabaseEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // New modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeringMap, setRegisteringMap] = useState({});

  const sections = ["Upcoming", "Completed", "Yearly", "Cultural", "Technical"];

  // ARCH scroll reveals (presentation only)
  const archScope = useRef(null);
  const [loaderDone, setLoaderDone] = useState(false);
  useArchReveal(archScope, [loading, loaderDone, databaseEvents.length, registeredEvents.length]);

  // Hold the page still behind the panel until it lifts.
  useEffect(() => {
    document.body.style.overflow = loaderDone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loaderDone]);

  useEffect(() => {
    fetchDatabaseEvents();
    if (user) {
      fetchRegisteredEvents();
    }
    const handleEventsUpdate = () => {
      fetchDatabaseEvents();
      if (user) {
        fetchRegisteredEvents();
      }
    };

    window.addEventListener('eventsUpdated', handleEventsUpdate);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdate);
    };
  }, [user, refreshTrigger]);

  useEffect(() => {
    const handleEventDeleted = (event) => {
      const { eventId, eventSlug } = event.detail;
      setDatabaseEvents(prevEvents => {
        const newEvents = prevEvents.filter(e => e.id !== eventId && e.slug !== eventSlug);
        return newEvents;
      });
      
      setRegisteredEvents(prev => prev.filter(slug => slug !== eventSlug));
      
      setTimeout(() => {
        fetchDatabaseEvents();
        if (user) {
          fetchRegisteredEvents();
        }
      }, 100);
    };

    window.addEventListener('eventDeleted', handleEventDeleted);

    return () => {
      window.removeEventListener('eventDeleted', handleEventDeleted);
    };
  }, [user]);

  const fetchDatabaseEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatabaseEvents(data || []);
      
      // Update selected event if open to sync participant count
      if (selectedEvent) {
        const updated = data?.find(e => e.slug === selectedEvent.slug);
        if (updated) setSelectedEvent(updated);
      }
    } catch (error) {
      console.error('Error fetching events from database:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchRegisteredEvents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('event_slug')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching registered events:', error);
        return;
      }
      
      if (data) {
        setRegisteredEvents(data.map(item => item.event_slug));
      }
    } catch (error) {
      console.error('Error in fetchRegisteredEvents:', error);
    }
  };

  const getEventsForSection = (section) => {
    if (section === "Upcoming") {
      return databaseEvents.filter(event => 
        event.status?.toLowerCase() === 'upcoming' && event.is_active === true
      );
    } else if (section === "Completed") {
      return databaseEvents.filter(event => 
        event.status?.toLowerCase() === 'completed' && event.is_active === true
      );
    } else {
      const dbEvents = databaseEvents.filter(event => 
        event.section?.toLowerCase() === section.toLowerCase() && event.is_active === true
      );
      
      const contentEvents = body.events.filter(event => 
        event.section === section
      ).map(event => ({
        ...event,
        isFromContent: true, 
      }));

      const allEvents = [...dbEvents, ...contentEvents];
      const uniqueEvents = allEvents.filter((event, index, self) =>
        index === self.findIndex(e => e.slug === event.slug)
      );

      return uniqueEvents;
    }
  };

  const handleEventRegistration = async (eventSlug, eventName) => {
    if (!user) {
      toast.warning('Please log in to register for events');
      return false;
    }

    try {
      // Fetch event details including is_cse_only
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('whatsapp_group_link, name, max_participants, current_participants, is_active, is_cse_only')
        .eq('slug', eventSlug)
        .single();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');

      // ✅ CHECK IF EVENT IS CSE-ONLY AND USER IS NOT CSE STUDENT
      if (eventData.is_cse_only) {
        const userEmail = user.email;
        const isCSEStudent = userEmail.toLowerCase().endsWith('@cse.nits.ac.in');
        
        if (!isCSEStudent) {
          toast.error(
            <div>
              <p className="font-bold">🚫 CSE Exclusive Event</p>
              <p className="text-xs mt-1">This event is for @cse.nits.ac.in emails only. Verify your college email in the dashboard.</p>
            </div>
          );
          return false;
        }
      }

      if (!eventData.is_active) {
        toast.warning('This event is currently not active for registration.');
        return false;
      }

      if (eventData.current_participants >= eventData.max_participants) {
        toast.warning('Sorry, this event is already full!');
        return false;
      }

      const { data, error } = await supabase
        .from('user_events')
        .insert([
          { 
            user_id: user.id, 
            event_slug: eventSlug,
            event_name: eventData.name,
            whatsapp_group_link: eventData.whatsapp_group_link
          }
        ])
        .select();

      if (error) {
        console.error('Registration error:', error);
        
        if (error.code === '23505') {
          setRegisteredEvents(prev => [...prev, eventSlug]);
          toast.info(`You're already registered for ${eventName}!`);
          return true;
        }
        
        throw error;
      }

      const { error: updateError } = await supabase
        .from('events')
        .update({ current_participants: (eventData.current_participants || 0) + 1 })
        .eq('slug', eventSlug);

      if (updateError) {
        console.error('Error updating participant count:', updateError);
      }

      setRegisteredEvents(prev => [...prev, eventSlug]);
      
      if (eventData.whatsapp_group_link) {
        toast.success(
          <div>
            <p className="font-bold">🎉 Registered successfully!</p>
            <p className="text-xs mt-0.5">WhatsApp link is available on the card & in your dashboard.</p>
          </div>
        );
      } else {
        toast.success(`🎉 Registered successfully for ${eventName}!`);
      }
      
      await fetchRegisteredEvents();
      return true;
      
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Failed to register for event. Please try again.');
      return false;
    }
  };

  const handleModalRegister = async () => {
    if (!selectedEvent) return;
    setRegisteringMap(prev => ({ ...prev, [selectedEvent.slug]: true }));
    const success = await handleEventRegistration(selectedEvent.slug, selectedEvent.name);
    setRegisteringMap(prev => ({ ...prev, [selectedEvent.slug]: false }));
    if (success) {
      await fetchDatabaseEvents();
    }
  };

  const isEventRegistered = (eventSlug) => {
    return registeredEvents.includes(eventSlug);
  };

  const isDatabaseEvent = (event) => {
    return event.id && !event.isFromContent;
  };

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      
      {!loaderDone && (
        <ArchPageLoader
          title="Events"
          label="Computer Science Society"
          steps={['Fetching programme', 'Reading registrations', 'Composing calendar']}
          ready={!loading}
          onDone={() => setLoaderDone(true)}
        />
      )}

      <div ref={archScope} className="min-h-screen w-full bg-arch-bg text-arch-ink pb-12">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
          <Header
            title="Events"
            description="From DSA Marathons, Development, ML and Design Workshops to sessions that sharpen technical expertise, from the spirited CSS Olympics that celebrate sportsmanship to cultural highlights like ESPERANZA, CSS GO, and our flagship annual fest CSS ABACUS — our calendar is packed with opportunities to learn, grow, and celebrate. Guided by the motto Participate, Enjoy & Learn, every event is designed to build all-rounders and leave behind unforgettable memories."
          />

          {/* Mobile Instructions */}
          <div className="flex items-center gap-2 border-b border-arch-line py-5 md:hidden">
            <FaHandPointer className="text-xs text-arch-faint" />
            <p className="arch-label">Tap a card for details and registration</p>
          </div>

          {sections.map((section) => {
            const sectionEvents = getEventsForSection(section);

            if (sectionEvents.length === 0) return null;

            return (
              <section key={section} className="py-16 md:py-24">
                <div className="mb-12 border-b border-arch-line pb-6">
                  <h2 className="arch-title text-[clamp(1.5rem,4vw,3rem)]">
                    {section} Events
                  </h2>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {sectionEvents.map((event) => (
                    <EventCard
                      key={event.slug}
                      slug={event.slug}
                      name={event.name}
                      description={event.description}
                      organizer={event.organizer}
                      status={event.status}
                      image={event.poster_url || event['poster-url']}
                      registrationLink={event.registrationLink}
                      moreEvents={event.moreEvents}
                      requiresAuth={isDatabaseEvent(event) && section !== "Completed"}
                      onRegister={
                        isDatabaseEvent(event) && 
                        section !== "Completed" && 
                        event.is_direct_registration
                          ? () => handleEventRegistration(event.slug, event.name) 
                          : null
                      }
                      isRegistered={isEventRegistered(event.slug)}
                      isCompleted={section === "Completed" || event.status?.toLowerCase() === 'completed'}
                      isDirectRegistration={event.is_direct_registration}
                      isCSEOnly={event.is_cse_only}
                      section={event.section || section}
                      venue={event.venue}
                      event_flow={event.event_flow}
                      whatsapp_group_link={event.whatsapp_group_link}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isRegistered={isEventRegistered(selectedEvent.slug)}
          isCompleted={selectedEvent.status?.toLowerCase() === 'completed' || selectedEvent.section === 'Completed'}
          registering={!!registeringMap[selectedEvent.slug]}
          onRegister={
            isDatabaseEvent(selectedEvent) && 
            selectedEvent.status?.toLowerCase() !== 'completed' && 
            selectedEvent.is_direct_registration
              ? handleModalRegister
              : null
          }
          user={user}
        />
      )}
    </>
  );
}
