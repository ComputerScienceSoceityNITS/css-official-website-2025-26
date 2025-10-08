import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { supabase } from '/src/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import eventsContent from '/src/constants/events'; // ADD: Import eventsContent

// --- Badge Definitions ---
const badges = [
    { name: 'Event Enthusiast', threshold: 1, icon: '🌟', description: 'Attended your first event!' },
    { name: 'Active Participant', threshold: 3, icon: '🏆', description: 'Attended 3 events.' },
    { name: 'Community Pillar', threshold: 5, icon: '🛡️', description: 'Attended 5 events.' },
    { name: 'CSS Legend', threshold: 10, icon: '👑', description: 'Attended 10 or more events!' },
];

// ADD: WhatsApp group links for events
const whatsappGroups = {
    "css-hackathon-2024": "https://chat.whatsapp.com/YOUR_HACKATHON_LINK",
    "web-dev-workshop": "https://chat.whatsapp.com/YOUR_WORKSHOP_LINK",
    // Add more event slugs and their WhatsApp links here
};

const Dashboard = () => {
    const { user, signOut, loading: authLoading, profile: authProfile } = useAuth();
    const navigate = useNavigate();
    const [localProfile, setLocalProfile] = useState(null);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            navigate('/auth');
            return;
        }

        if (user && !authLoading) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        if (!user || !mounted.current) return;

        try {
            setDataLoading(true);
            
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    return null;
                }
                return data;
            };

            const fetchAttendedEvents = async () => {
                const { data, error } = await supabase
                    .from('user_events')
                    .select('event_slug, registered_at')
                    .eq('user_id', user.id)
                    .order('registered_at', { ascending: false });
                
                if (error) {
                    console.error('Error fetching attended events:', error);
                    return [];
                }
                
                console.log('Raw events data from DB:', data);
                
                // Map event slugs to event names and add WhatsApp links
                const eventsWithDetails = data.map(item => {
                    // Find event in eventsContent by slug
                    const eventData = eventsContent.body.events.find(event => event.slug === item.event_slug);
                    const whatsappLink = whatsappGroups[item.event_slug];
                    
                    return {
                        event_slug: item.event_slug,
                        event_name: eventData?.name || 'Unknown Event',
                        registered_at: item.registered_at,
                        whatsapp_link: whatsappLink
                    };
                });
                
                console.log('Processed events:', eventsWithDetails);
                return eventsWithDetails;
            };

            const [profileData, eventsData] = await Promise.all([
                fetchProfile(),
                fetchAttendedEvents()
            ]);

            if (mounted.current) {
                setLocalProfile(profileData);
                setAttendedEvents(eventsData);
                console.log('Final attended events state:', eventsData);
            }
        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            if (mounted.current) {
                setDataLoading(false);
            }
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    // ADD: Function to handle WhatsApp group join
    const handleJoinWhatsappGroup = (event) => {
        setSelectedEvent(event);
        setShowWhatsappModal(true);
    };

    // ADD: Function to open WhatsApp link
    const openWhatsappLink = () => {
        if (selectedEvent?.whatsapp_link) {
            window.open(selectedEvent.whatsapp_link, '_blank');
            setShowWhatsappModal(false);
            setSelectedEvent(null);
        }
    };

    const profile = authProfile || localProfile;
    const isLoading = authLoading || dataLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const earnedBadges = badges.filter(badge => attendedEvents.length >= badge.threshold);

    return (
        <div className="relative min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 py-10 overflow-hidden">
            {/* WhatsApp Modal */}
            {showWhatsappModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full backdrop-blur-lg">
                        <h3 className="text-xl font-bold text-cyan-400 mb-4">Join WhatsApp Group</h3>
                        <p className="text-gray-300 mb-2">
                            You've successfully registered for:
                        </p>
                        <p className="text-white font-bold mb-4">{selectedEvent.event_name}</p>
                        <p className="text-gray-300 mb-6">
                            Click below to join the WhatsApp group for updates and discussions:
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={openWhatsappLink}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
                                </svg>
                                Join WhatsApp Group
                            </button>
                            <button
                                onClick={() => {
                                    setShowWhatsappModal(false);
                                    setSelectedEvent(null);
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className="absolute text-cyan-400 text-xs animate-[fall_6s_linear_infinite]"
                        style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s`, top: "-20px" }}>
                        {Math.random() > 0.5 ? "1" : "0"}
                    </div>
                ))}
            </div>

            <div className="relative max-w-4xl mx-auto bg-black/70 border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-cyan-500 shadow-lg"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold" style={{ fontFamily: "Goldman, sans-serif" }}>{profile?.full_name || user?.email}</h1>
                        <p className="text-cyan-400 font-mono mt-1">Scholar ID: {profile?.scholar_id || 'N/A'}</p>
                        <p className="text-gray-400 mt-1">Events Attended: {attendedEvents.length}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-auto bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-4 rounded transition-all">
                        Logout
                    </button>
                </div>

                <div className="my-8 border-t border-cyan-500/20"></div>

                {/* --- Badges Section --- */}
                <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Goldman, sans-serif" }}>Badges Earned</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                            <div key={badge.name} className={`p-4 rounded-lg text-center transition-all ${earnedBadges.some(b => b.name === badge.name) ? 'bg-cyan-900/50 border border-cyan-700' : 'bg-gray-800/50 border border-gray-700 opacity-40'}`}>
                                <div className="text-5xl">{badge.icon}</div>
                                <h3 className="font-bold mt-2">{badge.name}</h3>
                                <p className="text-xs text-gray-400">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="my-8 border-t border-cyan-500/20"></div>

                {/* --- Attended Events Section --- */}
                <div>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Goldman, sans-serif" }}>Your Registered Events</h2>
                    <div className="space-y-3">
                        {attendedEvents.length > 0 ? (
                            attendedEvents.map((event, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-cyan-300">{event.event_name}</h3>
                                            <p className="text-gray-400 text-sm">
                                                Registered on: {new Date(event.registered_at).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {event.whatsapp_link && (
                                                <button
                                                    onClick={() => handleJoinWhatsappGroup(event)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all flex items-center gap-2 text-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
                                                    </svg>
                                                    Join Group
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-6 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                                <p className="text-gray-400 text-lg">No events registered yet.</p>
                                <p className="text-cyan-400 mt-2">Go to Events page and register for upcoming events!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;