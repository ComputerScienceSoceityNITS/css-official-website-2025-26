import React, { useState, useEffect, useRef, useMemo } from 'react'
import data from '../jsonData/members2026.json'
import '../styles/memberAnimations.css'
import MemberCard from '../components/MemberCard'
import { useArchReveal } from '../hooks/useArchAnim'
import ArchPageLoader from '../components/ArchPageLoader'
import { ArchChars } from '../components/ArchType'

/**
 * members2026.json shape:
 *   leadership : [ person ]                          — the exec
 *   heads      : [ person ]                          — wing heads, each with a `wing`
 *   members    : { "CP Wing": [ person ], ... }      — wing name -> people
 *
 * person: { name, photo, role, wing, social: { instagram, facebook, linkedin } }
 *
 * `members` is an object keyed by wing, so its key order drives the order of
 * the wing sections. A flat array of people is also accepted, in case the
 * shape is flattened later.
 *
 * Leadership, heads and wing members are three separate sections — heads are
 * NOT folded into their wing's grid.
 */
const isPerson = (v) => v && typeof v === 'object' && typeof v.name === 'string'

/** Alphabetical by person name — not by wing. */
const byName = (a, b) =>
  (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })

/**
 * Leadership is ranked by office, not alphabetically: General Secretary,
 * President, Technical, then Finance & Ops. Matched on the role string, so
 * wording can change ("Technical Head" / "Technical Secretary") without
 * breaking. Vice President is slotted in defensively — absent from the
 * current roster, but it appears elsewhere in the society's data.
 * Anything unrecognised falls to the end, alphabetically.
 */
const LEADERSHIP_RANK = [
  /general\s*secretary|\bg\.?s\.?\b/i,
  /(?<!vice[\s-])president/i,
  /vice[\s-]?president/i,
  /technical/i,
  /financ|fin[\s-]?ops|operations/i,
]

const leadershipRank = (person) => {
  const role = person?.role || ''
  const i = LEADERSHIP_RANK.findIndex((re) => re.test(role))
  return i === -1 ? LEADERSHIP_RANK.length : i
}

const byOffice = (a, b) => {
  const d = leadershipRank(a) - leadershipRank(b)
  return d !== 0 ? d : byName(a, b)
}

const buildRoster = (data) => {
  const leadership = Array.isArray(data?.leadership)
    ? data.leadership.filter(isPerson).slice().sort(byOffice)
    : []

  const rawHeads = Array.isArray(data?.heads) ? data.heads.filter(isPerson) : []

  const rawMembers = data?.members
  const byWing = new Map()
  const push = (person, wingName) => {
    const wing = wingName || person.wing || 'Society'
    if (!byWing.has(wing)) byWing.set(wing, [])
    byWing.get(wing).push(person)
  }

  let order = []
  if (rawMembers && !Array.isArray(rawMembers) && typeof rawMembers === 'object') {
    order = Object.keys(rawMembers)
    order.forEach((wing) => {
      const list = rawMembers[wing]
      if (Array.isArray(list)) list.filter(isPerson).forEach((p) => push(p, wing))
    })
  } else if (Array.isArray(rawMembers)) {
    rawMembers.filter(isPerson).forEach((p) => push(p))
  }

  // Every head carries role "Head", so a combined grid would caption sixteen
  // cards identically. Show the wing they head instead — the section heading
  // already supplies the word "Heads". Spread, so the source data is untouched.
  // Ordered alphabetically by name; the wing is a caption, not the sort key.
  const heads = rawHeads
    .slice()
    .sort(byName)
    .map((h) => ({ ...h, role: h.wing || h.role }))

  const extras = Array.from(byWing.keys()).filter((w) => !order.includes(w))

  const wings = [...order, ...extras]
    .map((name) => ({ name, people: (byWing.get(name) ?? []).slice().sort(byName) }))
    .filter((w) => w.people.length > 0)

  return { leadership, heads, wings }
}

const Members = () => {
  const [flippedCards, setFlippedCards] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const scope = useRef(null)

  const { leadership, heads, wings } = useMemo(() => buildRoster(data), [])

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
          steps={[
            'Fetching roster',
            'Loading portraits',
            'Composing directory',
          ]}
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
                  <h1
                    data-arch="chars"
                    className="arch-display text-[clamp(3rem,10vw,9rem)]"
                  >
                    <ArchChars text="Members" />
                  </h1>
                </div>

                <div
                  className="mt-10 max-w-xl"
                  data-arch="fade"
                  data-arch-delay="0.25"
                >
                  <p className="arch-lead">
                    Every member brings unique energy, ideas, and enthusiasm
                    that make our society stronger each year.
                  </p>
                  <p className="arch-body mt-5">
                    We&rsquo;re proud of the diverse talents and perspectives
                    that each individual contributes to our community&rsquo;s
                    success.
                  </p>
                </div>
              </div>

              <div
                className="md:col-span-5"
                data-arch="scrub-x"
                data-arch-x="3"
              >
                {/* member.png already ships with a transparent background, so it
                  sits straight on the beige — no card, no border. */}
                <figure
                  className="flex items-end justify-center"
                  data-arch="fade"
                  data-arch-delay="0.3"
                >
                  <img
                    src="/images/member.png"
                    alt="Illustration of the Computer Science Society members"
                    loading="lazy"
                    className="h-[280px] w-auto max-w-full object-contain object-bottom sm:h-[360px] md:h-[460px]"
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

          {/* Leadership */}
          {leadership.length > 0 && (
            <section className="py-20 md:py-24">
              <div className="mb-12 border-b border-arch-line pb-6">
                <h2 className="arch-title text-[clamp(1.5rem,4vw,3rem)]">Leadership</h2>
              </div>

              <div className="arch-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {leadership.map((member, i) => {
                  const cardId = `leadership-${member.name}-${i}`
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
            </section>
          )}

          {/* Heads — every wing's heads together, not inside their wing */}
          {heads.length > 0 && (
            <section className="border-t border-arch-line py-20 md:py-24">
              <div className="mb-12 border-b border-arch-line pb-6">
                <h2 className="arch-title text-[clamp(1.5rem,4vw,3rem)]">Heads</h2>
              </div>

              <div className="arch-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {heads.map((member, i) => {
                  const cardId = `head-${member.wing}-${member.name}-${i}`
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
            </section>
          )}

          {/* Wing members */}
          <section className="border-t border-arch-line pb-20 pt-20 md:pb-24 md:pt-24">
            {wings.map((wing) => (
              <div key={wing.name} className="mb-24 last:mb-0">
                <div className="mb-12 border-b border-arch-line pb-6">
                  <h2 className="arch-title text-[clamp(1.5rem,4vw,3rem)]">{wing.name}</h2>
                </div>

                <div className="arch-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {wing.people.map((member, i) => {
                    const cardId = `${wing.name}-${member.name}-${i}`
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
