import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const OtpVerification = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { verifyOtp, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { email, message } = location.state || {};

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Redirect if user is already authenticated
    useEffect(() => {
        if (user && !authLoading) {
            console.log('User already authenticated, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Check if user got authenticated after OTP verification
    useEffect(() => {
        if (!loading && user) {
            console.log('User authenticated after OTP verification, redirecting...');
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email) {
            setError("Email not found. Please try signing up again.");
            setLoading(false);
            return;
        }

        if (!token || token.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            setLoading(false);
            return;
        }

        try {
            console.log('Verifying OTP for email:', email);

            // Verify OTP
            const result = await verifyOtp({
                email,
                token,
                type: 'email'
            });

            console.log('OTP verification successful:', result);

            // Force navigation after successful OTP
            console.log('Navigating to dashboard...');
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);
        } catch (error) {
            console.error('OTP verification failed:', error);
            setError(error.message || 'Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');

        try {
            // For resend, we use the signup type to resend confirmation
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            });

            if (resendError) throw resendError;

            setCountdown(60);
            setError('');
            alert('OTP has been resent to your email!');
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError(error.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleManualLoginRedirect = () => {
        navigate('/auth', {
            state: {
                message: 'If you have verified your email, please login with your credentials.'
            }
        });
    };

    // If auth is still loading, show loading screen
    if (authLoading) {
        return (
            <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto mb-4"></div>
                    <p className="text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-arch-bg px-6 py-24 text-arch-ink">
            <div className="w-full max-w-md">
                <p className="arch-label mb-6">Step two of two</p>

                <h1 className="arch-title text-[clamp(1.75rem,4vw,2.75rem)]">Verify your email</h1>
                <p className="arch-body mt-3">
                    {email
                        ? `We sent a six-digit code to ${email}.`
                        : 'Check your email for the six-digit verification code.'}
                </p>

                {message && (
                    <div className="mt-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4">
                        <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">{message}</p>
                    </div>
                )}

                {error && (
                    <div role="alert" className="mt-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4">
                        <p className="arch-label mb-1">Could not verify</p>
                        <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-10">
                    <label htmlFor="otp" className="arch-label mb-3 block">
                        Six-digit code
                    </label>
                    <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className="arch-input arch-num text-center text-[2rem] tracking-[0.42em]"
                        value={token}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setToken(value);
                        }}
                        required
                        maxLength={6}
                        placeholder="000000"
                        pattern="[0-9]{6}"
                    />

                    <button
                        type="submit"
                        className="arch-btn arch-btn-solid mt-9 w-full py-4"
                        disabled={loading || token.length !== 6}
                    >
                        {loading ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
                                <span>Verifying</span>
                            </>
                        ) : (
                            <span>Verify &amp; continue</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleResendOtp}
                        disabled={resendLoading || countdown > 0}
                        className="arch-btn w-full py-4"
                    >
                        <span>
                            {resendLoading
                                ? 'Sending'
                                : countdown > 0
                                    ? `Resend code in ${countdown}s`
                                    : 'Resend code'}
                        </span>
                    </button>

                    <button
                        onClick={handleManualLoginRedirect}
                        className="arch-btn arch-btn-ghost w-full py-4"
                    >
                        <span>Already verified? Sign in</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;