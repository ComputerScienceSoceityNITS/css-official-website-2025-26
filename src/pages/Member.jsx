import React, { useState, useEffect, useRef } from 'react'
import data from '../jsonData/members.json'
import '../styles/memberAnimations.css'
import MemberCard from '../components/MemberCard'
import { useArchReveal } from '../hooks/useArchAnim'
import ArchPageLoader from '../components/ArchPageLoader'

const Members = () => {
  const [flippedCards, setFlippedCards] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const scope = useRef(null)

  useArchReveal(scope, [isLoading, imagesLoaded, loaderDone])

  // Hold the page still behind the panel until it lifts.
  useEffect(() => {
    document.body.style.overflow = loaderDone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

  const handleCardFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  // Simulate loading and wait for images
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Preload main image
    const img = new Image()
    img.src = 'images/member.png'
    img.onload = () => setImagesLoaded(true)
    // Never strand the loader on a missing or slow asset — the panel
    // holds body scroll, so it must always be able to lift.
    img.onerror = () => setImagesLoaded(true)
    const imageFallback = setTimeout(() => setImagesLoaded(true), 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(imageFallback)
    }
  }, [])

  return (
    <>
      {!loaderDone && (
        <ArchPageLoader
          title="Members"
          label="Computer Science Society"
          steps={['Fetching roster', 'Loading portraits', 'Composing directory']}
          ready={!isLoading && imagesLoaded}
          onDone={() => setLoaderDone(true)}
        />
      )}

    <div ref={scope} className="min-h-screen w-full bg-arch-bg text-arch-ink">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        {/* Masthead */}
        <header className="border-b border-arch-line py-20 md:py-32">
          <h1 data-arch="lines" className="arch-display text-[clamp(2.75rem,9vw,8rem)]">
            <span className="arch-split-line">
              <span className="arch-line-inner">Our</span>
            </span>
            <span className="arch-split-line">
              <span className="arch-line-inner">Members</span>
            </span>
          </h1>
        </header>

        {/* Intro + figure */}
        <section className="grid grid-cols-1 gap-12 border-b border-arch-line py-20 md:grid-cols-12 md:gap-6 md:py-28">
          <div className="md:col-span-5">
            <p
              className="text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
              data-arch="fade"
            >
              Every member brings unique energy, ideas, and enthusiasm that make our
              society stronger each year.
            </p>
            <p className="arch-body mt-6" data-arch="fade" data-arch-delay="0.1">
              We're proud of the diverse talents and perspectives that each individual
              contributes to our community's success.
            </p>
          </div>

          <div className="md:col-span-7">
            <figure className="border border-arch-line bg-arch-card">
              <div className="overflow-hidden" data-arch="mask">
                <img
                  src="/images/member.png"
                  alt="Team members"
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
            </figure>
          </div>
        </section>

        {/* Wings + members */}
        <section className="py-20 md:py-28">
          {Object.entries(data.wings).map(([key, wing]) => (
            <div key={key} className="mb-24 last:mb-0">
              <div className="mb-12 border-b border-arch-line pb-6">
                <h2 className="arch-title text-[clamp(1.5rem,4vw,3rem)]">{wing.name}</h2>
              </div>

              <div className="arch-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </div>
          ))}
        </section>
      </div>
    </div>
    </>
  )
}

export default Members
