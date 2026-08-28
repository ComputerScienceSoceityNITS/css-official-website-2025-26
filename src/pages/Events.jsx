// pages/EventsList.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchReveal } from "../hooks/useArchAnim";
import ArchPageLoader from "../components/ArchPageLoader";
import { Link, Navigate } from "react-router-dom";
import eventsContent from "../constants/events";
import { FaArrowRight, FaExternalLinkAlt, FaLock, FaCheck, FaHandPointer, FaInfoCircle, FaTrophy, FaGraduationCap } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
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
  isCSEOnly = false
}) {
  const [hovered, setHovered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleInteraction = () => {
    if (isTouchDevice) setHovered(!hovered);
  };

  const handleRegisterClick = async (e) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      e.stopPropagation();
      alert('Please login to register for this event');
      return;
    }
    
    if (onRegister && user && !isRegistered) {
      e.preventDefault();
      e.stopPropagation();
      setRegistering(true);
      await onRegister();
      setRegistering(false);
    }
  };

  const getTapMessage = () => {
    if (status?.toLowerCase() === 'upcoming') {
      return "Tap for info & register";
    }
    if (isCompleted) {
      return "Tap for event details";
    }
    return "Tap for more info";
  };

  const showDetail = hovered;

  return (
    <div className="w-full min-w-0" data-arch="fade">
      <article
        className={`group relative flex h-full min-h-[420px] flex-col border bg-arch-card transition-colors duration-500 ${
          isCompleted ? 'border-arch-line opacity-80' : 'border-arch-line hover:border-arch-ink/30'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleInteraction}
      >
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
          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {isCompleted && (
              <span className="arch-label bg-arch-card px-2 py-1">Completed</span>
            )}
            {isCSEOnly && !isCompleted && (
              <span className="arch-label bg-arch-card px-2 py-1">CSE only</span>
            )}
            {!isDirectRegistration && !isCompleted && (
              <span className="arch-label bg-arch-card px-2 py-1">Multi-event</span>
            )}
            {requiresAuth && !user && !isCompleted && (
              <span className="arch-label bg-arch-card px-2 py-1">Login required</span>
            )}
            {isRegistered && !isCompleted && (
              <span className="arch-label bg-arch-ink px-2 py-1 text-arch-bg">Registered</span>
            )}
          </div>

          {isTouchDevice && !hovered && (
            <span className="arch-label absolute right-4 top-4 flex items-center gap-1.5 bg-arch-card px-2 py-1">
              <FaHandPointer className="text-[10px]" />
              <span className="hidden xs:inline">{getTapMessage()}</span>
              <span className="xs:hidden">Tap</span>
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-7">
          <div className="flex items-center justify-between border-b border-arch-line pb-4">
            <span className="arch-label">{status}</span>
            <span className="arch-label">{organizer}</span>
          </div>

          <h3 className="arch-title mt-6 text-2xl">{name}</h3>
          <p className="arch-body mt-4 grow">{description}</p>

          {/* Detail drawer — same hovered state that used to flip the card */}
          <AnimatePresence initial={false}>
            {showDetail && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 space-y-3 border-t border-arch-line pt-5">
                  {isCompleted && (
                    <p className="arch-body flex gap-2 text-[13px]">
                      <FaTrophy className="mt-1 shrink-0 text-arch-faint" />
                      This event has been successfully completed. Stay tuned for future events.
                    </p>
                  )}
                  {isCSEOnly && !isCompleted && (
                    <p className="arch-body flex gap-2 text-[13px]">
                      <FaGraduationCap className="mt-1 shrink-0 text-arch-faint" />
                      Exclusively for CSE students (@cse.nits.ac.in emails only).
                    </p>
                  )}
                  {!isDirectRegistration && !isCompleted && (
                    <p className="arch-body flex gap-2 text-[13px]">
                      <FaInfoCircle className="mt-1 shrink-0 text-arch-faint" />
                      Contains multiple sub-events. Open the event page to register.
                    </p>
                  )}
                  {isTouchDevice && (
                    <p className="arch-label pt-1">Tap again to close</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          {!isCompleted && registrationLink ? (
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-btn mt-8 w-full"
              onClick={handleRegisterClick}
            >
              <span>Register Now</span>
              <FaExternalLinkAlt className="text-[10px]" />
            </a>
          ) : !isCompleted && onRegister && isDirectRegistration ? (
            <button
              onClick={handleRegisterClick}
              disabled={isRegistered || registering}
              className="arch-btn mt-8 w-full"
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
            <Link to={`/events/${slug}`} className="arch-btn mt-8 w-full">
              <span>View Events</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          ) : null}
        </div>
      </article>

      {/* More Events Link */}
      {Array.isArray(moreEvents) && moreEvents.length > 0 && slug && (
        <Link
          to={`/events/${slug}`}
          className="arch-label mt-4 flex items-center justify-center gap-2 transition-colors duration-300 hover:text-arch-ink"
        >
          View More Events <FaArrowRight className="text-[10px]" />
        </Link>
      )}
    </div>
  );
}

function Header({ title, description }) {
  return (
    <header className="border-b border-arch-line py-20 md:py-32">
      <h1 data-arch="lines" className="arch-display text-[clamp(2.75rem,9vw,8rem)]">
        <span className="arch-split-line">
          <span className="arch-line-inner">{title}</span>
        </span>
      </h1>
      <p
        className="arch-body mt-10 max-w-3xl"
        data-arch="fade"
        data-arch-delay="0.2"
      >
        {description}
      </p>
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
      alert('Please login to register for events');
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
          alert('🚫 This event is exclusively for CSE students only.\n\nYour email: ' + userEmail + '\nRequired domain: @cse.nits.ac.in');
          return false;
        }
      }

      if (!eventData.is_active) {
        alert('This event is currently not active for registration.');
        return false;
      }

      if (eventData.current_participants >= eventData.max_participants) {
        alert('Sorry, this event is already full!');
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
          alert(`You're already registered for ${eventName}! Check your dashboard for the WhatsApp group link.`);
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
        alert(`🎉 Successfully registered for ${eventName}!\n\nJoin the WhatsApp group for updates:\n${eventData.whatsapp_group_link}\n\nYou can also find this link in your dashboard.`);
      } else {
        alert(`🎉 Successfully registered for ${eventName}!\n\nCheck your dashboard for event updates.`);
      }
      
      await fetchRegisteredEvents();
      return true;
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register for event. Please try again.');
      return false;
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
      {!loaderDone && (
        <ArchPageLoader
          title="Events"
          label="Computer Science Society"
          steps={['Fetching programme', 'Reading registrations', 'Composing calendar']}
          ready={!loading}
          onDone={() => setLoaderDone(true)}
        />
      )}

    <div ref={archScope} className="min-h-screen w-full bg-arch-bg text-arch-ink">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        <Header
          title="Our Events"
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
              <div className="grid grid-cols-1 gap-px bg-arch-line sm:grid-cols-2 xl:grid-cols-3">
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
                    isCompleted={section === "Completed"}
                    isDirectRegistration={event.is_direct_registration}
                    isCSEOnly={event.is_cse_only}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
