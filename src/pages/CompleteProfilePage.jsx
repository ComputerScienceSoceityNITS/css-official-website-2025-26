import React, { useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const { user, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        if (!fullName.trim() || !scholarId.trim() || !contactNumber.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }


        const cleanPhoneNumber = contactNumber.replace(/\D/g, '');
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(cleanPhoneNumber)) {
            setError('Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9');
            setLoading(false);
            return;
        }

        try {
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName.trim(),
                    scholar_id: scholarId.trim(),
                    contact_number: cleanPhoneNumber,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .select();

            if (updateError) throw updateError;


            await refreshProfile();

            const emailLower = (user?.email || '').toLowerCase();
            const isNewBatch = emailLower.includes('ug') && emailLower.includes('26') && emailLower.includes('cse');
            if (isNewBatch) {
                navigate('/welcome-story');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Profile completion error:', error);
            setError(error.message || 'Failed to complete profile');
        }
        setLoading(false);
    };

    const handlePhoneChange = (e) => {

        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
        setContactNumber(digitsOnly);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-arch-bg px-6 py-24 text-arch-ink">
            <div className="w-full max-w-md">
                <p className="arch-label mb-6">One more step</p>

                <h1 className="arch-title text-[clamp(1.75rem,4vw,2.75rem)]">Complete your profile</h1>
                <p className="arch-body mt-3">
                    We need a few details before you can register for events.
                </p>

                {error && (
                    <div role="alert" className="mt-8 border-l-2 border-arch-ink bg-arch-card px-5 py-4">
                        <p className="arch-label mb-1">Could not save</p>
                        <p className="text-sm leading-relaxed tracking-[-0.01em] text-arch-ink">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-10">
                    <div className="mb-7">
                        <label htmlFor="fullName" className="arch-label mb-3 block">Full name</label>
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

                    <div className="mb-7">
                        <label htmlFor="scholarId" className="arch-label mb-3 block">Scholar ID</label>
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

                    <div className="mb-9">
                        <label htmlFor="contact" className="arch-label mb-3 block">Contact number</label>
                        <div className="flex items-baseline gap-3 border-b border-arch-line focus-within:border-arch-ink">
                            <span className="shrink-0 text-[15px] text-arch-ink-3">+91</span>
                            <input
                                id="contact"
                                type="tel"
                                className="arch-input border-b-0 focus:border-b-0"
                                value={contactNumber}
                                onChange={handlePhoneChange}
                                required
                                placeholder="88228 xxxxx"
                                maxLength="10"
                            />
                        </div>
                        <p className="mt-3 text-[13px] text-arch-ink-3">
                            Ten digits, starting with 6, 7, 8 or 9.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="arch-btn arch-btn-solid w-full py-4"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
                                <span>Saving</span>
                            </>
                        ) : (
                            <span>Save and continue</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;