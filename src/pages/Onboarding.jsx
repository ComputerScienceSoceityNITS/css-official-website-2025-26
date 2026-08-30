import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useArchReveal, archTween } from '../hooks/useArchAnim'
import { parseInstituteEmail, yearOfStudy } from '../utils/instituteEmail'

/* ------------------------------------------------------------------
   Onboarding — the one-time intake every account passes through,
   including the members carried over from the previous website. Their
   row already exists, so the form arrives prefilled and the step is a
   confirmation rather than a chore.

   Two panels, not a wizard with a dozen screens: what the institute
   address already tells us, and the three things it cannot.
------------------------------------------------------------------ */

const STEPS = ['Identity', 'Details', 'Done']

function Field({ id, label, hint, children }) {
  return (
    <div className="mb-7">
      <label htmlFor={id} className="arch-label mb-3 block">
        {label}
      </label>
      {children}
      {hint && <p className="mt-3 text-[13px] text-arch-ink-3">{hint}</p>}
    </div>
  )
}

const Onboarding = () => {
  const { user, profile, requiresOnboarding, completeOnboarding, shouldSeeWelcomeStory } =
    useAuth()
  const navigate = useNavigate()
  const scope = useRef(null)

  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [scholarId, setScholarId] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const identity = useMemo(
    () => parseInstituteEmail(user?.email || ''),
    [user?.email]
  )
  const year = yearOfStudy(identity.admissionYear)

  useArchReveal(scope, [step])

  /* Prefill: the profile row wins over Google's metadata, because a
     returning member may have corrected their name here already. */
  useEffect(() => {
    if (!user) return
    const meta = user.user_metadata || {}
    const guessed =
      profile?.full_name ||
      meta.full_name ||
      meta.name ||
      (identity.name ? identity.name.replace(/[._-]+/g, ' ') : '')
    setFullName((prev) => prev || guessed || '')
    setScholarId((prev) => prev || profile?.scholar_id || '')
    setContactNumber((prev) => prev || profile?.contact_number || '')
  }, [user, profile, identity.name])

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true })
  }, [user, navigate])

  /* Someone who is already onboarded should not be able to sit on this
     page — but only bounce them if they did not just finish it here. */
  useEffect(() => {
    if (user && !requiresOnboarding && step === 0) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, requiresOnboarding, step, navigate])

  const returning = Boolean(profile?.full_name && profile?.scholar_id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!scholarId.trim()) return setError('Please enter your scholar ID.')
    const phone = contactNumber.replace(/\s+/g, '')
    if (phone && !/^\+?\d{10,13}$/.test(phone)) {
      return setError('That contact number does not look right.')
    }

    setSaving(true)
    try {
      await completeOnboarding({
        fullName: fullName.trim(),
        scholarId: scholarId.trim(),
        contactNumber: phone || null,
      })
      setStep(2)
    } catch (err) {
      setError(err.message || 'Could not save your details. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const finish = () => {
    if (shouldSeeWelcomeStory?.()) {
      navigate('/welcome-story', { replace: true })
      return
    }
    let destination = '/dashboard'
    try {
      const stored = sessionStorage.getItem('auth_redirect')
      if (stored) {
        destination = stored
        sessionStorage.removeItem('auth_redirect')
      }
    } catch {
      /* private mode — the dashboard is a fine landing */
    }
    navigate(destination, { replace: true })
  }

  if (!user) return null

  return (
    <div ref={scope} className="min-h-screen w-full bg-arch-bg text-arch-ink">
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
        {/* Step rail */}
        <div className="mb-16 flex items-center gap-6" data-arch="fade">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-3">
              <span
                className={`arch-label transition-colors duration-500 ${
                  i <= step ? 'text-arch-ink' : 'text-arch-faint'
                }`}
              >
                {String(i + 1).padStart(2, '0')} {label}
              </span>
              <span className="relative h-px flex-1 bg-arch-line">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-arch-ink"
                  initial={{ width: 0 }}
                  animate={{ width: i < step ? '100%' : i === step ? '35%' : 0 }}
                  transition={archTween}
                />
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── 01 IDENTITY ─────────────────────────────────────── */}
          {step === 0 && (
            <motion.section
              key="identity"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={archTween}
            >
              <p className="arch-label mb-8">
                {returning ? 'Welcome back' : 'Welcome'}
              </p>
              <h1 className="arch-display text-[clamp(2.25rem,7vw,5rem)]">
                {returning ? 'Let us reconnect you.' : 'Let us set you up.'}
              </h1>
              <p className="arch-lead mt-10 max-w-xl">
                {returning
                  ? 'Your account carried over from the previous site. Confirm what we hold and you are done.'
                  : 'Your institute address already tells us most of it. Check that this is right.'}
              </p>

              <dl className="mt-14 max-w-2xl border-t border-arch-line">
                {[
                  ['Address', identity.email || user.email],
                  ['Branch', identity.branchName || '—'],
                  [
                    'Batch',
                    identity.admissionYear
                      ? `${identity.admissionYear} intake${
                          year ? ` · year ${year}` : ''
                        }`
                      : '—',
                  ],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="grid grid-cols-1 gap-1 border-b border-arch-line py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                    data-arch="fade"
                  >
                    <dt className="arch-label sm:col-span-3">{term}</dt>
                    <dd className="text-[15px] tracking-[-0.01em] text-arch-ink sm:col-span-9">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="arch-btn arch-btn-solid mt-14 px-10 py-4"
              >
                <span>Continue</span>
              </button>
            </motion.section>
          )}

          {/* ── 02 DETAILS ──────────────────────────────────────── */}
          {step === 1 && (
            <motion.section
              key="details"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={archTween}
              className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-5">
                <p className="arch-label mb-8">Step 02</p>
                <h2 className="arch-title text-[clamp(1.75rem,4.5vw,3.25rem)]">
                  Three things the address cannot tell us.
                </h2>
                <p className="arch-body mt-8 max-w-sm">
                  Your name as it should appear on certificates, your scholar ID
                  for event registration, and a number we can reach you on.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="md:col-span-7">
                {error && (
                  <div
                    role="alert"
                    className="mb-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4"
                  >
                    <p className="arch-label mb-1">Check this</p>
                    <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">
                      {error}
                    </p>
                  </div>
                )}

                <Field
                  id="fullName"
                  label="Full name"
                  hint="This is printed on every certificate you earn."
                >
                  <input
                    id="fullName"
                    type="text"
                    className="arch-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="As it should appear on certificates"
                  />
                </Field>

                <Field id="scholarId" label="Scholar ID">
                  <input
                    id="scholarId"
                    type="text"
                    className="arch-input"
                    value={scholarId}
                    onChange={(e) => setScholarId(e.target.value)}
                    required
                    placeholder="Your institute scholar ID"
                  />
                </Field>

                <Field id="contactNumber" label="Contact number" hint="Optional.">
                  <input
                    id="contactNumber"
                    type="tel"
                    className="arch-input"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                  />
                </Field>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="arch-btn arch-btn-solid px-10 py-4"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
                        <span>Saving</span>
                      </>
                    ) : (
                      <span>Finish</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="arch-link text-sm"
                    disabled={saving}
                  >
                    Back
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {/* ── 03 DONE ─────────────────────────────────────────── */}
          {step === 2 && (
            <motion.section
              key="done"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={archTween}
            >
              <p className="arch-label mb-8">Step 03</p>
              <h2 className="arch-display text-[clamp(2.25rem,7vw,5rem)]">
                You&rsquo;re in.
              </h2>
              <p className="arch-lead mt-10 max-w-xl">
                {shouldSeeWelcomeStory?.()
                  ? 'One more thing — a short introduction we put together for the incoming Computer Science batch.'
                  : 'Your account is ready. Registration, certificates and the archive are all open to you now.'}
              </p>

              <button
                type="button"
                onClick={finish}
                className="arch-btn arch-btn-solid mt-14 px-10 py-4"
              >
                <span>
                  {shouldSeeWelcomeStory?.() ? 'Show me' : 'Go to dashboard'}
                </span>
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Onboarding
