import React, { useState, useEffect, useRef } from 'react'
import data from '../jsonData/members.json'
import '../styles/memberAnimations.css'
import MemberCard from '../components/MemberCard'
import { useArchReveal } from '../hooks/useArchAnim'
import ArchPageLoader from '../components/ArchPageLoader'
import { ArchChars } from '../components/ArchType'

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
        {/* ── HERO ──────────────────────────────────────────────
            The title is split per character and rises out of its mask;
            as you scroll it drifts left while the illustration drifts
            right, so the two halves pull apart rather than sliding as
            one block. member.png is a square flat illustration on white
            with the figures cropped at the baseline, so it is contained
            (never cover — a wide crop decapitates them) and anchored to
            the bottom of a white plate, which reads as the group
            standing on the card's floor. */}
        <header className="relative overflow-hidden pt-28 md:pt-36">
          <div className="grid grid-cols-1 items-end gap-12 pb-14 md:grid-cols-12 md:gap-8 md:pb-20">
            <div className="md:col-span-7">
              <p className="arch-label mb-8" data-arch="fade">
                The people behind the society
              </p>

              <div data-arch="scrub-x" data-arch-x="-3">
                <h1 data-arch="chars" className="arch-display text-[clamp(3rem,10vw,9rem)]">
                  <ArchChars text="Members" />
                </h1>
              </div>

              <div className="mt-10 max-w-xl" data-arch="fade" data-arch-delay="0.25">
                <p className="arch-lead">
                  Every member brings unique energy, ideas, and enthusiasm that make our
                  society stronger each year.
                </p>
                <p className="arch-body mt-5">
                  We&rsquo;re proud of the diverse talents and perspectives that each
                  individual contributes to our community&rsquo;s success.
                </p>
              </div>
            </div>

            <div className="md:col-span-5" data-arch="scrub-x" data-arch-x="3">
              <figure
                className="flex items-end justify-center overflow-hidden border border-arch-line bg-arch-card px-6 pt-8"
                data-arch="mask"
              >
                <img
                  src="/images/member.png"
                  alt="Illustration of the Computer Science Society members"
                  loading="lazy"
                  className="h-[280px] w-auto max-w-full object-contain object-bottom sm:h-[340px] md:h-[420px]"
                />
              </figure>
            </div>
          </div>

          {/* rule draws out from the left as the hero settles */}
          <div
            data-arch="fade"
            data-arch-delay="0.4"
            className="h-px w-full origin-left bg-arch-line"
          />
        </header>

        {/* Wings + members */}
        <section className="py-20 md:py-24">
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
