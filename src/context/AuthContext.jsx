
import React from 'react';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
    const [requiresCollegeVerification, setRequiresCollegeVerification] = useState(false);
    
    const initializedRef = useRef(false);
    const processingAuthChangeRef = useRef(false);

    const isCollegeEmail = (email) => {
        if (!email) return false;
        const emailLower = email.toLowerCase();
        return emailLower.endsWith('.nits.ac.in') || emailLower.endsWith('@nits.ac.in');
    };

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
        return profileData && profileData.full_name && profileData.scholar_id && profileData.branch;
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
                setUser(session.user);
                
                let userProfile = await fetchProfile(session.user.id);
                
                // If profile doesn't exist, create a stub row (especially for new Google signups)
                if (!userProfile) {
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                user_id: session.user.id,
                                email: session.user.email,
                                full_name: session.user.user_metadata?.full_name || '',
                                college_email_verified: isCollegeEmail(session.user.email),
                                updated_at: new Date().toISOString()
                            }
                        ])
                        .select()
                        .single();

                    if (insertError) {
                        console.error('Error auto-creating profile:', insertError);
                    } else {
                        userProfile = newProfile;
                    }
                }
                
                setProfile(userProfile);
                
                const profileComplete = checkProfileCompletion(userProfile);
                setRequiresProfileCompletion(!profileComplete);

                const collegeVerified = checkCollegeVerification(userProfile);
                setRequiresCollegeVerification(!collegeVerified);

                
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

    
    const signIn = async (credentials) => {
        const { data, error } = await supabase.auth.signInWithPassword(credentials);
        if (error) throw error;
        return { data, error: null };
    };

    const signUp = async (email, password, fullName, scholarId) => {
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
                data: { full_name: fullName, scholar_id: scholarId },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) throw error;

        
        if (data.user) {
            await supabase.from('profiles').upsert({
                user_id: data.user.id,
                full_name: fullName,
                scholar_id: scholarId,
                email: email,
                college_email_verified: isCollegeEmail(email), 
                updated_at: new Date().toISOString(),
            });
        }

        return data;
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

    const refreshProfile = async () => {
        if (user) {
            const userProfile = await fetchProfile(user.id);
            setProfile(userProfile);
            setRequiresProfileCompletion(!checkProfileCompletion(userProfile));
            setRequiresCollegeVerification(!checkCollegeVerification(userProfile));
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
                redirectTo: `${window.location.origin}/auth/callback`
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
        isCollegeEmail,
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