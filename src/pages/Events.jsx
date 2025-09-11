import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import eventsContent from "../events";
import MoreEvents from "./MoreEvents";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import "../styles/eventsAnimation.css";

// --- EventCard Component ---
function EventCard({
  name,
  description,
  organizer,
  status,
  image,
  registrationLink,
  moreEvents,
  slug,
}) {
  const [hovered, setHovered] = useState(false);

  // Detect if the device is touch-based
  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;
  const handleInteraction = () => {
    if (isTouchDevice) {
      setHovered(!hovered); // Toggle on tap
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Event Card */}
      <div className="perspective h-96 w-full">
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${hovered ? "rotate-y-180" : ""}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleInteraction}
        >
          {/* Front of Card with Neon Effect */}
          <div className="absolute inset-0 backface-hidden bg-gray-700 rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/60 hover:shadow-cyan-400/20 transition-all duration-500">
            {/* Neon glow effect */}
            <div className="absolute inset-0 rounded-xl bg-cyan-500/5 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Tech grid background */}
            <div className="absolute inset-0 bg-tech-grid opacity-10"></div>

            {/* Tech corner elements with glow */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70 opacity-90 hover:border-cyan-300 hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70 opacity-90 hover:border-cyan-300 hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70 opacity-90 hover:border-cyan-300 hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70 opacity-90 hover:border-cyan-300 hover:opacity-100 transition-all duration-500"></div>

            {/* Event poster */}
            <img
              src={image || "https://via.placeholder.com/400x300"}
              alt={name}
              className="w-full h-full object-cover relative z-10"
            />

            {/* Event name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 z-20">
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-cyan-300 text-sm">{status}</p>
            </div>

            {/* Hover hint */}
            {/* <div className="absolute top-4 right-4 opacity-60 hover:opacity-100 transition-opacity duration-500 z-20">
              <div className="flex items-center text-xs bg-black/70 px-3 py-1.5 rounded-full border border-cyan-500/40 hover:border-cyan-400/60 transition-all duration-500">
                <span className="mr-2 text-cyan-300">View details</span>
                <FaArrowRight className="text-cyan-400" /> 
              </div>
            </div> */}

            {/* Neon pulse effect */}
            <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-pulse-slow pointer-events-none"></div>
          </div>

          {/* Back of Card with Neon Effect */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-cyan-500/50 shadow-2xl shadow-cyan-500/30">
            {/* Neon glow effect */}
            <div className="absolute inset-0 rounded-xl bg-cyan-500/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Circuit pattern background */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-15"></div>

            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500"></div>

            {/* Tech corner elements with glow */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 opacity-90"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 opacity-90"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 opacity-90"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 opacity-90"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 z-10">
              {/* Header section */}
              <div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                  {name}
                </h3>
                <p className="text-sm text-cyan-300 font-mono mb-4">{status}</p>
                <p className="text-gray-300 mb-4">{description}</p>
                <p className="text-sm text-cyan-200">
                  <strong className="text-cyan-400">Organizer: </strong> {organizer}
                </p>
              </div>

              {/* Registration Link */}
              {registrationLink && (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-2 py-1 bg-gradient-to-r from-cyan-700 to-cyan-900 rounded-lg text-white hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 border border-cyan-500/50 hover:border-cyan-400/70"
                  onClick={(e) => e.stopPropagation()}
                >
                  Register Now <FaExternalLinkAlt className="text-xs" />
                </a>
              )}

              {/* Animated dots */}
              <div className="absolute top-4 right-4 flex space-x-1 z-20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow shadow-red-500/50"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300 shadow shadow-yellow-500/50"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-700 shadow shadow-green-500/50"></div>
              </div>
            </div>

            {/* Neon pulse effect */}
            <div className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-pulse-slow pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* More Events Link - Now outside the card with 2 margin gap */}
      {Array.isArray(moreEvents) && moreEvents.length > 0 && slug && (
        <Link
          to={`/events/${slug}`}
          className="mt-6 flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
        >
          View More Events <FaArrowRight className="text-xs" />
        </Link>
      )}
    </div>
  );
}

// --- Header Component ---
function Header({ title, description }) {
  return (
    <header className="text-center mb-12 relative z-10">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Goldman, sans-serif' }}>
        {title}
      </h1>
      <div className="max-w-4xl mx-auto p-6 md:p-8 bg-black/70 rounded-xl md:rounded-2xl backdrop-blur-lg border border-cyan-500/30 relative overflow-hidden mt-12 mb-16">
        {/* Tech elements */}
        <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] opacity-20"></div>
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 opacity-70"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 opacity-70"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>
        
        <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-mono">
          <span className="text-cyan-400">$~ </span>
          {description}
        </p>
      </div>
    </header>
  );
}

// --- EventsList Page ---
function EventsList() {
  const { body } = eventsContent;
  const sections = ["Yearly", "Cultural", "Technical"];

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-6 py-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Binary rain animation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs animate-[fall_5s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                top: '-20px',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 animate-grid-move"></div>

        {/* Hexagon pattern */}
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:100px_100px] opacity-5 animate-pulse"></div>

        {/* Floating tech elements */}
        <div className="absolute w-20 h-20 border-2 border-cyan-500/30 rounded-lg animate-float-1"></div>
        <div className="absolute w-16 h-16 border-2 border-purple-500/30 rounded-full right-20 top-1/4 animate-float-2"></div>
        <div className="absolute w-24 h-24 border-2 border-green-500/20 rotate-45 bottom-1/3 left-1/4 animate-float-3"></div>

        {/* Pulsing circles */}
        <div className="absolute w-72 h-72 bg-red-600/10 rounded-full blur-xl animate-[pulse_4s_ease-in-out_infinite] top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-xl animate-[pulse_5s_ease-in-out_infinite_1s] bottom-20 right-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Our Events"
          description="From DSA Marathons, Development, ML and Design Workshops to sessions that sharpen technical expertise, from the spirited CSS Olympics that celebrate sportsmanship to cultural highlights like ESPERANZA, CSS GO, and our flagship annual fest CSS ABACUS — our calendar is packed with opportunities to learn, grow, and celebrate. Guided by the motto Participate, Enjoy & Learn, every event is designed to build all-rounders and leave behind unforgettable memories."
        />

        {/* Event Sections */}
        {sections.map((section) => (
          <div key={section} className="mb-16 relative z-10">
            <div className="flex items-center justify-center mb-12 p-6 bg-black/60 rounded-xl border border-cyan-500/30 relative overflow-hidden">
              {/* Tech background elements */}
              <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>

              {/* Cyberpunk border corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
                {section.toUpperCase()} EVENTS
              </h2>
            </div>

            {/* Grid */}
            <div className="grid gap-x-16 gap-y-24 max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {body.events
                .filter((event) => event.section === section)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    name={event.name}
                    description={event.description || event.popup?.description}
                    organizer={event.organizer}
                    status={event.status}
                    image={event["poster-url"]}
                    registrationLink={event.registrationLink}
                    moreEvents={event.moreEvents}
                    slug={event.slug}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Events Component (with Router) ---
export default function Events() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/:slug" element={<MoreEvents />} />
      </Routes>
    </Router>
  );
}