import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, requiresProfileCompletion, signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        if (errorParam === 'domain_restriction') {
            setError('Authentication failed: Only NIT Silchar email addresses (.nits.ac.in) are allowed.');
        }

        if (user) {
            if (requiresProfileCompletion) {
                navigate('/complete-profile');
                return;
            }
            navigate('/');
        }
    }, [user, navigate, requiresProfileCompletion]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login flow
                const { data, error } = await signIn({ email, password });

                if (error) {
                    console.error('Login error:', error);
                    throw error;
                }

                navigate('/dashboard');

            } else {
                // Signup flow
                const emailLower = email.toLowerCase();
                const isNitsEmail = emailLower.endsWith('.nits.ac.in') || emailLower.endsWith('@nits.ac.in');
                if (!isNitsEmail) {
                    throw new Error('Only NIT Silchar email addresses (.nits.ac.in) are allowed to sign up.');
                }

                if (!fullName.trim() || !scholarId.trim()) {
                    throw new Error('Please fill in all fields');
                }

                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long');
                }

                // Use the updated signUp function that includes profile data
                const result = await signUp(email, password, fullName, scholarId);

                if (result.error) {
                    console.error('Signup error:', result.error);
                    throw result.error;
                }


                // Navigate to OTP verification
                navigate('/otp-verification', {
                    state: {
                        email,
                        message: 'Check your email for verification code!'
                    }
                });
            }
        } catch (error) {
            console.error('Auth process error:', error);
            setError(error.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            setError(error.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setScholarId('');
        setFullName('');
        setError('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
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
                            {isLogin ? 'Welcome\u00A0back.' : 'Join the\u00A0society.'}
                        </h1>
                        <p className="arch-lead mt-10 max-w-md">
                            {isLogin
                                ? 'Sign in to register for events, track your participation and collect your certificates.'
                                : 'Create an account to register for events, follow the programme and collect your certificates.'}
                        </p>
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
                        <p className="arch-label mb-4 lg:hidden">Computer Science Society</p>

                        <h2 className="arch-title text-[clamp(1.75rem,4vw,2.75rem)]">
                            {isLogin ? 'Sign in' : 'Create account'}
                        </h2>
                        <p className="arch-body mt-3">
                            {isLogin
                                ? 'Use your society account to continue.'
                                : 'It takes less than a minute.'}
                        </p>

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

                        <form onSubmit={handleSubmit} className="mt-10">
                            {!isLogin && (
                                <div className="mb-7">
                                    <label htmlFor="fullName" className="arch-label mb-3 block">
                                        Full name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        className="arch-input"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}

                            <div className="mb-7">
                                <label htmlFor="email" className="arch-label mb-3 block">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className="arch-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>

                            {!isLogin && (
                                <div className="mb-7">
                                    <label htmlFor="scholarId" className="arch-label mb-3 block">
                                        Scholar ID
                                    </label>
                                    <input
                                        id="scholarId"
                                        type="text"
                                        className="arch-input"
                                        value={scholarId}
                                        onChange={(e) => setScholarId(e.target.value)}
                                        required
                                        placeholder="Enter your scholar ID"
                                    />
                                </div>
                            )}

                            <div className="mb-9">
                                <label htmlFor="password" className="arch-label mb-3 block">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    className="arch-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    minLength={6}
                                />
                                {!isLogin && (
                                    <p className="mt-3 text-[13px] text-arch-ink-3">
                                        At least 6 characters.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="arch-btn arch-btn-solid w-full py-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
                                        <span>Processing</span>
                                    </>
                                ) : (
                                    <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <span className="h-px flex-grow bg-arch-line" />
                            <span className="arch-label">or</span>
                            <span className="h-px flex-grow bg-arch-line" />
                        </div>

                        <button
                            onClick={handleGoogleSignIn}
                            className="arch-btn w-full py-4"
                            disabled={loading}
                        >
                            <FcGoogle className="h-4 w-4" />
                            <span>Continue with Google</span>
                        </button>

                        <p className="mt-10 border-t border-arch-line pt-6 text-sm tracking-[-0.01em] text-arch-ink-3">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                onClick={toggleMode}
                                className="arch-link ml-2 font-medium text-arch-ink"
                                type="button"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Auth;