/* ------------------------------------------------------------------
   Institute mail — the single source of truth for who may hold an
   account.

   Every NIT Silchar student address takes the shape

       name_ug_year@branch.nits.ac.in
       e.g. amborish_ug_23@cse.nits.ac.in

   so the address alone tells us the branch and the admission batch.
   Nothing here talks to the network: it is pure parsing, which means
   it can be unit-tested and reused by the router, the auth context
   and the onboarding form without any of them duplicating a regex.

   NOTE ON TRUST: this is a convenience gate, not authorisation. A
   determined client can call Supabase directly, so the same
   constraint has to exist in Postgres — see SECURITY.md for the RLS
   policy that enforces it server-side.
------------------------------------------------------------------ */

/** Branch codes that appear in the mail subdomain. */
export const BRANCH_CODES = ['cse', 'ece', 'ei', 'ee', 'me', 'ce']

/** Programme segments accepted in the middle of the local part.
 *  Widen this list if postgraduate accounts are ever admitted. */
export const PROGRAMMES = ['ug']

export const BRANCH_NAMES = {
  cse: 'Computer Science & Engineering',
  ece: 'Electronics & Communication Engineering',
  ei: 'Electronics & Instrumentation Engineering',
  ee: 'Electrical Engineering',
  me: 'Mechanical Engineering',
  ce: 'Civil Engineering',
}

const PATTERN = new RegExp(
  `^([a-z][a-z0-9._-]*)_(${PROGRAMMES.join('|')})_(\\d{2})@(${BRANCH_CODES.join(
    '|'
  )})\\.nits\\.ac\\.in$`
)

/**
 * The two-digit code of the batch that is currently in its first year.
 * The academic session opens in July, so anything before July still
 * belongs to the previous intake.
 */
export function currentAdmissionYearCode(now = new Date()) {
  const batch = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
  return String(batch % 100).padStart(2, '0')
}

const EMPTY = Object.freeze({
  valid: false,
  email: '',
  name: '',
  programme: '',
  yearCode: '',
  branch: '',
  branchName: '',
  admissionYear: null,
  isFirstYear: false,
  isCse: false,
})

/**
 * Parse an institute address. Always returns an object, so callers can
 * read `.valid` without a null check.
 */
export function parseInstituteEmail(email, now = new Date()) {
  if (typeof email !== 'string') return EMPTY

  const normalised = email.trim().toLowerCase()
  const match = PATTERN.exec(normalised)
  if (!match) return { ...EMPTY, email: normalised }

  const [, name, programme, yearCode, branch] = match
  const admissionYear = 2000 + Number(yearCode)

  return {
    valid: true,
    email: normalised,
    name,
    programme,
    yearCode,
    branch,
    branchName: BRANCH_NAMES[branch] || branch.toUpperCase(),
    admissionYear,
    isFirstYear: yearCode === currentAdmissionYearCode(now),
    isCse: branch === 'cse',
  }
}

/** Convenience predicate — the gate the router and context both use. */
export function isInstituteEmail(email, now = new Date()) {
  return parseInstituteEmail(email, now).valid
}

/**
 * The welcome story is for the incoming Computer Science batch only:
 * a first-year whose mail sits on the cse subdomain.
 */
export function qualifiesForWelcomeStory(email, now = new Date()) {
  const parsed = parseInstituteEmail(email, now)
  return parsed.valid && parsed.isCse && parsed.isFirstYear
}

/** Human-readable rejection copy, so every screen says the same thing. */
export const INSTITUTE_EMAIL_HINT =
  'Use your institute address — name_ug_year@branch.nits.ac.in (cse, ece, ei, ee, me or ce).'

/** Turn an admission year into the year of study, capped at 4. */
export function yearOfStudy(admissionYear, now = new Date()) {
  if (!admissionYear) return null
  const session = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
  return Math.min(4, Math.max(1, session - admissionYear + 1))
}
