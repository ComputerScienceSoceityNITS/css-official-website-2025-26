import React, { useState } from 'react'
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaArrowRight,
} from 'react-icons/fa'
import data from '../jsonData/members.json'
import '../styles/memberAnimations.css'
import MemberCard from '../components/MemberCard'

const Members = () => {
  const [flippedCards, setFlippedCards] = useState({})

  const handleCardFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  return (
    <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-6 py-10 overflow-hidden">
    
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <h1
            className="text-6xl font-bold mb-4 text-white"
            style={{ fontFamily: 'Goldman, sans-serif' }}
          >
            Our Members
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 mb-12 md:mb-16 p-6 md:p-8 bg-black/90 rounded-xl md:rounded-2xl backdrop-blur-lg border border-cyan-500/20 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-hexagon-pattern-black bg-[length:60px_60px] md:bg-[length:80px_80px] opacity-20"></div>
          <div className="absolute inset-0 opacity-20 md:opacity-30 hidden sm:block">
            <svg width="100%" height="100%" className="absolute inset-0">
              <path
                d="M0,50 Q150,0 300,100 T600,50 T900,150 T1200,50"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,200 Q200,150 400,250 T800,200 T1200,300 T1600,200"
                stroke="url(#circuitGradient)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,6"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="20"
                  to="0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient
                  id="circuitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00f7ff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00ccff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00a2ff" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cyan-400 text-xs font-mono opacity-70 animate-[matrix-rain_20s_linear_infinite]"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.7}s`,
                  top: '-5%',
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-1500 shadow-lg shadow-cyan-400/50 hidden sm:block"></div>
          <div className="absolute inset-0 border border-cyan-500/10 md:border-2 rounded-xl md:rounded-2xl pointer-events-none">
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400"></div>
          </div>
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="absolute -left-3 md:-left-4 top-3 w-1.5 md:w-2 h-12 md:h-16 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/30"></div>
            <div className="relative pl-4 md:pl-6">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full mr-2 shadow-lg shadow-red-500/40"></div>
                <span className="text-cyan-400 font-mono text-xs md:text-sm">
                  SYSTEM_TERMINAL
                </span>
              </div>
              <p className="text-gray-200 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl font-mono">
                <span className="text-cyan-400">$~ </span>
                Every member brings unique energy, ideas, and enthusiasm that
                make our society stronger each year. We're proud of the diverse
                talents and perspectives that each individual contributes to our
                community's success.
              </p>
              <div className="flex items-center mt-3 md:mt-4">
                <span className="text-cyan-400 font-mono text-sm md:text-base mr-2">
                  $~
                </span>
                <div className="w-1.5 h-4 md:w-2 md:h-5 bg-cyan-400 animate-blink"></div>
              </div>
              <div className="flex flex-wrap mt-4 md:mt-6 gap-3 md:gap-6">
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1.5 md:mr-2 animate-pulse shadow-lg shadow-green-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center bg-black/50 p-1.5 md:p-2 rounded border border-cyan-500/20">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full mr-1.5 md:mr-2 animate-pulse delay-1000 shadow-lg shadow-blue-500/40"></div>
                  <span className="text-cyan-300 font-mono text-xs md:text-sm">
                    MULTI_TALENTED
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="absolute -inset-2 md:-inset-4 bg-cyan-500/10 rounded-2xl md:rounded-3xl blur-lg md:blur-xl"></div>
              <div className="relative overflow-hidden rounded-lg md:rounded-xl border border-cyan-500/30 group bg-black/50">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                <img
                  src="images/member.png"
                  alt="Team members"
                  className="relative w-full transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/3 animate-scan opacity-80 shadow-lg shadow-cyan-400/50"></div>
                <div className="absolute top-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-l md:border-t-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute top-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-t border-r md:border-t-2 md:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-l md:border-b-2 md:border-l-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 md:w-4 md:h-4 border-b border-r md:border-b-2 md:border-r-2 border-cyan-400 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      IMG_PROC
                    </span>
                    <span className="text-cyan-300 font-mono text-xs md:text-sm">
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-cyan-900/30 h-0.5 md:h-1 mt-1 rounded-full">
                    <div className="w-full h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-cyan-500/30 rounded-full border border-cyan-400/50 animate-float-1 shadow-lg shadow-cyan-400/30 hidden sm:block"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 md:w-5 md:h-5 bg-purple-500/30 rounded-full border border-purple-400/50 animate-float-2 shadow-lg shadow-purple-400/30 hidden sm:block"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex flex-col items-center justify-center mt-10 mb-12 p-6 bg-black/60 rounded-xl border border-cyan-500/30 relative overflow-hidden max-w-4xl mx-auto text-center animate-fadeIn">
            {/* background effects */}
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

            {/* heading */}
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-100 bg-clip-text text-transparent animate-pulse">
              Meet Our Societies Members
            </h2>
          </div>

          <div className="space-y-16 mt-12 max-w-7xl mx-auto">
            {Object.entries(data.wings).map(([key, wing], idx) => (
              <div key={key} className="relative">
                <h2 className="text-4xl mb-8 font-semibold text-left border-l-4 border-cyan-500 pl-4 text-cyan-300">
                  {wing.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {wing.members['2025-26']?.map((member, i) => {
                    const cardId = `${key}-2025-26-${i}`
                    return (
                      <MemberCard
                        key={cardId}
                        member={member}
                        flipped={flippedCards[cardId]}
                        onFlip={() => handleCardFlip(cardId)}
                        index={i}
                      />
                    )
                  })}
                </div>
                {idx !== Object.entries(data.wings).length - 1 && (
                  <div className="mt-16 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-600 to-transparent opacity-40"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Members
