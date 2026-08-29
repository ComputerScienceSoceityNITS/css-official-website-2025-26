
import React from 'react';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import {
    isInstituteEmail,
    parseInstituteEmail,
    qualifiesForWelcomeStory,
} from '../utils/instituteEmail';
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
        const [requiresCollegeVerification, setRequiresCollegeVerification] = useState(false);
    const [requiresOnboarding, setRequiresOnboarding] = useState(false);
    const [authRejection, setAuthRejection] = useState(null);
    
    const initializedRef = useRef(false);
    const processingAuthChangeRef = useRef(false);

        /* Accounts are institute-only. A small env-driven allowlist exists so
       that a handful of standing accounts (the society's own admin
       addresses) are not locked out by the pattern — set
       VITE_AUTH_EMAIL_ALLOWLIST to a comma-separated list. It is empty by
       default, so the policy is closed unless someone opts an address in. */
    const ALLOWLIST = (import.meta.env.VITE_AUTH_EMAIL_ALLOWLIST || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    const isAllowlisted = (email) =>
        !!email && ALLOWLIST.includes(email.trim().toLowerCase());

    /* Kept under its original name: App.jsx, AuthCallback and
       MigrationCallBack all read it off the context. */
    const isCollegeEmail = (email) => isInstituteEmail(email) || isAllowlisted(email);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error("Error fetching profile:", error);
                return null;
            }
           
            return data;
        } catch (error) {
            console.error("Error in fetchProfile:", error);
            return null;
        }
    };

        const checkProfileCompletion = (profileData) => {
        return profileData && profileData.full_name && profileData.scholar_id;
    };

    /* Onboarding is a one-time introduction, separate from "is the profile
       filled in". Members carried over from the previous website already
       have a row here, but they have never been through this site's
       intake, so they are onboarded only once the explicit flag is set.
       When the column has not been added yet the flag reads as undefined,
       and we fall back to profile completeness so nobody is trapped in a
       loop they cannot finish. */
    const checkOnboarded = (profileData) => {
        if (!profileData) return false;
        if (typeof profileData.onboarded === 'boolean') return profileData.onboarded;
        return checkProfileCompletion(profileData);
    };

    const checkCollegeVerification = (profileData) => {
        if (!profileData) return false;
        
        
        const hasCollegeEmail = isCollegeEmail(profileData.email);
        const isVerified = profileData.college_email_verified === true;
        
        return hasCollegeEmail || isVerified;
    };

    const processAuthSession = async (session, source) => {
        
        if (processingAuthChangeRef.current) {
            return;
        }

        processingAuthChangeRef.current = true;
        
        try {
            if (session?.user) {
                /* Hard gate. The check lives here rather than only in the
                   OAuth callback so that a restored session, a token
                   refresh or a second tab is held to the same rule. */
                if (!isCollegeEmail(session.user.email)) {
                    setAuthRejection({
                        email: session.user.email,
                        reason: 'not-institute',
                    });
                    setUser(null);
                    setProfile(null);
                    setRequiresProfileCompletion(false);
                    setRequiresCollegeVerification(false);
                    setRequiresOnboarding(false);
                    await supabase.auth.signOut();
                    return;
                }

                setAuthRejection(null);
                setUser(session.user);

                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);

                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);

                const collegeVerified = checkCollegeVerification(userProfile);
                setRequiresCollegeVerification(!collegeVerified);

                setRequiresOnboarding(!checkOnboarded(userProfile));

                
                if (window.location.pathname === '/chat' && !collegeVerified) {
                    const skippedMigration = localStorage.getItem('skippedCollegeMigration');
                    if (!skippedMigration) {
                        window.location.href = '/email-migration';
                    }
                }
            } else {
                setUser(null);
                setProfile(null);
                setRequiresProfileCompletion(false);
                setRequiresCollegeVerification(false);
                setRequiresOnboarding(false);
            }
        } catch (error) {
            console.error('❌ Error processing auth session:', error);
        } finally {
            processingAuthChangeRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            if (initializedRef.current) {
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    return;
                }

                
                if (mounted && session) {
                    await processAuthSession(session, 'initial_check');
                } else if (mounted) {
                    setLoading(false);
                }
                
                initializedRef.current = true;
            } catch (error) {
                console.error("🚨 Auth initialization error:", error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            
            setTimeout(async () => {
                if (!mounted) return;
                
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                    await processAuthSession(session, `event_${event}`);
                } else if (event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        setUser(session.user);
                    }
                }
            }, 10); 
        });

        
        initializeAuth();

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    
        /* Password sign-in and sign-up were removed: Google is the only way in,
       and the institute mail is the only identity we accept. The stubs stay
       so that any screen still importing them fails loudly and locally
       rather than crashing on an undefined call. */
    const PASSWORD_AUTH_RETIRED =
        'Password sign-in has been retired. Continue with your institute Google account.';

    const signIn = async () => {
        throw new Error(PASSWORD_AUTH_RETIRED);
    };

    const signUp = async () => {
        throw new Error(PASSWORD_AUTH_RETIRED);
    };


    const verifyOtp = async (params) => {
        const { data, error } = await supabase.auth.verifyOtp(params);
        if (error) throw error;
        return data;
    };

    
   
const migrateToCollegeEmail = async (collegeEmail) => {
    try {
        if (!isCollegeEmail(collegeEmail)) {
            throw new Error('Please use a valid college email address');
        }

        
        const { data: updateData, error: updateError } = await supabase.auth.updateUser(
            { email: collegeEmail },
            { emailRedirectTo: `${window.location.origin}/auth/callback` }
        );

        if (updateError) {
            if (updateError.message.includes('rate limit')) {
                throw new Error('Email rate limit exceeded. Please try again in 1 hour.');
            }
            throw updateError;
        }

        
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                pending_college_email: collegeEmail,
                college_email_verified: false,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

        if (profileError) throw profileError;

        return { error: null };
    } catch (error) {
        return { error };
    }
};

    const checkIfNeedsMigration = (userEmail) => {
        return user && !isCollegeEmail(userEmail);
    };

        /* Writes the intake answers and flips the onboarding flag. If the
       `onboarded` columns have not been added to `profiles` yet Postgres
       rejects the payload (42703 / PGRST204); rather than stranding the
       user we retry with the columns that certainly exist, and the
       completeness fallback in checkOnboarded carries the flow. */
    const completeOnboarding = async (fields) => {
        if (!user) throw new Error('Not signed in.');

        const parsed = parseInstituteEmail(user.email);
        const base = {
            user_id: user.id,
            email: user.email,
            full_name: fields.fullName,
            scholar_id: fields.scholarId,
            contact_number: fields.contactNumber || null,
            college_email_verified: true,
            updated_at: new Date().toISOString(),
        };
        const extended = {
            ...base,
            branch: parsed.branch || null,
            admission_year: parsed.admissionYear || null,
            onboarded: true,
            onboarded_at: new Date().toISOString(),
        };

        const isMissingColumn = (err) =>
            err && (err.code === '42703' || err.code === 'PGRST204');

        let { error } = await supabase
            .from('profiles')
            .upsert(extended, { onConflict: 'user_id' });

        if (isMissingColumn(error)) {
            console.warn(
                'profiles is missing the onboarding columns — see SECURITY.md for the migration.'
            );
            ({ error } = await supabase
                .from('profiles')
                .upsert(base, { onConflict: 'user_id' }));
        }

        if (error) throw error;

        const updated = await refreshProfile();
        return updated;
    };

    /* Whether this account should be shown the incoming-batch story, and
       whether it already has been. The seen-flag is mirrored into
       localStorage so a missing column never replays the story forever. */
    const storyKey = (id) => `welcomeStorySeen:${id}`;

    const shouldSeeWelcomeStory = () => {
        if (!user) return false;
        if (!qualifiesForWelcomeStory(user.email)) return false;
        if (profile?.welcome_story_seen === true) return false;
        try {
            if (localStorage.getItem(storyKey(user.id)) === '1') return false;
        } catch {
            /* private mode — fall through and show it */
        }
        return true;
    };

    const markWelcomeStorySeen = async () => {
        if (!user) return;
        try {
            localStorage.setItem(storyKey(user.id), '1');
        } catch {
            /* nothing to do — the column below is the durable record */
        }
        const { error } = await supabase
            .from('profiles')
            .update({ welcome_story_seen: true, updated_at: new Date().toISOString() })
            .eq('user_id', user.id);
        if (error && error.code !== '42703' && error.code !== 'PGRST204') {
            console.error('Could not record welcome story state:', error);
        }
        await refreshProfile();
    };

    const refreshProfile = async () => {
        if (user) {
            const userProfile = await fetchProfile(user.id);
            setProfile(userProfile);
            setRequiresProfileCompletion(!checkProfileCompletion(userProfile));
            setRequiresCollegeVerification(!checkCollegeVerification(userProfile));
            setRequiresOnboarding(!checkOnboarded(userProfile));
            return userProfile;
        }
    };

    
    const signInWithGoogleForMigration = () => {
        return supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/migration-callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            }
        });
    };

    
        const signInWithGoogle = () => {
        return supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    /* Students often have a personal account signed in
                       already; force the chooser so they can pick the
                       institute one. */
                    prompt: 'select_account',
                },
            }
        });
    };

    const value = {
        signUp,
        signIn,
        signInWithGoogle, 
        signInWithGoogleForMigration, 
        signOut: () => supabase.auth.signOut(),
        verifyOtp,
        user,
        profile,
        loading,
                requiresProfileCompletion,
        requiresCollegeVerification,
        requiresOnboarding,
        authRejection,
        clearAuthRejection: () => setAuthRejection(null),
        completeOnboarding,
        shouldSeeWelcomeStory,
        markWelcomeStorySeen,
        isCollegeEmail,
        isInstituteEmail,
        parseInstituteEmail,
        refreshProfile,
        migrateToCollegeEmail,
        checkIfNeedsMigration
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;