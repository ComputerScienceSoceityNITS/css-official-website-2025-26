import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
    BRANCH_CODES,
    INSTITUTE_EMAIL_HINT,
} from '../utils/instituteEmail';

/* One way in: the institute Google account. There is no password form
   any more — the address itself is the credential we care about, and
   Google is what proves the person holds it. */

const Auth = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {
        user,
        requiresOnboarding,
        authRejection,
        clearAuthRejection,
        signInWithGoogle,
    } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    /* Remember where the visitor was headed so the callback can put them
       back there once they are through onboarding. */
    useEffect(() => {
        const from = location.state?.from;
        if (from) {
            try {
                sessionStorage.setItem('auth_redirect', from);
            } catch {
                /* private mode — the default landing is fine */
            }
        }
    }, [location.state]);

    useEffect(() => {
        if (user) {
            navigate(requiresOnboarding ? '/onboarding' : '/dashboard', {
                replace: true,
            });
        }
    }, [user, requiresOnboarding, navigate]);

    /* A rejected address is not an error the visitor caused by mistyping —
       it is a policy answer, so it gets its own copy. */
    const rejected = authRejection?.reason === 'not-institute';

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        clearAuthRejection?.();
        try {
            const { error: oauthError } = await signInWithGoogle();
            if (oauthError) throw oauthError;
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-arch-bg text-arch-ink">
            <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 px-6 md:px-10 lg:grid-cols-12">
                {/* Statement column — the account panel needs a page around
                    it, not a card floating in the middle of the viewport. */}
                <aside className="hidden border-r border-arch-line py-24 pr-12 lg:col-span-6 lg:flex lg:flex-col lg:justify-between xl:col-span-7">
                    <div>
                        <p className="arch-label mb-10">Computer Science Society</p>
                        <h1 className="arch-display text-[clamp(2.5rem,5.5vw,5.5rem)]">
                            Members&nbsp;only.
                        </h1>
                        <p className="arch-lead mt-10 max-w-md">
                            The society runs on your institute identity. Sign in with
                            the NIT Silchar Google account you already use for class,
                            and everything else follows from it.
                        </p>

                        <dl className="mt-14 max-w-md border-t border-arch-line">
                            {[
                                ['Identity', 'Institute Google account'],
                                ['Address', 'name_ug_year@branch.nits.ac.in'],
                                ['Branches', BRANCH_CODES.join(' · ')],
                            ].map(([term, value]) => (
                                <div
                                    key={term}
                                    className="flex items-baseline justify-between gap-6 border-b border-arch-line py-4"
                                >
                                    <dt className="arch-label">{term}</dt>
                                    <dd className="text-right text-sm tracking-[-0.01em] text-arch-ink">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="mt-16 flex items-center gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-black">
                            <img
                                src="/images/css-logo-mark.png"
                                alt=""
                                className="h-full w-full object-contain invert"
                            />
                        </span>
                        <p className="arch-body text-[13px]">
                            National Institute of Technology, Silchar
                        </p>
                    </div>
                </aside>

                {/* Account panel */}
                <main className="flex items-center py-24 lg:col-span-6 lg:pl-12 xl:col-span-5">
                    <div className="w-full max-w-md">
                        <p className="arch-label mb-4 lg:hidden">
                            Computer Science Society
                        </p>

                        <h2 className="arch-title text-[clamp(1.75rem,4vw,2.75rem)]">
                            Sign in
                        </h2>
                        <p className="arch-body mt-3">
                            Continue with your institute Google account.
                        </p>

                        {rejected && (
                            <div
                                role="alert"
                                className="mt-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4"
                            >
                                <p className="arch-label mb-1">Not an institute account</p>
                                <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">
                                    {authRejection.email
                                        ? `${authRejection.email} is not a NIT Silchar student address.`
                                        : 'That account is not a NIT Silchar student address.'}{' '}
                                    {INSTITUTE_EMAIL_HINT}
                                </p>
                            </div>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="mt-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4"
                            >
                                <p className="arch-label mb-1">Could not continue</p>
                                <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleGoogleSignIn}
                            className="arch-btn arch-btn-solid mt-10 w-full py-4"
                            disabled={loading}
                            type="button"
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
                                    <span>Opening Google</span>
                                </>
                            ) : (
                                <>
                                    <span className="flex h-4 w-4 items-center justify-center bg-white">
                                        <FcGoogle className="h-4 w-4" />
                                    </span>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        <p className="mt-6 text-[13px] leading-relaxed text-arch-ink-3">
                            {INSTITUTE_EMAIL_HINT}
                        </p>

                        <div className="mt-10 border-t border-arch-line pt-6">
                            <p className="arch-label mb-3">First time here?</p>
                            <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink-3">
                                There is nothing to sign up for. Sign in once and we
                                will walk you through a short introduction — including
                                members carried over from the previous website.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Auth;
