import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FaWhatsapp, FaInfoCircle, FaScroll, FaUserEdit, FaDownload, FaUsers, FaCheckCircle, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import abacusEvents from '../jsonData/abacus.json';

// --- UI Components ---

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-4 backdrop-blur-xl border border-white/10 ${
                type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
        >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                {type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
            </div>
            <div>
                <p className="font-black text-sm uppercase tracking-widest leading-none mb-1">{type === 'success' ? 'Success' : 'Attention'}</p>
                <p className="text-white/80 font-medium">{message}</p>
            </div>
        </motion.div>
    );
};

// --- Main Component ---

const Abacus = () => {
    const { user, profile, isCollegeEmail } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState(abacusEvents[0]);
    const [activeTab, setActiveTab] = useState('description');
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const titleRef = useRef(null);
    const containerRef = useRef(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '', scholarId: '', contact: '', teamName: '', members: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                name: profile.full_name || '',
                scholarId: profile.scholar_id || ''
            }));
            setIsAdmin(profile.role === 'admin' || profile.is_admin === true);
        }
    }, [profile]);

    useEffect(() => {
        if (user) fetchUserRegistrations();
        
        // GSAP Title Animation
        const ctx = gsap.context(() => {
            gsap.from(".char", {
                duration: 0.8,
                stagger: 0.05,
                y: 50,
                opacity: 0,
                rotateX: -90,
                ease: "back.out(2)"
            });
        }, titleRef);
        return () => ctx.revert();
    }, [user]);

    const fetchUserRegistrations = async () => {
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .select('event_slug')
                .eq('user_id', user.id);
            if (error) throw error;
            setRegistrations(data.map(r => r.event_slug));
        } catch (error) { console.error('Error fetching registrations:', error); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!user) return setToast({ message: 'Authorization required.', type: 'error' });
        if (!isCollegeEmail(user.email)) return setToast({ message: 'NIT Silchar email required.', type: 'error' });

        setLoading(true);
        try {
            const { error } = await supabase
                .from('event_registrations')
                .insert([{
                    user_id: user.id,
                    event_slug: selectedEvent.slug,
                    event_name: selectedEvent.name,
                    form_data: { ...formData, email: user.email, registered_at: new Date().toISOString() }
                }]);

            if (error) {
                if (error.code === '23505') setToast({ message: 'Duplicate registration detected.', type: 'error' });
                else throw error;
            } else {
                setToast({ message: 'Neutral network updated. Registration complete.', type: 'success' });
                setRegistrations(prev => [...prev, selectedEvent.slug]);
            }
        } catch (error) {
            setToast({ message: 'System error. Please retry.', type: 'error' });
        } finally { setLoading(false); }
    };

    const exportToCSV = async (eventSlug, eventName) => {
        try {
            const { data, error } = await supabase.from('event_registrations').select('*').eq('event_slug', eventSlug);
            if (error) throw error;
            if (!data || data.length === 0) return setToast({ message: 'Zero entries found.', type: 'error' });

            const headers = ['Name', 'Email', 'Scholar ID', 'Contact', 'Team Name', 'Members', 'Registered At'];
            const csvRows = [headers.join(','), ...data.map(reg => [
                `"${reg.form_data.name || ''}"`, `"${reg.form_data.email || ''}"`, `"${reg.form_data.scholarId || ''}"`,
                `"${reg.form_data.contact || ''}"`, `"${reg.form_data.teamName || ''}"`, `"${reg.form_data.members || ''}"`,
                `"${new Date(reg.registered_at).toLocaleString()}"`
            ].join(','))].join('\n');

            const blob = new Blob([csvRows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ABACUS_${eventName}_ADMIN_REPORT.csv`;
            a.click();
        } catch (error) { setToast({ message: 'Export failed.', type: 'error' }); }
    };

    const isRegistered = registrations.includes(selectedEvent.slug);

    return (
        <div className="min-h-screen bg-[#020205] text-[#e2e8f0] font-['Rajdhani'] selection:bg-purple-500/50 overflow-x-hidden relative">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
            </div>

            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-8 relative z-10" ref={titleRef}>
                {/* Hero */}
                <header className="mb-16 text-center space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block py-1 px-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold tracking-[0.3em] text-xs mb-4 uppercase"
                    >
                        Annual Tech Assembly
                    </motion.div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none flex items-center justify-center flex-wrap">
                        {"ABACUS".split("").map((c, i) => (
                            <span key={i} className="char inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">{c}</span>
                        ))}
                        <span className="char inline-block bg-clip-text text-transparent bg-gradient-to-b from-purple-400 to-indigo-600 ml-4">2026</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
                        Bridging the neural gap between imagination and execution.
                    </p>
                </header>

                {/* Mobile Selector */}
                <div className="lg:hidden mb-10 relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between px-6 group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#7c3aed]" />
                            <span className="font-black text-xl tracking-tight uppercase text-white/90">{selectedEvent.name}</span>
                        </div>
                        <FaChevronRight className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-90 text-purple-400' : 'text-white/20'}`} />
                    </button>
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-3 z-50 bg-[#0a0a0f]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-3 space-y-1"
                            >
                                {abacusEvents.map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() => { setSelectedEvent(event); setActiveTab('description'); setIsDropdownOpen(false); }}
                                        className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all ${
                                            selectedEvent.id === event.id ? 'bg-purple-600 text-white font-bold shadow-lg' : 'hover:bg-white/5 text-white/50'
                                        }`}
                                    >
                                        <span className="text-lg">{event.name}</span>
                                        {registrations.includes(event.slug) && <FaCheckCircle />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" ref={containerRef}>
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-32 space-y-3 pb-20">
                            <div className="flex items-center gap-2 mb-6 px-4">
                                {/* <FaTerminal className="text-purple-500" /> */}
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">SELECT EVENT</span>
                            </div>
                            {abacusEvents.map((event, idx) => (
                                <motion.button
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    onClick={() => { setSelectedEvent(event); setActiveTab('description'); }}
                                    className={`w-full text-left p-5 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden group border ${
                                        selectedEvent.id === event.id 
                                        ? 'bg-purple-600 border-purple-400 shadow-[0_10px_30px_rgba(124,58,237,0.3)] text-white' 
                                        : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70 hover:text-white'
                                    }`}
                                >
                                    <span className="font-black text-lg uppercase tracking-wider relative z-10">{event.name}</span>
                                    {registrations.includes(event.slug) ? (
                                        <FaCheckCircle className="relative z-10 text-white/80" />
                                    ) : (
                                        <FaChevronRight className={`transition-transform ${selectedEvent.id === event.id ? 'translate-x-0' : 'translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                                    )}
                                    {selectedEvent.id === event.id && (
                                        <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_2s_infinite]" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Deck */}
                    <main className="lg:col-span-8 space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col min-h-[700px]">
                            {/* Tab Bar */}
                            <nav className="flex p-3 bg-white/5 border-b border-white/5 gap-2">
                                {[
                                    { id: 'description', label: 'Brief', icon: <FaInfoCircle /> },
                                    { id: 'rules', label: 'Rules', icon: <FaScroll /> },
                                    { id: 'register', label: 'Register', icon: <FaUserEdit /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden group ${
                                            activeTab === tab.id ? 'bg-white text-black' : 'text-white/40 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={activeTab === tab.id ? 'text-black' : 'text-purple-500'}>{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <motion.div layoutId="tab-active-pill" className="absolute inset-0 bg-white -z-10" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            {/* Content Deck Body */}
                            <section className="p-10 flex-1 relative overflow-hidden group">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedEvent.slug + activeTab}
                                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.4 }}
                                        className="h-full flex flex-col"
                                    >
                                        {activeTab === 'description' && (
                                            <div className="space-y-12">
                                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                                    {selectedEvent.posterUrl ? (
                                                        <div className="relative group/poster">
                                                            <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-3xl opacity-0 group-hover/poster:opacity-100 transition-opacity" />
                                                            <img 
                                                                src={selectedEvent.posterUrl} 
                                                                alt={selectedEvent.name} 
                                                                className="w-full md:w-64 h-80 object-cover rounded-3xl border border-white/10 shadow-2xl relative z-10"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full md:w-64 h-80 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/20">
                                                            <FaInfoCircle size={40} />
                                                            <p className="font-black text-xs uppercase tracking-widest">Image Encrypted</p>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 space-y-6">
                                                        <div className="space-y-2">
                                                            <p className="text-purple-500 font-black text-xs tracking-[0.4em] uppercase">Core Objective</p>
                                                            <h2 className="text-5xl font-black text-white leading-none">{selectedEvent.name}</h2>
                                                        </div>
                                                        <p className="text-xl text-gray-400 leading-relaxed font-medium">
                                                            {selectedEvent.description}
                                                        </p>
                                                        <div className="flex gap-4 pt-6">
                                                            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/80">
                                                                MODE: {selectedEvent.type}
                                                            </div>
                                                            {isAdmin && (
                                                                <button 
                                                                    onClick={() => exportToCSV(selectedEvent.slug, selectedEvent.name)}
                                                                    className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/30"
                                                                >
                                                                    <FaDownload /> DOWNLOAD CSV
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'rules' && (
                                            <div className="space-y-8">
                                                <div className="flex items-center gap-4 text-purple-500">
                                                    <div className="h-[2px] w-12 bg-purple-500" />
                                                    <h3 className="text-xs font-black uppercase tracking-[0.5em]">OPERATIONAL PROTOCOLS</h3>
                                                </div>
                                                <div className="grid gap-6">
                                                    {selectedEvent.rules.split('\n').map((rule, i) => (
                                                        <motion.div 
                                                            key={i} 
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors flex gap-6 items-start"
                                                        >
                                                            <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 font-black text-xl border border-purple-500/20">{i + 1}</span>
                                                            <p className="flex-1 text-lg text-gray-300 font-medium pt-2">{rule.replace(/^\d+\.\s*/, '')}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'register' && (
                                            <div className="max-w-xl mx-auto w-full py-12">
                                                {isRegistered ? (
                                                    <div className="text-center space-y-8">
                                                        <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                                            <FaCheckCircle className="text-emerald-500 text-5xl" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h3 className="text-4xl font-black text-white uppercase tracking-tight">Access Granted</h3>
                                                            <p className="text-gray-400 text-lg font-medium">Authentication complete for {selectedEvent.name}. Connection stable.</p>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-6">
                                                            <a 
                                                                href={selectedEvent.whatsappLink} target="_blank" rel="noreferrer"
                                                                className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-105 transition-all text-white rounded-3xl font-black text-lg shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                                                            >
                                                                <FaWhatsapp size={24} /> JOIN COMMAND CENTER
                                                            </a>
                                                            {isAdmin && (
                                                                <button 
                                                                    onClick={() => exportToCSV(selectedEvent.slug, selectedEvent.name)}
                                                                    className="flex items-center gap-3 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-indigo-500/30"
                                                                >
                                                                    <FaDownload /> EXPORT PARTICIPANTS
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleRegister} className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2">SCHOLAR ID</label>
                                                                <input 
                                                                    type="text" required value={formData.scholarId}
                                                                    onChange={(e) => setFormData({...formData, scholarId: e.target.value})}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-all font-mono text-white placeholder:text-white/10"
                                                                />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                                                                <input 
                                                                    type="text" required placeholder="Phone" value={formData.contact}
                                                                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-all font-mono text-white placeholder:text-white/10"
                                                                />
                                                            </div>
                                                        </div>

                                                        {selectedEvent.type === 'team' && (
                                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-6 border-t border-white/5">
                                                                <div className="space-y-3">
                                                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><FaUsers /> TEAM NAME</label>
                                                                    <input 
                                                                        type="text" required placeholder="Designation" value={formData.teamName}
                                                                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-all"
                                                                    />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2">TEAM MEMBERS (Max {selectedEvent.maxTeamSize})</label>
                                                                    <textarea 
                                                                        required placeholder="Separate names with commas" value={formData.members}
                                                                        onChange={(e) => setFormData({...formData, members: e.target.value})}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-500 transition-all h-32 resize-none"
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        <button 
                                                            disabled={loading}
                                                            className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all transform active:scale-[0.98] shadow-2xl relative overflow-hidden group ${
                                                                loading ? 'bg-white/10 text-white/20 cursor-wait' : 'bg-white text-black hover:bg-[#fafafa]'
                                                            }`}
                                                        >
                                                            {loading ? 'Processing...' : 'REGISTER'}
                                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </section>
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
                
                body { background-color: #020205; }
                
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #020205; }
                ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #2d2d4d; }

                .char { perspective: 1000px; }

                .custom-sidebar-nav::-webkit-scrollbar { width: 4px; }
                .custom-sidebar-nav::-webkit-scrollbar-track { background: transparent; }
                .custom-sidebar-nav::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.3); border-radius: 10px; }
                .custom-sidebar-nav::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.6); }
            `}</style>
        </div>
    );
};

export default Abacus;
