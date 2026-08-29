
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const EmailMigration = () => {
    const { user, signInWithGoogleForMigration } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    
    const errorFromState = location.state?.error;

    const handleGoogleMigration = async () => {
        setGoogleLoading(true);
        setMessage('');

        try {
            const { error } = await signInWithGoogleForMigration();
            
            if (error) {
                throw error;
            }
            
        } catch (error) {
            setGoogleLoading(false);
            
            
            if (error.message.includes('rate limit')) {
                setMessage('⚠️ Too many attempts. Please wait 1 hour or use a different method.');
            } else {
                setMessage('Google sign-in failed: ' + error.message);
            }
        }
    };

    const handleSkip = () => {
        localStorage.setItem('skippedCollegeMigration', 'true');
        navigate('/dashboard');
    };

    const handleEmailVerification = async () => {
        setMessage('📧 For email verification, please sign out and sign up directly with your college email address.');
    };

    return (
        <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-arch-bg-alt p-8 border border-arch-line">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-arch-ink mb-2">
                        Verify College Email
                    </h1>
                    <p className="text-arch-ink-3">
                        To access chat features, please verify your college identity using your college email.
                    </p>
                </div>

                <div className="bg-arch-card p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-arch-ink-3">Current Email:</span>
                        <span className="font-medium text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-arch-ink-3">Status:</span>
                        <span className="px-2 py-1 text-sm bg-arch-ink text-arch-bg">
                            Needs Verification
                        </span>
                    </div>
                </div>

                
                <div className="mb-4">
                    <button 
                        onClick={handleGoogleMigration}
                        disabled={googleLoading}
                        className="w-full bg-arch-card hover:bg-arch-bg-alt text-arch-ink p-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-arch-line"
                    >
                        {googleLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-arch-line"></div>
                        ) : (
                            <FcGoogle className="w-5 h-5" />
                        )}
                        {googleLoading ? 'Connecting...' : 'Verify with College Google Account'}
                    </button>
                    <p className="text-xs text-arch-ink mt-2 text-center">
                        ✅ Recommended & Secure - Uses your college email account
                    </p>
                </div>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-arch-line"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-arch-bg-alt text-arch-ink-3">OR</span>
                    </div>
                </div>

                <div className="mb-4">
                    <button 
                        onClick={handleEmailVerification}
                        className="w-full bg-arch-ink hover:bg-arch-ink text-arch-bg p-3 font-medium transition-all flex items-center justify-center gap-3 hover:text-arch-bg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Sign Up with College Email
                    </button>
                    <p className="text-xs text-arch-ink mt-2 text-center">
                        ⚠️ You'll need to create a new account with your college email
                    </p>
                </div>

               
                <button
                    onClick={handleSkip}
                    className="w-full bg-arch-bg-alt hover:bg-arch-bg-alt text-arch-ink py-2 px-4 mt-2"
                >
                    Skip for Now
                </button>

                
                <div className="mt-6 p-4 bg-arch-ink border border-arch-ink">
                    <h3 className="text-sm font-medium text-arch-ink mb-2">How to verify:</h3>
                    <ul className="text-xs text-arch-ink space-y-1">
                        <li>• Use your <strong>college email account</strong> (nibir@cse.nits.ac.in, etc.)</li>
                        <li>• Or create a new account with your college email</li>
                        <li>• College emails are automatically verified</li>
                    </ul>
                </div>

                
                {errorFromState && (
                    <div className="mt-4 p-3 text-center bg-arch-ink text-arch-bg">
                        {errorFromState}
                    </div>
                )}

                {message && (
                    <div className={`mt-4 p-3 text-center   ${
                        message.includes('Failed') || message.includes('rate limit') ? 'bg-arch-ink text-arch-bg' : 
                        message.includes('⚠️') ? 'bg-arch-ink text-arch-bg' : 'bg-arch-ink text-arch-bg'
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-arch-faint">
                        Accepted domains: nits.ac.in, cse.nits.ac.in, ece.nits.ac.in, etc.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailMigration;