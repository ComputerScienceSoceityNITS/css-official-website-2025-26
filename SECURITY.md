# Security notes

No site can be made unhackable. What follows is the real state of this one:
what was fixed in the code, and what only a maintainer with access to GitHub
and the Supabase dashboard can fix.

---

## 1. CRITICAL — a secret is in public git history

`.env` was committed in `493133f` and removed later in `bc1ac9b`. **Removing a
file in a later commit does not remove it from history.** This repository's
remote is public:

```
https://github.com/ComputerScienceSoceityNITS/css-official-website-2025-26
```

Anyone can still read the old value with:

```
git show 493133f:.env
```

The file contained `db_password`, plus the Supabase URL, anon key and callback
URL. Automated scanners crawl public GitHub for exactly this.

### What to do, in order

1. **Rotate the database password now.** Supabase → Project Settings →
   Database → Reset database password. Do this before anything else; assume the
   old one is compromised.
2. **Rotate the Supabase API keys.** Settings → API → roll the keys, then
   update the deploy environment. (The *anon* key is designed to be public and
   is safe on its own — but only if RLS is correct. See §2.)
3. **Purge the file from history**, then force-push and have every collaborator
   re-clone:
   ```
   # git-filter-repo is the supported tool (pip install git-filter-repo)
   git filter-repo --path .env --invert-paths
   git push --force --all && git push --force --tags
   ```
   Rotating is what actually protects you; purging just stops it being handed
   to the next person who clones.
4. Check the Supabase logs for unfamiliar connections since the commit date.

`db_password` has been removed from the local `.env` — no code ever read it. A
database password does not belong in a frontend repo at all.

---

## 2. HIGH — the admin check is UI-only

`AdminRoute` and `AdminContext` read `profiles.is_admin` **in the browser**.
That controls what renders; it controls nothing on the server. Anyone can open
devtools and call Supabase directly with their own session token.

So **every** rule that matters has to live in Row Level Security. Notably,
`AuthContext.signUp` does a client-side `upsert` into `profiles` including
`college_email_verified` — meaning a user can attempt to write their own
verification status, and `is_admin` too, unless the database forbids it.

Run this in the Supabase SQL editor and adapt table/column names to your schema:

```sql
-- Nobody can self-promote: strip blanket UPDATE, then grant back only the
-- columns a user legitimately owns. is_admin and college_email_verified are
-- deliberately absent.
revoke update on public.profiles from authenticated, anon;
grant  update (full_name, scholar_id, contact_number, avatar_url)
       on public.profiles to authenticated;

alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Events: readable by anyone, writable only by admins.
alter table public.events enable row level security;

create policy "events are public"
  on public.events for select using (true);

create policy "only admins write events"
  on public.events for all
  using (
    exists (select 1 from public.profiles p
            where p.user_id = auth.uid() and p.is_admin)
  )
  with check (
    exists (select 1 from public.profiles p
            where p.user_id = auth.uid() and p.is_admin)
  );

-- Registrations belong to the user who made them.
alter table public.user_events enable row level security;

create policy "read own registrations"
  on public.user_events for select using (auth.uid() = user_id);

create policy "create own registrations"
  on public.user_events for insert with check (auth.uid() = user_id);
```

Verify by signing in as an ordinary user and attempting, from the browser
console, to set `is_admin` on your own row. It must fail.

Note the CSE-only event gate in `Events.jsx` is also client-side — it reads
`is_cse_only` and compares the email in the browser. Enforce that in an RLS
policy or a database function too, or it is decorative.

---

## 3. MEDIUM — certificates are self-issued

`Certificates.jsx` renders the PDF in the browser from a **user-editable name
field**, and `certificateService` checks `attendance_status` client-side. Anyone
can put any name on a certificate, and anyone who can reach the row can bypass
the eligibility check.

If certificates are meant to prove anything, they need to be generated
server-side and carry something verifiable — a signed ID or QR pointing at a
lookup endpoint that confirms the certificate was actually issued.

---

## 4. Fixed in this pass

- **Security headers** (`vercel.json`): Content-Security-Policy, HSTS,
  `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy,
  COOP. The CSP allowlists exactly the image/font/connect origins this site
  uses. **Watch the browser console after deploying** — if something was
  missed, the CSP will block it and say so.
- **Dialogflow proxy CORS**: `api/dialogflow.js` and `server.js` sent
  `Access-Control-Allow-Origin: *` on an endpoint backed by a Google service
  account — an open invitation to spend the society's quota. Both now use the
  allowlist in `api/_guard.js` (extend it via the `ALLOWED_ORIGINS` env var for
  deploy previews).
- **Input validation**: `message` and `sessionId` are type-checked, length-
  capped, and the session id is restricted to `[A-Za-z0-9_-]`, so an object
  cannot be smuggled into the Dialogflow payload.
- **Rate limiting**: 20 requests/minute per IP. It is in-memory, so on
  serverless it only limits within a warm instance — a speed bump, not a wall.
  Put Vercel WAF, Cloudflare or Upstash in front for anything real.
- **Body size cap** of 32kb, and `x-powered-by` disabled.
- `.env.example` added, documenting that `VITE_`-prefixed variables are
  **public** — they are compiled into the browser bundle. Never put a secret
  behind that prefix.

## 5. Checked and clean

- No `dangerouslySetInnerHTML` anywhere. The three `innerHTML` writes are
  static emoji, not user input.
- No hardcoded API keys or tokens in tracked source.
- The Google service-account JSON is gitignored and was never committed.
- `json/niha.json`, also in history, is harmless test data.

## 6. Worth doing next

- Enable Supabase leaked-password protection and email rate limits (Auth →
  Providers).
- Turn on GitHub secret scanning and Dependabot for this repo.
- Run `npm audit` and update anything with a known advisory.
- Consider removing `'unsafe-inline'` from `script-src` once you confirm no
  inline script is needed; it is the weakest part of the CSP.

---

## 7. Institute-only accounts (added with the Google-only sign-in)

Sign-in is now Google-only, and the only identity accepted is a NIT Silchar
student address of the shape `name_ug_year@branch.nits.ac.in`, where branch
is one of `cse, ece, ei, ee, me, ce`. The rule lives in
`src/utils/instituteEmail.js` and is enforced in `AuthContext` on every
session — restored, refreshed or fresh — not only in the OAuth callback.

**That is still a client-side gate.** A determined client can call the
Supabase REST endpoint directly with any valid JWT. The same constraint has
to exist in Postgres, or it is decoration:

```sql
-- The pattern, as a reusable predicate.
create or replace function public.is_institute_email(addr text)
returns boolean
language sql
immutable
as $$
  select addr ~ '^[a-z][a-z0-9._-]*_ug_[0-9]{2}@(cse|ece|ei|ee|me|ce)\.nits\.ac\.in$'
$$;

-- Only institute addresses may hold a profile row.
alter table public.profiles
  add constraint profiles_institute_email
  check (public.is_institute_email(lower(email)));

-- And only for the row that belongs to the caller.
drop policy if exists "profiles are self-service" on public.profiles;
create policy "profiles are self-service"
  on public.profiles
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and public.is_institute_email(lower(auth.jwt() ->> 'email'))
  );
```

Restrict the Google provider in the Supabase dashboard as well
(Authentication → Providers → Google), and keep the column-level grants from
section 3 — a user must not be able to write `onboarded` on someone else's
row.

### Columns the onboarding flow expects

The client degrades gracefully if these are missing (it retries the write
without them and falls back to profile completeness), but the flow is only
correct once they exist:

```sql
alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists onboarded_at timestamptz,
  add column if not exists branch text,
  add column if not exists admission_year integer,
  add column if not exists welcome_story_seen boolean not null default false;

-- Members carried over from the previous website have a row but have never
-- been through this site's intake. Leaving `onboarded` false is deliberate:
-- they are walked through /onboarding once, with their existing details
-- prefilled, and it is a confirmation rather than a form.

-- Let a signed-in user write only their own onboarding fields.
grant update (
  full_name, scholar_id, contact_number, avatar_url,
  branch, admission_year, onboarded, onboarded_at, welcome_story_seen
) on public.profiles to authenticated;
```

### The welcome story

`/welcome` is shown once, straight after onboarding, to first-year students
whose address is on the `cse` subdomain. "First year" is derived from the
current session rather than hardcoded — `currentAdmissionYearCode()` treats
July as the start of the academic year, so in the 2026–27 session the `_26_`
batch qualifies and the check keeps working in later years without an edit.

### Standing exceptions

`VITE_AUTH_EMAIL_ALLOWLIST` (comma-separated) lets specific addresses through
the pattern check — intended for the society's own admin accounts, which may
not sit on a student subdomain. It is empty by default, so the policy is
closed unless someone opts an address in. Because it is `VITE_`-prefixed it
is **public**: it is a convenience for the UI, and the SQL above is what
actually decides.
