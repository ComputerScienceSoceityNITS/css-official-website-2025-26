import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useArchReveal } from '../hooks/useArchAnim.js';

// Toast Component - ARCH Theme
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-6 right-6 left-6 sm:left-auto z-50 px-5 py-4 bg-arch-ink text-arch-bg border border-arch-line shadow-2xl flex items-center justify-between gap-4 max-w-md animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {type === 'success' ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div>
                    <p className="arch-label text-[9px] text-arch-faint uppercase">{type === 'success' ? 'SUCCESS' : 'NOTICE'}</p>
                    <p className="text-sm font-medium text-arch-bg">{message}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-arch-muted hover:text-arch-bg transition-colors p-1"
                aria-label="Close notification"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

// Helper to check if email belongs to CSE student
const isCseEmail = (email) => {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower.includes('cse') || lower.endsWith('@cse.nits.ac.in');
};

// Form Components - ARCH Theme
const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
    <div className="mb-5">
        <label htmlFor={id} className="arch-label block mb-2 text-arch-muted">
            {label} {required && <span className="text-arch-ink">*</span>}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full p-3.5 bg-arch-bg-alt border border-arch-line text-arch-ink placeholder:text-arch-faint focus:outline-none focus:border-arch-ink transition-colors text-sm font-sans disabled:opacity-60 disabled:cursor-not-allowed"
        />
    </div>
);

const FormTextarea = ({ id, label, value, onChange, placeholder, required = false, rows = 4 }) => (
    <div className="mb-5">
        <label htmlFor={id} className="arch-label block mb-2 text-arch-muted">
            {label} {required && <span className="text-arch-ink">*</span>}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="w-full p-3.5 bg-arch-bg-alt border border-arch-line text-arch-ink placeholder:text-arch-faint focus:outline-none focus:border-arch-ink transition-colors text-sm font-sans resize-y"
        />
    </div>
);

const SubmitButton = ({ text, loading = false, disabled = false }) => (
    <button
        type="submit"
        disabled={loading || disabled}
        className="arch-btn arch-btn-solid w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
    >
        {loading ? (
            <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-arch-bg border-t-transparent"></div>
                <span>Registering...</span>
            </div>
        ) : (
            <span>{text}</span>
        )}
    </button>
);

// Event Forms
const RampwalkForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth(); 
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [hasPartner, setHasPartner] = useState(false);
    const [partnerName, setPartnerName] = useState('');
    const [partnerScholarId, setPartnerScholarId] = useState('');
    const [partnerContact, setPartnerContact] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;

        if (!isCseEmail(user?.email)) {
            showToast('Registration is restricted to CSE students (@cse.nits.ac.in).', 'error');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId,
                has_partner: hasPartner,
                ...(hasPartner && {
                    partner_name: partnerName,
                    partner_scholar_id: partnerScholarId,
                    partner_contact: partnerContact
                })
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'rampwalk',
                        event_name: 'Rampwalk',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Rampwalk!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-8 px-4 bg-arch-bg-alt border border-arch-line">
                <div className="w-12 h-12 bg-arch-ink text-arch-bg flex items-center justify-center mx-auto mb-4 font-bold text-xl">✓</div>
                <h2 className="arch-title text-xl mb-2 text-arch-ink">Already Registered!</h2>
                <p className="arch-body text-arch-muted mb-4 text-sm max-w-md mx-auto">
                    You have successfully registered for Rampwalk.
                </p>
                <p className="arch-label text-arch-ink text-xs">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-arch-line pb-4 mb-6">
                <p className="arch-label text-arch-muted text-[10px] uppercase tracking-widest mb-1">// REGISTRATION FORM</p>
                <h2 className="arch-title text-2xl text-arch-ink">Register for Rampwalk</h2>
            </div>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />

            <div className="mb-5 pt-2">
                <label className="flex items-center cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={hasPartner}
                        onChange={(e) => setHasPartner(e.target.checked)}
                        className="mr-3 w-4 h-4 accent-arch-ink border-arch-line rounded-none"
                    />
                    <span className="arch-body text-arch-ink text-sm">I have a partner</span>
                </label>
            </div>

            {hasPartner && (
                <div className="space-y-4 pl-4 sm:pl-6 border-l-2 border-arch-ink my-6 py-2 bg-arch-bg-alt/50 p-4">
                    <p className="arch-label text-arch-muted text-[10px] uppercase tracking-widest mb-2">// PARTNER DETAILS</p>
                    <FormInput
                        id="partnerName"
                        label="Partner's Name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Enter partner's full name"
                        required
                    />
                    
                    <FormInput
                        id="partnerScholarId"
                        label="Partner's Scholar ID"
                        value={partnerScholarId}
                        onChange={(e) => setPartnerScholarId(e.target.value)}
                        placeholder="Enter partner's scholar ID"
                        required
                    />
                    
                    <FormInput
                        id="partnerContact"
                        label="Partner's Contact Number"
                        type="tel"
                        value={partnerContact}
                        onChange={(e) => setPartnerContact(e.target.value)}
                        placeholder="Enter partner's contact number"
                        required
                    />
                </div>
            )}
            
            <SubmitButton text="Register for Rampwalk" loading={loading} />
        </form>
    );
};

const RizzShowForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth();
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;

        if (!isCseEmail(user?.email)) {
            showToast('Registration is restricted to CSE students (@cse.nits.ac.in).', 'error');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'rizz-show',
                        event_name: 'Rizz Show',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Rizz Show!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-8 px-4 bg-arch-bg-alt border border-arch-line">
                <div className="w-12 h-12 bg-arch-ink text-arch-bg flex items-center justify-center mx-auto mb-4 font-bold text-xl">✓</div>
                <h2 className="arch-title text-xl mb-2 text-arch-ink">Already Registered!</h2>
                <p className="arch-body text-arch-muted mb-4 text-sm max-w-md mx-auto">
                    You have successfully registered for Rizz Show.
                </p>
                <p className="arch-label text-arch-ink text-xs">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-arch-line pb-4 mb-6">
                <p className="arch-label text-arch-muted text-[10px] uppercase tracking-widest mb-1">// REGISTRATION FORM</p>
                <h2 className="arch-title text-2xl text-arch-ink">Register for Rizz Show</h2>
            </div>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />
            
            <SubmitButton text="Register for Rizz Show" loading={loading} />
        </form>
    );
};

const CulturalForm = ({ onRegistrationSuccess, isAlreadyRegistered, showToast }) => {
    const { user, profile: authProfile } = useAuth();
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [scholarId, setScholarId] = useState('');
    const [performanceType, setPerformanceType] = useState('solo');
    const [otherPerformanceType, setOtherPerformanceType] = useState('');
    const [groupMembers, setGroupMembers] = useState('');
    const [loading, setLoading] = useState(false);

    // Prefill user data if available
    useEffect(() => {
        if (authProfile?.full_name) setName(authProfile.full_name);
        if (authProfile?.scholar_id) setScholarId(authProfile.scholar_id);
    }, [authProfile]);

    // Reset other performance type when performance type changes
    useEffect(() => {
        if (performanceType !== 'other') {
            setOtherPerformanceType('');
        }
    }, [performanceType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isAlreadyRegistered) return;

        if (!isCseEmail(user?.email)) {
            showToast('Registration is restricted to CSE students (@cse.nits.ac.in).', 'error');
            return;
        }
        
        // Validate other performance type if selected
        if (performanceType === 'other' && !otherPerformanceType.trim()) {
            showToast('Please specify your performance type', 'error');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = {
                name,
                email: user?.email || '',
                contact_number: contactNumber,
                scholar_id: scholarId,
                performance_type: performanceType === 'other' ? otherPerformanceType : performanceType,
                original_performance_type: performanceType, // Keep the original selection
                ...(performanceType === 'other' && {
                    other_performance_type: otherPerformanceType
                }),
                ...(performanceType === 'group' && {
                    group_members: groupMembers
                })
            };

            const { data, error } = await supabase
                .from('event_registrations')
                .insert([
                    {
                        user_id: user.id,
                        event_slug: 'cultural',
                        event_name: 'Cultural Event',
                        form_data: formData,
                        registered_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            onRegistrationSuccess();
            showToast('Successfully registered for Cultural Event!', 'success');
            
        } catch (error) {
            console.error('Error submitting registration:', error);
            showToast('Error submitting registration. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyRegistered) {
        return (
            <div className="text-center py-8 px-4 bg-arch-bg-alt border border-arch-line">
                <div className="w-12 h-12 bg-arch-ink text-arch-bg flex items-center justify-center mx-auto mb-4 font-bold text-xl">✓</div>
                <h2 className="arch-title text-xl mb-2 text-arch-ink">Already Registered!</h2>
                <p className="arch-body text-arch-muted mb-4 text-sm max-w-md mx-auto">
                    You have successfully registered for Cultural Event.
                </p>
                <p className="arch-label text-arch-ink text-xs">
                    You can now join the WhatsApp group using the button below.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-arch-line pb-4 mb-6">
                <p className="arch-label text-arch-muted text-[10px] uppercase tracking-widest mb-1">// REGISTRATION FORM</p>
                <h2 className="arch-title text-2xl text-arch-ink">Register for Cultural Event</h2>
            </div>
            
            <FormInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
            />
            
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            
            <FormInput
                id="contactNumber"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
            />
            
            <FormInput
                id="scholarId"
                label="Scholar ID"
                value={scholarId}
                onChange={(e) => setScholarId(e.target.value)}
                placeholder="Enter your scholar ID"
                required
            />

            <div className="mb-5">
                <label htmlFor="performanceType" className="arch-label block mb-2 text-arch-muted">
                    Performance Type <span className="text-arch-ink">*</span>
                </label>
                <select
                    id="performanceType"
                    value={performanceType}
                    onChange={(e) => setPerformanceType(e.target.value)}
                    required
                    className="w-full p-3.5 bg-arch-bg-alt border border-arch-line text-arch-ink focus:outline-none focus:border-arch-ink transition-colors text-sm font-sans"
                >
                    <option value="solo">Solo Performance</option>
                    <option value="group">Group Performance</option>
                    <option value="dance">Dance</option>
                    <option value="song">Song</option>
                    <option value="other">Other (Please specify)</option>
                </select>
            </div>

            {/* Other Performance Type Input - Only show when "Other" is selected */}
            {performanceType === 'other' && (
                <FormInput
                    id="otherPerformanceType"
                    label="Specify Your Performance Type"
                    value={otherPerformanceType}
                    onChange={(e) => setOtherPerformanceType(e.target.value)}
                    placeholder="e.g., Drama, Poetry, Instrumental, etc."
                    required
                />
            )}

            {performanceType === 'group' && (
                <FormTextarea
                    id="groupMembers"
                    label="Group Members Names (comma separated)"
                    value={groupMembers}
                    onChange={(e) => setGroupMembers(e.target.value)}
                    placeholder="Enter names of all group members separated by commas"
                    required
                />
            )}
            
            <SubmitButton text="Register for Cultural Event" loading={loading} />
        </form>
    );
};

// Main EventsRegistration Component
const EventsRegistration = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('rampwalk');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState({
        rampwalk: false,
        'rizz-show': false,
        cultural: false
    });
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [toast, setToast] = useState(null);

    const archScope = useRef(null);
    useArchReveal(archScope, [loadingStatus, activeTab]);

    // Hardcoded events data
    const events = {
        rampwalk: {
            name: 'Rampwalk',
            slug: 'rampwalk',
            whatsapp_group_link: 'https://chat.whatsapp.com/F3YCuEjZb0oHnJirIPc3S3?mode=wwt'
        },
        rizzShow: {
            name: 'Rizz Show',
            slug: 'rizz-show', 
            whatsapp_group_link: 'https://chat.whatsapp.com/BUTPCVs5pg5IKDr35bz7Ll?mode=wwt'
        },
        cultural: {
            name: 'Cultural Event',
            slug: 'cultural',
            whatsapp_group_link: 'https://chat.whatsapp.com/HYjp4oJt66FKEjcbs0j6sV?mode=wwt'
        }
    };

    const tabs = [
        { id: 'rampwalk', name: 'Rampwalk' },
        { id: 'rizzShow', name: 'Rizz Show' },
        { id: 'cultural', name: 'Cultural' },
    ];

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (loading) return;
        if (!user) {
            try {
                sessionStorage.setItem('auth_redirect', location.pathname + location.search);
            } catch (e) {}
            navigate('/auth', { state: { from: location.pathname + location.search } });
            return;
        }
        checkAdminStatus();
        checkRegistrationStatus();
    }, [user, loading, navigate, location]);

    const checkAdminStatus = async () => {
        if (!user) return;
        
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            const adminStatus = 
                profile?.role === 'admin' || 
                profile?.is_admin === true ||
                profile?.admin === true ||
                (profile?.email && profile.email.includes('admin')) ||
                (user?.email && user.email.includes('admin'));

            setIsAdmin(adminStatus);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    };

    const checkRegistrationStatus = async () => {
        if (!user) return;
        
        try {
            const { data: registrations, error } = await supabase
                .from('event_registrations')
                .select('event_slug')
                .eq('user_id', user.id);

            if (error) throw error;

            const status = {
                rampwalk: false,
                'rizz-show': false,
                cultural: false
            };

            if (registrations) {
                registrations.forEach(reg => {
                    status[reg.event_slug] = true;
                });
            }

            setRegistrationStatus(status);
        } catch (error) {
            console.error('Error checking registration status:', error);
            showToast('Error loading registration status', 'error');
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleRegistrationSuccess = () => {
        setRegistrationStatus(prev => ({
            ...prev,
            [events[activeTab].slug]: true
        }));
    };

    const exportToCSV = async (eventSlug) => {
    if (!isAdmin) return;

    try {
        const { data: registrations, error } = await supabase
            .from('event_registrations')
            .select('*')
            .eq('event_slug', eventSlug);

        if (error) {
            throw error;
        }

        if (!registrations || registrations.length === 0) {
            showToast('No registrations found for this event.', 'error');
            return;
        }

        // Field mapping for human-readable column names
        const fieldMappings = {
            // Common fields
            name: 'Full Name',
            email: 'Email',
            contact_number: 'Contact Number',
            scholar_id: 'Scholar ID',
            
            // Rampwalk specific
            has_partner: 'Has Partner',
            partner_name: 'Partner Name',
            partner_scholar_id: 'Partner Scholar ID',
            partner_contact: 'Partner Contact Number',
            
            // Cultural specific
            performance_type: 'Performance Type',
            original_performance_type: 'Original Selection',
            other_performance_type: 'Other Performance Type',
            group_members: 'Group Members'
        };

        // Get all unique keys and map to human-readable names
        const allKeys = new Set();
        registrations.forEach(reg => {
            Object.keys(reg.form_data).forEach(key => {
                allKeys.add(key);
            });
        });

        const baseHeaders = ['User ID', 'Event Name', 'Registered At'];
        const formHeaders = Array.from(allKeys).sort();
        const headers = [
            ...baseHeaders,
            ...formHeaders.map(key => fieldMappings[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
        ];

        const csvContent = [
            headers.join(','),
            ...registrations.map(reg => {
                const rowData = [
                    reg.user_id,
                    `"${reg.event_name}"`,
                    `"${new Date(reg.registered_at).toLocaleString()}"`
                ];

                // Add all form data in the same order as headers
                formHeaders.forEach(key => {
                    let value = reg.form_data[key];
                    
                    // Handle different data types
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (typeof value === 'boolean') {
                        value = value ? 'Yes' : 'No';
                    } else if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    }
                    
                    // Escape quotes and wrap in quotes
                    const escapedValue = String(value).replace(/"/g, '""');
                    rowData.push(`"${escapedValue}"`);
                });

                return rowData.join(',');
            })
        ].join('\n');

        // Download CSV with BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${eventSlug}-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showToast('CSV exported successfully with complete data!', 'success');

    } catch (error) {
        console.error('Error exporting CSV:', error);
        showToast('Error exporting data. Please try again.', 'error');
    }
};

    const openWhatsappLink = () => {
        const event = events[activeTab];
        if (event?.whatsapp_group_link) {
            window.open(event.whatsapp_group_link, '_blank');
            setShowWhatsappModal(false);
        }
    };

    const copyWhatsappLink = () => {
        const event = events[activeTab];
        if (event?.whatsapp_group_link) {
            navigator.clipboard.writeText(event.whatsapp_group_link)
                .then(() => showToast('WhatsApp link copied to clipboard!', 'success'))
                .catch(() => showToast('Failed to copy link. Please manually copy it.', 'error'));
        }
    };

    if (loading || !user || loadingStatus) {
        return (
            <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto mb-6 h-10 w-10 animate-spin border border-arch-line border-t-arch-ink"></div>
                    <p className="arch-label">Loading Esperanza Details...</p>
                </div>
            </div>
        );
    }

    const currentEventSlug = events[activeTab].slug;
    const isRegisteredForCurrentEvent = registrationStatus[currentEventSlug];
    const isCseUser = isCseEmail(user?.email) || isAdmin;

    return (
        <div ref={archScope} className="min-h-screen bg-arch-bg text-arch-ink py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Toast Container */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            {/* Header Section */}
            <header className="mb-10 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-arch-line">
                    <div>
                        <p className="arch-label mb-3" data-arch="fade">// ANNUAL FRESHERS EVENT</p>
                        <h1 className="arch-display text-3xl sm:text-5xl font-bold text-arch-ink tracking-tight" data-arch="lines">
                            <span className="arch-split-line"><span className="arch-line-inner">Event Registration for ESPERANZA</span></span>
                        </h1>
                        <p className="arch-body mt-3 max-w-2xl text-arch-muted" data-arch="fade" data-arch-delay="0.1">
                            Register your participation for Rampwalk, Rizz Show, and Cultural performances at ESPERANZA.
                        </p>
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={() => exportToCSV(currentEventSlug)}
                            className="arch-btn arch-btn-solid text-xs py-3 px-5 whitespace-nowrap shrink-0"
                            data-arch="fade"
                        >
                            <span>Export {events[activeTab]?.name} CSV</span>
                        </button>
                    )}
                </div>
            </header>

            {!isCseUser ? (
                <div className="bg-arch-card p-8 sm:p-12 border border-arch-line text-left max-w-2xl mx-auto my-8 shadow-md">
                    <div className="flex items-center gap-3 mb-4 text-amber-600">
                        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="arch-label text-xs tracking-widest uppercase text-amber-600 font-semibold">// CSE EXCLUSIVE EVENT</p>
                    </div>
                    <h2 className="arch-title text-2xl sm:text-3xl text-arch-ink mb-4">Registration Restricted</h2>
                    <p className="arch-body text-arch-muted text-sm sm:text-base leading-relaxed mb-6">
                        Esperanza event registrations are strictly reserved for Computer Science & Engineering students with valid <code className="bg-arch-bg-alt border border-arch-line px-2 py-0.5 text-arch-ink font-mono text-xs">@cse.nits.ac.in</code> email addresses.
                    </p>
                    <div className="p-4 bg-arch-bg-alt border-l-2 border-arch-ink text-xs text-arch-ink mb-8">
                        <span className="font-semibold">Your Current Email:</span> {user?.email}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/email-migration')}
                            className="arch-btn arch-btn-solid text-xs py-3 px-6"
                        >
                            <span>Verify / Migrate Email</span>
                        </button>
                        <button
                            onClick={() => navigate('/events')}
                            className="arch-btn arch-btn-ghost text-xs py-3 px-6"
                        >
                            <span>Back to All Events</span>
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto mb-8 border-b border-arch-line hide-scrollbar gap-2" data-arch="fade">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`arch-btn text-xs py-3 px-6 whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'arch-btn-solid font-semibold'
                                        : 'arch-btn-ghost text-arch-muted hover:text-arch-ink'
                                }`}
                            >
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Form Container */}
                    <div className="bg-arch-card p-6 sm:p-10 border border-arch-line mb-8 shadow-sm" data-arch="fade">
                        {activeTab === 'rampwalk' && (
                            <RampwalkForm 
                                onRegistrationSuccess={handleRegistrationSuccess}
                                isAlreadyRegistered={isRegisteredForCurrentEvent}
                                showToast={showToast}
                            />
                        )}
                        {activeTab === 'rizzShow' && (
                            <RizzShowForm 
                                onRegistrationSuccess={handleRegistrationSuccess}
                                isAlreadyRegistered={isRegisteredForCurrentEvent}
                                showToast={showToast}
                            />
                        )}
                        {activeTab === 'cultural' && (
                            <CulturalForm 
                                onRegistrationSuccess={handleRegistrationSuccess}
                                isAlreadyRegistered={isRegisteredForCurrentEvent}
                                showToast={showToast}
                            />
                        )}
                    </div>
                </>
            )}

            {/* WhatsApp Join Button - Only show if registered */}
            {isRegisteredForCurrentEvent && (
                <div className="text-center mb-8" data-arch="fade">
                    <button
                        onClick={() => setShowWhatsappModal(true)}
                        className="arch-btn text-xs py-3.5 px-6 font-semibold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 border-emerald-600/30 hover:border-emerald-600 transition-all flex items-center justify-center gap-2.5 mx-auto"
                    >
                        <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
                        </svg>
                        <span>Join {events[activeTab]?.name} WhatsApp</span>
                    </button>
                </div>
            )}

            {/* WhatsApp Modal */}
            {showWhatsappModal && (
                <div className="fixed inset-0 bg-arch-ink/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-arch-card border border-arch-line p-6 sm:p-8 w-full max-w-md shadow-2xl text-arch-ink">
                        <p className="arch-label mb-2 text-arch-muted">// COMMUNITY GROUP</p>
                        <h3 className="arch-title text-xl text-arch-ink mb-3">Join WhatsApp Group</h3>
                        <p className="arch-body text-sm mb-1">
                            Group channel for:
                        </p>
                        <p className="arch-title text-lg text-arch-ink mb-4">{events[activeTab]?.name}</p>
                        
                        <p className="arch-body text-xs text-arch-muted mb-6">
                            Join the WhatsApp group for event schedules, updates, and real-time announcements.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={openWhatsappLink}
                                className="arch-btn arch-btn-solid text-xs py-3.5 w-full bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800"
                            >
                                <span>Join WhatsApp Group</span>
                            </button>
                            
                            <button
                                onClick={copyWhatsappLink}
                                className="arch-btn arch-btn-ghost text-xs py-3.5 w-full"
                            >
                                <span>Copy Link</span>
                            </button>
                            
                            <button
                                onClick={() => setShowWhatsappModal(false)}
                                className="arch-btn arch-btn-ghost text-xs py-3.5 w-full border-transparent text-arch-muted hover:text-arch-ink"
                            >
                                <span>Close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS for mobile optimizations */}
            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                @media (max-width: 640px) {
                    input, select, textarea {
                        font-size: 16px; /* Prevents zoom on iOS */
                    }
                }
            `}</style>
        </div>
    );
};

export default EventsRegistration;
