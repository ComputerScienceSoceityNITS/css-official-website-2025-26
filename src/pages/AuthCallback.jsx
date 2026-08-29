import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { refreshProfile, isCollegeEmail } = useAuth();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Auth callback error:', error);
                    navigate('/auth');
                    return;
                }

                if (session?.user) {
                    const userEmail = session.user.email;
                    const isNitsEmail = userEmail.toLowerCase().endsWith('.nits.ac.in') || userEmail.toLowerCase().endsWith('@nits.ac.in');
                    
                    if (!isNitsEmail) {
                        await supabase.auth.signOut();
                        navigate('/auth?error=domain_restriction', { replace: true });
                        return;
                    }
                    
                    if (isCollegeEmail(userEmail)) {
                        
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                college_email_verified: true,
                                email: userEmail, 
                                updated_at: new Date().toISOString()
                            })
                            .eq('user_id', session.user.id);

                        if (updateError) {
                            console.error('Error updating college verification:', updateError);
                        } else {
                            console.log('College email verification status updated.');}
                    }

                    await refreshProfile();
                    
                    
                    let redirectTo = '/dashboard'; 
                    
                    
                    const storedRedirect = localStorage.getItem('postVerificationRedirect');
                    if (storedRedirect) {
                        redirectTo = storedRedirect;
                        localStorage.removeItem('postVerificationRedirect');
                    }
                    
                    
                    const urlParams = new URLSearchParams(window.location.search);
                    const fromMigration = urlParams.get('from_migration');
                    
                    if (fromMigration === 'true') {
                        redirectTo = '/chat'; 
                    }

                    
                    const previousPath = document.referrer;
                    if (previousPath && previousPath.includes('/esperanza')) {
                        redirectTo = '/dashboard';
                    }

                    
                    const intendedDestination = sessionStorage.getItem('auth_redirect');
                    if (intendedDestination) {
                        redirectTo = intendedDestination;
                        sessionStorage.removeItem('auth_redirect');
                    }

                    const emailLower = userEmail.toLowerCase();
                    const isNewBatch = emailLower.includes('ug') && emailLower.includes('26') && emailLower.includes('cse');
                    const hasViewedWelcomeStory = localStorage.getItem('viewedWelcomeStory') === 'true';

                    if (isNewBatch && !hasViewedWelcomeStory) {
                        redirectTo = '/welcome-story';
                    }

                    navigate(redirectTo, { replace: true });

                } else {
                    
                    const timeout = setTimeout(() => {
                        navigate('/auth', { replace: true });
                    }, 5000);

                    return () => clearTimeout(timeout);
                }
            } catch (error) {
                console.error('Error in auth callback:', error);
                navigate('/auth', { replace: true });
            }
        };

        handleAuthCallback();
    }, [navigate, refreshProfile, isCollegeEmail]);

    return (
        <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto mb-4"></div>
                <p className="text-lg">Completing authentication...</p>
                <p className="text-sm text-arch-ink-3 mt-2">You will be redirected shortly</p>
            </div>
        </div>
    );
};

export default AuthCallback;