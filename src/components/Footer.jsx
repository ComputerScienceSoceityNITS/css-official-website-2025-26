import React, { useEffect, useRef, useState } from 'react'
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useArchReveal } from '../hooks/useArchAnim'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/members', label: 'Members' },
  { path: '/wings', label: 'Wings' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/materials', label: 'Materials' },
]

const socials = [
  {
    icon: FaInstagram,
    label: 'Instagram',
    url: 'https://www.instagram.com/css_nits/?hl=en',
  },
  {
    icon: FaFacebook,
    label: 'Facebook',
    url: 'https://www.facebook.com/CSS.NITSilchar',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/cssnits/posts/?feedView=all',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    url: 'https://github.com/ComputerScienceSoceityNITS/',
  },
]

/** Stacked copies of the glyphs fake the extrusion. More layers at a smaller
 *  step reads as a machined edge; few layers at a big step reads as a blur. */
const RIDGE_LAYERS = 16

const Footer = () => {
  const scope = useRef(null)
  const year = new Date().getFullYear()
  const ridgeRef = useRef(null)
  const [clock, setClock] = useState('')

  useArchReveal(scope, [])

  // A quiet live detail: the society's local time.
  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          new Intl.DateTimeFormat('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata',
          }).format(new Date())
        )
      } catch {
        setClock('')
      }
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  // The ridge rises as the footer enters view.
  useEffect(() => {
    const el = ridgeRef.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined

    const ctx = gsap.context(() => {
      // Reveal bottom-up with clip-path rather than translating the block.
      // inset(top right bottom left): a 100% top inset leaves nothing
      // visible, and easing it to 0 grows the wordmark upward from its
      // own baseline — so it never spills past the box the way a
      // translate would now that nothing clips it vertically.
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top 92%',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={scope}
      className="relative border-t border-arch-line bg-arch-bg text-arch-ink"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        {/* Masthead */}
        <div className="grid grid-cols-1 gap-10 border-b border-arch-line py-16 md:grid-cols-12 md:gap-6 md:py-24">
          <div className="md:col-span-7">
            <p className="arch-label mb-8" data-arch="fade">
              Computer Science Society
            </p>
            <h2
              data-arch="lines"
              className="arch-display text-[clamp(2.25rem,6vw,4.5rem)]"
            >
              <span className="arch-split-line">
                <span className="arch-line-inner">Building the future</span>
              </span>
              <span className="arch-split-line">
                <span className="arch-line-inner">of technology.</span>
              </span>
            </h2>
          </div>

          <div
            className="flex flex-col justify-end md:col-span-5 md:items-end"
            data-arch="fade"
            data-arch-delay="0.15"
          >
            <p className="arch-body max-w-sm md:text-right">
              Innovation, collaboration, and continuous learning at the National
              Institute of Technology, Silchar.
            </p>
            <div className="mt-8 flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  title={social.label}
                  aria-label={social.label}
                  className="text-arch-ink-3 transition-all duration-300 hover:-translate-y-0.5 hover:text-arch-ink"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 border-b border-arch-line md:grid-cols-12">
          <div
            className="border-arch-line py-12 md:col-span-4 md:border-r md:pr-10"
            data-arch="fade"
          >
            <p className="arch-label mb-8">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="arch-link text-sm tracking-[-0.01em] text-arch-ink-3 transition-colors duration-300 hover:text-arch-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="border-t border-arch-line py-12 md:col-span-4 md:border-r md:border-t-0 md:px-10"
            data-arch="fade"
            data-arch-delay="0.08"
          >
            <p className="arch-label mb-8">Contact</p>
            <div className="space-y-4 text-sm tracking-[-0.01em] text-arch-ink-3">
              <a
                href="mailto:computersciencesociety@cse.nits.ac.in"
                className="arch-link block break-all hover:text-arch-ink"
              >
                computersciencesociety@cse.nits.ac.in
              </a>
              <p>National Institute of Technology, Silchar</p>
            </div>
          </div>

          <div
            className="border-t border-arch-line py-12 md:col-span-4 md:border-t-0 md:pl-10"
            data-arch="fade"
            data-arch-delay="0.16"
          >
            <p className="arch-label mb-8">Status</p>

            {clock && (
              <p className="arch-num mt-4 text-sm tracking-[-0.01em] text-arch-ink-3">
                {clock} IST · Silchar
              </p>
            )}
            <p className="arch-body mt-6 max-w-xs">
              Designed and maintained by the Dev Wing.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        {/* <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[0.16em] text-arch-faint">
            &copy; {year} Computer Science Society
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
              { to: '/conduct', label: 'Conduct' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] uppercase tracking-[0.16em] text-arch-faint transition-colors duration-300 hover:text-arch-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div> */}
      </div>

      {/* ── WORDMARK ──────────────────────────────────────────────
          "CSS" closing the page, extruded by stacked copies of the
          glyphs. The block sizes to the type — a fixed-height window
          clipped it at every breakpoint. */}
      <div className="arch-ridge-window relative w-full border-t border-arch-line pt-10 md:pt-14">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
          <div
            ref={ridgeRef}
            aria-hidden="true"
            className="arch-ridge text-center text-[clamp(4.5rem,23vw,18rem)]"
          >
            {Array.from({ length: RIDGE_LAYERS }).map((_, i) => {
              const depth = RIDGE_LAYERS - i
              return (
                <span
                  key={i}
                  className="arch-ridge__layer"
                  style={{
                    transform: `translate(${depth * 0.34}px, ${depth * 1.5}px)`,
                    opacity: 0.16 + (i / RIDGE_LAYERS) * 0.46,
                  }}
                >
                  CSS NITS
                </span>
                // kk
              )
            })}
            <span className="arch-ridge__face">CSS NITS</span>
          </div>

          <div className="flex items-center justify-between border-t border-arch-line py-6">
            <span className="arch-label">Computer Science Society</span>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                  ).matches
                    ? 'auto'
                    : 'smooth',
                })
              }
              className="arch-label transition-colors duration-300 hover:text-black"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
