import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import eventsContent from '../constants/events'
import { FaExternalLinkAlt } from 'react-icons/fa'
import '../styles/eventsAnimation.css'

function MoreEvents() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { body } = eventsContent

  const mainEvent = body.events.find((event) => event.slug === slug)

  if (!mainEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-arch-ink bg-arch-card">
        <h2 className="text-2xl">Event not found.</h2>
      </div>
    )
  }

  return (
    
    <div className="relative min-h-screen bg-arch-bg text-arch-ink px-4 sm:px-6 md:px-10 py-8 md:py-10 overflow-hidden">
      {/* 🟢 BACK BUTTON */}
      <button
        onClick={() => navigate('/events')}
        className="fixed top-20 sm:top-20 left-4 sm:left-6 flex items-center gap-2 bg-arch-card px-2 sm:px-4 py-2 sm:py-3 border border-arch-line text-arch-ink font-semibold hover:bg-arch-card transition-all duration-300 text-sm sm:text-base z-[2000]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-arch-ink text-xs animate-[fall_5s_linear_infinite]"
              style={{
                left: '${Math.random() * 100}%',
                animationDelay: '${Math.random() * 5}s',
                top: '-20px',
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] md:bg-[length:50px_50px] opacity-10 animate-grid-move"></div>

        {/* Hexagon pattern */}
        <div className="absolute inset-0 bg-hexagon-pattern bg-[length:80px_80px] md:bg-[length:100px_100px] opacity-5"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Event Header */}
        <header className="text-center mb-8 md:mb-12 relative z-10">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-arch-ink"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            {mainEvent.name}
          </h1>
          <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-arch-card border border-arch-line relative overflow-hidden">
            <p className="text-arch-ink-3 text-base md:text-lg lg:text-xl leading-relaxed">
              <span className="text-arch-ink">$~ </span>
              {mainEvent.description || mainEvent.popup?.description}
            </p>
          </div>
        </header>

        {/* Sub Events */}
        {Array.isArray(mainEvent.moreEvents) &&
        mainEvent.moreEvents.length > 0 ? (
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8 md:mb-12 p-4 md:p-6 bg-arch-card border border-arch-line relative overflow-hidden">
              {/* Cyberpunk border corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-arch-line"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-arch-line"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-arch-line"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-arch-line"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-arch-card bg-clip-text text-transparent text-center">
                MORE EVENTS UNDER {mainEvent.name.toUpperCase()}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-14 w-full max-w-6xl mx-auto px-2 sm:px-4 justify-items-center">
              {mainEvent.moreEvents.map((subEvent, index) => (
                <SubEventCard key={index} subEvent={subEvent} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 md:p-8 bg-arch-card border border-arch-line">
            <p className="text-arch-ink">
              No additional events found under this category.
            </p>
          </div>
        )}
      </div>
    </div>  
  )
}

// SubEventCard Component
function SubEventCard({ subEvent }) {
  const [hovered, setHovered] = useState(false)
  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window

  const handleInteraction = () => {
    if (isTouchDevice) setHovered(!hovered)
  }

  return (
    <div
      className="w-full max-w-md min-h-[320px] sm:min-h-[370px] md:min-h-[400px] perspective"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleInteraction}
    >
      {/* Flip card container */}
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d   ${
          hovered ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden overflow-hidden border border-arch-line">
          {subEvent['poster-url'] ? (
            <img
              src={subEvent['poster-url']}
              alt={subEvent.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-arch-bg-alt flex items-center justify-center">
              <span className="text-arch-ink-3 text-sm">
                NO_POSTER_AVAILABLE
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-arch-card p-4">
            <h3 className="text-lg sm:text-xl font-bold text-arch-ink">
              {subEvent.name}
            </h3>
            <p className="text-arch-ink text-xs sm:text-sm">
              {subEvent.status}
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-arch-card overflow-hidden border border-arch-line p-4 flex flex-col justify-between">
          {/* Tech corners */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-arch-line opacity-90"></div>
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-arch-line opacity-90"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-arch-line opacity-90"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-arch-line opacity-90"></div>

          {/* Animated dots */}
          <div className="absolute top-4 right-4 flex space-x-1 z-20">
            <div className="w-2 h-2 bg-arch-ink rounded-full"></div>
            <div className="w-2 h-2 bg-arch-ink rounded-full delay-300"></div>
            <div className="w-2 h-2 bg-arch-ink rounded-full delay-700"></div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-arch-ink">
              {subEvent.name}
            </h3>
            <p className="text-xs sm:text-sm text-arch-ink mb-2">
              {subEvent.status}
            </p>
            {subEvent.description && (
              <p className="text-arch-ink-3 text-sm sm:text-base mb-2">
                {subEvent.description}
              </p>
            )}
            {subEvent.date && (
              <p className="text-xs sm:text-sm text-arch-ink mb-1">
                <strong className="text-arch-ink">Date: </strong>
                {subEvent.date}
              </p>
            )}
            {subEvent.venue && (
              <p className="text-xs sm:text-sm text-arch-ink mb-2">
                <strong className="text-arch-ink">Venue: </strong>
                {subEvent.venue}
              </p>
            )}
          </div>
          {subEvent.registrationLink && (
            <a
              href={subEvent.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 bg-arch-card text-arch-ink transition-all duration-300 border border-arch-line hover:border-arch-line text-sm sm:text-base"
              onClick={(e) => e.stopPropagation()}
            >
              Register Now <FaExternalLinkAlt className="text-xs" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoreEvents