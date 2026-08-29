import React, { useEffect, useState } from 'react';
import { supabase } from '/src/supabaseClient.js';
import { useAuth } from '/src/context/AuthContext.jsx';

// --- Badge Definitions ---
const badges = [
    { name: 'Event Enthusiast', threshold: 1, icon: '🌟', description: 'Attended your first event!' },
    { name: 'Active Participant', threshold: 3, icon: '🏆', description: 'Attended 3 events.' },
    { name: 'Community Pillar', threshold: 5, icon: '🛡️', description: 'Attended 5 events.' },
    { name: 'CSS Legend', threshold: 10, icon: '👑', description: 'Attended 10 or more events!' },
];

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('events');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeBadge, setActiveBadge] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);

            // Fetch all users with their profiles and event counts
            const { data: userEvents, error: eventsError } = await supabase
                .from('user_events')
                .select('user_id, event_slug, profiles(full_name, scholar_id, avatar_url)')
                .eq('profiles.scholar_id', null, { foreignTable: 'profiles' })
                .not('profiles.scholar_id', 'is', null);

            if (eventsError) {
                console.error('Error fetching user events:', eventsError);
                await fetchLeaderboardDataFallback();
                return;
            }

            // Process the data to count events per user
            const userEventCounts = {};
            const userProfiles = {};

            userEvents.forEach(record => {
                const userId = record.user_id;
                const profile = record.profiles;

                if (profile && profile.scholar_id) {
                    if (!userEventCounts[userId]) {
                        userEventCounts[userId] = 0;
                        userProfiles[userId] = profile;
                    }
                    userEventCounts[userId]++;
                }
            });

            // Transform data for leaderboard
            const leaderboard = Object.keys(userEventCounts).map(userId => {
                const eventCount = userEventCounts[userId];
                const profile = userProfiles[userId];
                
                const earnedBadges = badges
                    .filter(badge => eventCount >= badge.threshold)
                    .sort((a, b) => b.threshold - a.threshold);

                return {
                    userId,
                    fullName: profile.full_name,
                    scholarId: profile.scholar_id,
                    avatarUrl: profile.avatar_url,
                    eventCount,
                    earnedBadges,
                    highestBadge: earnedBadges[0] || null
                };
            });

            leaderboard.sort((a, b) => {
                if (b.eventCount !== a.eventCount) {
                    return b.eventCount - a.eventCount;
                }
                return a.fullName?.localeCompare(b.fullName);
            });

            setLeaderboardData(leaderboard);

        } catch (error) {
            console.error('Error in fetchLeaderboardData:', error);
            await fetchLeaderboardDataFallback();
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaderboardDataFallback = async () => {
        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, full_name, scholar_id, avatar_url')
                .not('scholar_id', 'is', null)
                .order('full_name');

            if (profilesError) throw profilesError;

            const leaderboard = [];

            for (const profile of profiles) {
                const { data: userEvents, error } = await supabase
                    .from('user_events')
                    .select('event_slug')
                    .eq('user_id', profile.user_id);

                if (!error) {
                    const eventCount = userEvents?.length || 0;
                    const earnedBadges = badges
                        .filter(badge => eventCount >= badge.threshold)
                        .sort((a, b) => b.threshold - a.threshold);

                    leaderboard.push({
                        userId: profile.user_id,
                        fullName: profile.full_name,
                        scholarId: profile.scholar_id,
                        avatarUrl: profile.avatar_url,
                        eventCount,
                        earnedBadges,
                        highestBadge: earnedBadges[0] || null
                    });
                }
            }

            leaderboard.sort((a, b) => b.eventCount - a.eventCount);
            setLeaderboardData(leaderboard);

        } catch (error) {
            console.error('Error in fallback fetch:', error);
        }
    };

    const filteredAndSortedData = leaderboardData
        .filter(student => 
            student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.scholarId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.fullName?.localeCompare(b.fullName);
            }
            return b.eventCount - a.eventCount;
        });

    const getRankIcon = (rank) => {
        switch(rank) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `#${rank + 1}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto mb-4"></div>
                    <p className="text-lg">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-arch-bg text-arch-ink px-3 py-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-3" >
                        CSS Leaderboard
                    </h1>
                    <p className="text-arch-ink text-base">
                        Track student participation and achievements
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or scholar ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-3 bg-arch-bg-alt border border-arch-line pl-12 focus:outline-none focus:border-arch-line w-full text-arch-ink placeholder-gray-400"
                    />
                    <svg 
                        className="w-5 h-5 absolute left-4 top-3.5 text-arch-ink" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Sort Buttons */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setSortBy('events')}
                        className={`flex-1 px-4 py-3 transition-all border text-sm   ${
                            sortBy === 'events' 
                                ? 'bg-arch-ink border-arch-ink text-arch-bg' 
                                : 'bg-arch-bg-alt border-arch-line text-arch-ink-3 hover:border-arch-line'
                        }`}
                    >
                        Sort by Events
                    </button>
                    <button
                        onClick={() => setSortBy('name')}
                        className={`flex-1 px-4 py-3 transition-all border text-sm   ${
                            sortBy === 'name' 
                                ? 'bg-arch-ink border-arch-ink text-arch-bg' 
                                : 'bg-arch-bg-alt border-arch-line text-arch-ink-3 hover:border-arch-line'
                        }`}
                    >
                        Sort by Name
                    </button>
                </div>

                {/* Badge Legend - Horizontal Scroll */}
                <div className="mb-6">
                    <div className="flex space-x-3 overflow-x-auto pb-4 -mx-3 px-3 scrollbar-hide">
                        {badges.map((badge) => (
                            <div 
                                key={badge.name} 
                                className="bg-arch-bg-alt border border-arch-line p-3 text-center min-w-[140px] flex-shrink-0"
                                onClick={() => setActiveBadge(activeBadge?.name === badge.name ? null : badge)}
                            >
                                <div className="text-2xl mb-1">{badge.icon}</div>
                                <h3 className="font-bold text-arch-ink text-sm">{badge.name}</h3>
                                <p className="text-xs text-arch-ink-3 mt-1">{badge.threshold}+ events</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badge Detail Modal */}
                {activeBadge && (
                    <div className="fixed inset-0 bg-arch-card flex items-center justify-center z-50 p-4" onClick={() => setActiveBadge(null)}>
                        <div className="bg-arch-bg-alt border border-arch-line p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="text-4xl text-center mb-4">{activeBadge.icon}</div>
                            <h3 className="text-xl font-bold text-arch-ink text-center mb-2">{activeBadge.name}</h3>
                            <p className="text-arch-ink-3 text-center mb-4">{activeBadge.description}</p>
                            <button 
                                onClick={() => setActiveBadge(null)}
                                className="w-full bg-arch-ink hover:bg-arch-ink text-arch-bg py-2 transition-colors hover:text-arch-bg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Leaderboard Cards */}
                <div className="space-y-3">
                    {filteredAndSortedData.length === 0 ? (
                        <div className="text-center py-12 bg-arch-card border border-arch-line p-6">
                            <p className="text-arch-ink-3 text-lg">No students found matching your search.</p>
                        </div>
                    ) : (
                        filteredAndSortedData.map((student, index) => (
                            <div 
                                key={student.userId}
                                className={`p-4 border transition-all   ${
                                    index === 0 
                                        ? 'bg-arch-card border-arch-line'
                                        : index === 1
                                        ? 'bg-arch-card border-arch-line'
                                        : index === 2
                                        ? 'bg-arch-card border-arch-line'
                                        : 'bg-arch-bg-alt border-arch-line'
                                }`}
                            >
                                {/* Top Row - Rank, Avatar, and Basic Info */}
                                <div className="flex items-center gap-3 mb-3">
                                    {/* Rank */}
                                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center border   ${
                                        index === 0 
                                            ? 'bg-arch-ink border-arch-ink text-arch-bg'
                                            : index === 1
                                            ? 'bg-arch-bg-alt border-arch-line text-arch-ink-3'
                                            : index === 2
                                            ? 'bg-arch-ink border-arch-ink text-arch-bg'
                                            : 'bg-arch-ink border-arch-ink text-arch-bg'
                                    }`}>
                                        <span className="text-lg font-bold">
                                            {getRankIcon(index)}
                                        </span>
                                    </div>

                                    {/* Avatar */}
                                    <img
                                        src={student.avatarUrl || `https://api.dicebear.com/8.x/identicon/svg?seed=${student.scholarId}`}
                                        alt={student.fullName}
                                        className="w-10 h-10 rounded-full border border-arch-line"
                                    />

                                    {/* Student Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-arch-ink truncate">
                                            {student.fullName || 'Unknown Student'}
                                        </h3>
                                        <p className="text-arch-ink text-xs truncate">
                                            ID: {student.scholarId}
                                        </p>
                                    </div>

                                    {/* Event Count */}
                                    <div className="text-center bg-arch-ink border border-arch-ink px-3 py-2">
                                        <div className="text-lg font-bold text-arch-ink">
                                            {student.eventCount}
                                        </div>
                                        <div className="text-[10px] text-arch-ink uppercase tracking-wide">
                                            Events
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row - Badges */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 flex-wrap">
                                        {student.earnedBadges.slice(0, 3).map((badge) => (
                                            <div 
                                                key={badge.name}
                                                className="text-2xl hover:scale-110 transition-transform"
                                                title={`${badge.name}: ${badge.description}`}
                                            >
                                                {badge.icon}
                                            </div>
                                        ))}
                                        {student.earnedBadges.length > 3 && (
                                            <div className="text-sm bg-arch-ink rounded-full w-8 h-8 flex items-center justify-center text-arch-bg border border-arch-ink">
                                                +{student.earnedBadges.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Highest Badge */}
                                    {student.highestBadge && (
                                        <div className="text-right">
                                            <div className="text-xs text-arch-ink font-semibold">
                                                Highest
                                            </div>
                                            <div className="text-lg">
                                                {student.highestBadge.icon}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats Summary */}
                {leaderboardData.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                        <div className="bg-arch-bg-alt border border-arch-line p-4">
                            <div className="text-xl font-bold text-arch-ink">{leaderboardData.length}</div>
                            <div className="text-arch-ink uppercase tracking-wide text-xs">Students</div>
                        </div>
                        <div className="bg-arch-bg-alt border border-arch-line p-4">
                            <div className="text-xl font-bold text-arch-ink">
                                {leaderboardData.reduce((sum, student) => sum + student.eventCount, 0)}
                            </div>
                            <div className="text-arch-ink uppercase tracking-wide text-xs">Total Events</div>
                        </div>
                        <div className="bg-arch-bg-alt border border-arch-line p-4">
                            <div className="text-xl font-bold text-arch-ink">
                                {Math.round(leaderboardData.reduce((sum, student) => sum + student.eventCount, 0) / leaderboardData.length) || 0}
                            </div>
                            <div className="text-arch-ink uppercase tracking-wide text-xs">Average</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;