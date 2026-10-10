import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
  Users,
  CheckCircle2,
  Share2,
  FileText,
  ArrowRight,
  Download,
  AlertCircle,
  X,
  Globe,
  Bookmark,
  Award,
  Check,
  Phone,
  Layers,
  Calendar,
  ShieldCheck,
  Search,
  ExternalLink,
  Trophy,
  Table,
  Cpu
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const LOGO = 'https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg';
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/GQ5YjNGImPiDJojFu93nfi?s=cl&p=a&mlu=4&ilr=4&iam=0';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-24 right-4 sm:right-6 z-[300] max-w-md p-4 bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-start gap-3 rounded-2xl"
    >
      <div className="p-1 text-white bg-white/10 rounded-full shrink-0 mt-0.5">
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="flex-1 pr-2">
        <p className="text-[10px] text-slate-300 uppercase tracking-widest mb-0.5 font-bold font-mono">
          {type === 'success' ? 'SUCCESS' : 'NOTICE'}
        </p>
        <p className="text-sm font-medium text-white leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default function SynapseHack() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('stages');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminRegistrations, setAdminRegistrations] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [savedBookmark, setSavedBookmark] = useState(false);

  const isManualScrollRef = useRef(false);

  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    scholarId: '',
    leaderYear: '1st Year',
    contactNumber: '',
    collegeName: 'NIT Silchar',
    department: 'Computer Science & Engineering',
    teamSize: '3',
    members: [
      { name: '', scholarId: '', year: '1st Year' },
      { name: '', scholarId: '', year: '1st Year' }
    ],
    pptLink: '',
    ideaSummary: '',
    additionalSensor: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        leaderName: profile.full_name || prev.leaderName,
        scholarId: profile.scholar_id || prev.scholarId,
        contactNumber: profile.phone || prev.contactNumber
      }));

      const adminStatus =
        profile.role === 'admin' ||
        profile.is_admin === true ||
        profile.admin === true ||
        (profile.email && profile.email.includes('admin')) ||
        (user?.email && user.email.includes('admin'));
      setIsAdmin(adminStatus);
    }
  }, [profile, user]);

  useEffect(() => {
    if (user) {
      checkRegistrationStatus();
    }
  }, [user]);

  const checkRegistrationStatus = async () => {
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_slug', 'synapse-hack')
        .single();

      if (data) {
        setIsRegistered(true);
        setRegistrationData(data.form_data);
      }
    } catch (_err) {
      // User not registered
    }
  };

  useEffect(() => {
    const sections = ['stages', 'details', 'dates', 'hardware', 'faqs'];

    const handleScroll = () => {
      if (isManualScrollRef.current) return;

      const scrollPosition = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    isManualScrollRef.current = true;

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);
  };

  const fetchAdminRegistrations = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_slug', 'synapse-hack')
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setAdminRegistrations(data || []);
      setIsAdminModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch admin registrations:', err);
      setToast({ message: 'Failed to load live registrations.', type: 'error' });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleTeamSizeChange = (newSize) => {
    const sizeNum = parseInt(newSize, 10);
    const neededMembers = sizeNum - 1;
    let updatedMembers = [...formData.members];

    if (updatedMembers.length < neededMembers) {
      while (updatedMembers.length < neededMembers) {
        updatedMembers.push({ name: '', scholarId: '', year: '1st Year' });
      }
    } else if (updatedMembers.length > neededMembers) {
      updatedMembers = updatedMembers.slice(0, neededMembers);
    }

    setFormData({
      ...formData,
      teamSize: newSize,
      members: updatedMembers
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members];
    updated[index][field] = value;
    setFormData({ ...formData, members: updated });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setToast({ message: 'Please sign in to register your team.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        event_slug: 'synapse-hack',
        event_name: 'SynapseHack - Tecnoesis 2026',
        form_data: {
          ...formData,
          leaderEmail: user.email,
          registeredAt: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('event_registrations')
        .insert([payload]);

      if (error) {
        if (error.code === '23505') {
          setToast({ message: 'Your account has already registered a team for SynapseHack.', type: 'error' });
          setIsRegistered(true);
          setIsRegisterModalOpen(false);
        } else {
          throw error;
        }
      } else {
        setIsRegistered(true);
        setRegistrationData(payload.form_data);
        setIsRegisterModalOpen(false);
        setToast({ message: 'Registration submitted! Please join the WhatsApp group below.', type: 'success' });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setToast({ message: 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_slug', 'synapse-hack');

      if (error) throw error;
      if (!data || data.length === 0) {
        setToast({ message: 'No registrations found to export.', type: 'error' });
        return;
      }

      const headers = [
        'Team Name',
        'Leader Name',
        'Leader Email',
        'Leader Scholar ID',
        'Leader Year',
        'Contact Number',
        'College',
        'Team Size',
        'PPT Link',
        'Idea Summary',
        'Additional Sensor',
        'Members',
        'Registered At'
      ];

      const csvRows = [
        headers.join(','),
        ...data.map(reg => {
          const f = reg.form_data || {};
          const membersStr = (f.members || [])
            .map(m => `${m.name} (${m.scholarId || 'N/A'}, ${m.year || 'N/A'})`)
            .join(' | ');
          return [
            `"${f.teamName || ''}"`,
            `"${f.leaderName || ''}"`,
            `"${f.leaderEmail || ''}"`,
            `"${f.scholarId || ''}"`,
            `"${f.leaderYear || ''}"`,
            `"${f.contactNumber || ''}"`,
            `"${f.collegeName || ''}"`,
            `"${f.teamSize || ''}"`,
            `"${f.pptLink || ''}"`,
            `"${(f.ideaSummary || '').replace(/"/g, '""')}"`,
            `"${f.additionalSensor || ''}"`,
            `"${membersStr}"`,
            `"${new Date(reg.registered_at).toLocaleString()}"`
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvRows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SYNAPSEHACK_REGISTRATIONS_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (_err) {
      setToast({ message: 'Failed to export CSV.', type: 'error' });
    }
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'SynapseHack - Tecnoesis 2026',
          text: 'Join SynapseHack: 36-Hour Software + Hardware Hackathon organized by Computer Science Society, NIT Silchar! Prize Pool: ₹4,000.',
          url: window.location.href
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Event link copied to clipboard!', type: 'success' });
    }
  };

  const filteredRegistrations = adminRegistrations.filter(reg => {
    const f = reg.form_data || {};
    const query = adminSearch.toLowerCase();
    return (
      (f.teamName && f.teamName.toLowerCase().includes(query)) ||
      (f.leaderName && f.leaderName.toLowerCase().includes(query)) ||
      (f.scholarId && f.scholarId.toLowerCase().includes(query)) ||
      (f.contactNumber && f.contactNumber.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 selection:bg-slate-900 selection:text-white pb-28 font-sans">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* UNSTOP STICKY TAB BAR */}
      <div className="sticky top-[76px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'stages', label: 'Stages & Timeline' },
              { id: 'details', label: 'Details' },
              { id: 'dates', label: 'Dates & Deadlines' },
              { id: 'hardware', label: 'Hardware & Rules' },
              { id: 'faqs', label: 'FAQs & Contacts' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative py-2.5 px-4 text-xs font-semibold tracking-tight whitespace-nowrap transition-colors rounded-full ${activeTab === tab.id
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="unstopActiveTabUnderline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-slate-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchAdminRegistrations}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-purple-900 text-white rounded-full hover:bg-purple-800 transition-colors shadow-xs"
              >
                <Table size={12} /> LIVE REGISTRATIONS
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <Download size={12} /> EXPORT CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* HERO BANNER IMAGE (MOBILE & DESKTOP RESPONSIVE) */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950">
          {/* Mobile Banner */}
          <img
            src="/images/synapsehackMobile.png"
            alt="SynapseHack Poster Banner Mobile"
            className="w-full h-auto max-h-[500px] object-cover object-top sm:hidden"
          />
          {/* Desktop Banner */}
          <img
            src="/images/synapseHack.png"
            alt="SynapseHack Poster Banner Desktop"
            className="w-full h-auto max-h-[440px] object-cover object-center hidden sm:block"
          />
        </div>

        {/* POST REGISTRATION SUCCESS WHATSAPP BANNER */}
        {isRegistered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-emerald-950 text-white border border-emerald-500/40 rounded-2xl sm:rounded-3xl shadow-md space-y-3"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>TEAM REGISTRATION CONFIRMED</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Team: {registrationData?.teamName || 'REGISTERED'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Mandatory Step: Please join the official SynapseHack WhatsApp Group now to receive hardware allocation lists, evaluation room numbers, and updates.
              </p>
            </div>
            <a
              href={WHATSAPP_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
            >
              <FaWhatsapp size={18} />
              <span>JOIN OFFICIAL WHATSAPP GROUP NOW</span>
            </a>
          </motion.div>
        )}

        {/* COMPETITION HEADER TITLE CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Desktop Header Badges */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-full border border-amber-200 flex items-center gap-1">
                <Trophy size={13} /> PRIZE POOL: ₹4,000
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-800 text-[11px] font-semibold rounded-full border border-purple-200">
                OPEN TO ALL B.TECH (1ST - 4TH YEAR, ALL BRANCHES)
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] rounded-full font-semibold border border-slate-200">
                SOFTWARE / ML + HARDWARE
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] rounded-full font-semibold border border-emerald-200">
                FREE HARDWARE KIT
              </span>
            </div>

            {/* Mobile Header Badges (Compact, Sleek & Uncluttered) */}
            <div className="flex sm:hidden flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[9px] font-extrabold font-mono rounded-md border border-amber-200 flex items-center gap-1">
                <Trophy size={10} /> ₹4,000 PRIZE POOL
              </span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-900 text-[9px] font-bold font-mono rounded-md border border-purple-200">
                1ST - 4TH YEAR B.TECH
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-bold font-mono rounded-md border border-slate-200">
                SW/ML + HW
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 text-[9px] font-bold font-mono rounded-md border border-emerald-200">
                FREE HARDWARE KIT
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                SynapseHack 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Computer Science Society, NIT Silchar | Tecnoesis 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-slate-800" />
                <span>Team Size: <strong className="text-slate-900 font-semibold">2 - 4 Members</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-slate-800" />
                <span>Venue: <strong className="text-slate-900 font-semibold">NIT Silchar Campus</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setSavedBookmark(!savedBookmark);
                setToast({
                  message: !savedBookmark ? 'Saved to bookmarks' : 'Removed bookmark',
                  type: 'success'
                });
              }}
              className="p-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
              title="Bookmark Event"
            >
              <Bookmark size={18} className={savedBookmark ? 'fill-slate-900 text-slate-900' : ''} />
            </button>
            <button
              onClick={shareEvent}
              className="p-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
              title="Share Event"
            >
              <Share2 size={18} />
            </button>

            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-black border border-slate-200 rounded-2xl flex items-center justify-center p-2.5 shrink-0 shadow-xs">
              <img src={LOGO} alt="CSS Logo" className="w-full h-full rounded-full " />
            </div>
          </div>
        </div>

        {/* TWO COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-10">
            {/* STAGES & TIMELINE SECTION */}
            <section id="stages" className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Stages and Timelines</h3>
                <span className="text-xs text-slate-400 font-mono">3 ROUNDS</span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {/* Round 0 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    0
                  </div>

                  <div className="text-xs font-semibold text-slate-500 font-mono">
                    10 OCT 2026 – 27 OCT 2026, EOD
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-white transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <h4 className="text-base font-bold text-slate-900">
                        ROUND 0 — PPT SHORTLISTING
                      </h4>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> LIVE
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Teams will submit a PPT presenting their proposed idea based on the hardware components provided by the organizers. The submitted ideas will be evaluated, and selected teams will advance to the first on-ground round.
                    </p>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between font-medium">
                      <span>Submission Cutoff: 27 October, EOD</span>
                      <FileText size={15} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Round 1 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    1
                  </div>

                  <div className="text-xs font-semibold text-slate-500 font-mono">
                    DAY 1 OF TECNOESIS 2026
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-white transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <h4 className="text-base font-bold text-slate-900">
                        ROUND 1 — IDEA PRESENTATION
                      </h4>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200">
                        ON-GROUND
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Shortlisted teams will present their ideas before the judges on Day 1 of Tecnoesis 2026 at NIT Silchar. The presentation will focus on:
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                      <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                        <Check size={14} className="text-emerald-600 shrink-0" /> Innovation and uniqueness
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                        <Check size={14} className="text-emerald-600 shrink-0" /> Problem & proposed solution
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                        <Check size={14} className="text-emerald-600 shrink-0" /> Feasibility & hardware use
                      </li>
                      <li className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                        <Check size={14} className="text-emerald-600 shrink-0" /> Potential real-world impact
                      </li>
                    </ul>

                    <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Award size={16} className="text-purple-700 shrink-0" />
                      <span>Teams qualifying this round will receive the required hardware components free of cost!</span>
                    </div>
                  </div>
                </div>

                {/* Round 2 */}
                <div className="relative space-y-2">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    2
                  </div>

                  <div className="text-xs font-semibold text-slate-500 font-mono">
                    DAY 1 → DAY 3 OF TECNOESIS 2026
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:bg-white transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <h4 className="text-base font-bold text-slate-900">
                        ROUND 2 — BUILD & FINAL DEMO
                      </h4>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200">
                        36-HOUR BUILD
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Selected teams will get 36 hours to build and implement their solution using the provided hardware. Teams can additionally use one extra sensor of their choice, which they must arrange themselves.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      The completed prototypes will be presented and demonstrated before the judges on Day 3 of Tecnoesis 2026.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* DETAILS & CHALLENGE SECTION */}
            <section id="details" className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">About SynapseHack & The Challenge</h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold text-slate-900">About SynapseHack</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  SynapseHack is a 36-hour open-ended Software + Hardware hackathon where teams are free to identify a problem and build their own innovative solution.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  There are no predefined problem statements. Instead, teams will receive a list of hardware components that will be provided by the organizers. Teams must design their solution around these components, with the freedom to add one additional sensor of their choice.
                </p>
              </div>

              <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
                <span className="text-purple-300 font-mono text-xs font-semibold uppercase block">THE CHALLENGE</span>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  No problem statements. No fixed solutions.
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  You decide what problem to solve, how to solve it, and what to build. The only constraints are:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200 pt-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>Organizer-provided hardware components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>One additional sensor of your choice (arranged by your team)</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* DATES & DEADLINES SECTION WITH ROADMAP TIMELINE */}
            <section id="dates" className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dates & Deadlines</h3>
                  <p className="text-xs text-slate-500 font-medium">SynapseHack Event Roadmap</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                  ROADMAP
                </span>
              </div>

              {/* ROADMAP CONNECTED TIMELINE NODES */}
              <div className="relative pl-7 sm:pl-9 space-y-6 sm:space-y-8 before:content-[''] before:absolute before:left-3.5 sm:before:left-4 before:top-3.5 before:bottom-3.5 before:w-0.5 before:bg-slate-200">
                {[
                  {
                    step: '01',
                    date: '10 October 2026',
                    title: 'Registrations Open',
                    desc: 'Portal officially opens for team registrations and idea ppt submissions.',
                    tag: 'PORTAL OPEN',
                    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  },
                  {
                    step: '02',
                    date: '27 October 2026, EOD',
                    title: 'Registrations Close & PPT Cutoff',
                    desc: 'Final deadline to register team and upload initial Round 0 PPT.',
                    tag: 'DEADLINE',
                    statusColor: 'bg-rose-100 text-rose-800 border-rose-200'
                  },
                  {
                    step: '03',
                    date: 'Day 1 of Tecnoesis 2026',
                    title: 'Idea Presentation & Hardware Allocation',
                    desc: 'Shortlisted teams present ideas to judges; qualifying teams get free hardware kits.',
                    tag: 'DAY 1 ON-GROUND',
                    statusColor: 'bg-purple-100 text-purple-900 border-purple-200'
                  },
                  {
                    step: '04',
                    date: 'Day 1 → Day 3 of Tecnoesis 2026',
                    title: '36-Hour Hackathon Build',
                    desc: '36-hour prototyping and software + hardware integration phase.',
                    tag: '36-HR BUILD',
                    statusColor: 'bg-amber-100 text-amber-900 border-amber-200'
                  },
                  {
                    step: '05',
                    date: 'Day 3 of Tecnoesis 2026',
                    title: 'Final Demonstration & Judging',
                    desc: 'Live working prototype demonstration before judging panel & winner announcement.',
                    tag: 'DAY 3 FINALE',
                    statusColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative space-y-1.5 group">
                    <div className="absolute -left-7 sm:-left-9 top-0.5 w-7 h-7 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs font-mono group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono tracking-tight">
                        {item.date}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border ${item.statusColor}`}>
                        {item.tag}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-colors space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HARDWARE & RULES SECTION */}
            <section id="hardware" className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Hardware & Guidelines</h3>
                <span className="text-xs text-slate-400 font-mono">KIT DETAILS</span>
              </div>

              {/* SPECIAL HARDWARE SPONSOR & ORGANIZER FEATURE CALLOUT */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl sm:rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-amber-400 shrink-0" size={20} />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                      OFFICIAL HARDWARE PROVIDER & SPONSORS
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold rounded-full">
                    FREE TO QUALIFIED TEAMS
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Computer Science Society & Tecnoesis 2026 | NIT Silchar
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  All official hardware component kits are proudly sponsored and provided free of cost by the <strong className="text-white">Computer Science Society (CSS)</strong> in collaboration with <strong className="text-white">Tecnoesis 2026</strong> for all teams advancing past Round 0.
                </p>
              </div>

              {/* ORGANIZER-PROVIDED HARDWARE LIST (ONLY COMPONENT NAMES) */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Cpu size={16} className="text-slate-800 shrink-0" />
                    <span>Included Components Kit</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Teams will construct their project using these organizer-provided components (plus 1 optional additional sensor of choice):
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {[
                    'ESP32 Microcontroller',
                    'DHT Sensor',
                    'IR Sensor',
                    'PIR Sensor',
                    'HC-SR04 Sensor',
                    'Soil Moisture Sensor',
                    'MPU6050 Sensor',
                    'Breadboard',
                    'Jumper Wires',
                    'USB Data Cable'
                  ].map((hwName, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200/90 rounded-xl flex items-center gap-2 shadow-2xs hover:border-slate-400 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                      <p className="font-bold text-slate-900 text-xs truncate" title={hwName}>
                        {hwName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RULES & GUIDELINES LIST */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">Official Guidelines & Policies</h4>
                <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span>Teams must consist of 2 to 4 members.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span><strong className="text-purple-950 bg-purple-100 px-2 py-0.5 rounded font-bold">ELIGIBILITY: OPEN TO ALL B.TECH STUDENTS (1ST TO 4TH YEAR, ALL BRANCHES). CROSS-YEAR & CROSS-BRANCH TEAMS ALLOWED.</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span><strong className="text-slate-900 font-bold">SOFTWARE INTEGRATION IS MUST:</strong> Solutions must combine hardware components with functional software (e.g. ML integration, web dashboard, mobile app, cloud backend, or IoT analytics).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span>Organizer-provided hardware components will be distributed free of cost to qualifying teams following Round 1 presentation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span>Teams are allowed to bring and integrate <strong className="text-slate-900 font-bold">one additional sensor</strong> of their choice.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span><strong className="text-slate-900 font-bold">ACTUATORS:</strong> Actuators will be provided upon request, subject to availability and feasibility.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span><strong className="text-rose-950 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">COMPONENT CARE & RETURN:</strong> Any damage caused to any provided component must be reimbursed, and all organizer-provided hardware parts must be returned after the hackathon.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span><strong className="text-emerald-950 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">E-CERTIFICATES:</strong> Official E-Certificates will be provided to all participants who qualify Round 0 (PPT Shortlisting).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2 shrink-0" />
                    <span>Decision of judges will be final and binding.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQS & ORGANIZER CONTACTS SECTION */}
            <section id="faqs" className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">FAQs & Event Contacts</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">ORGANIZER</span>
                    <p className="font-bold text-slate-900 text-base">NILABH SARMAH</p>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">88224 80679</p>
                  </div>
                  <a
                    href="tel:8822480679"
                    className="p-3 bg-white hover:bg-slate-900 hover:text-white transition-colors border border-slate-200 rounded-full shadow-xs text-slate-700"
                    title="Call Nilabh"
                  >
                    <Phone size={16} />
                  </a>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">ORGANIZER</span>
                    <p className="font-bold text-slate-900 text-base">NIBIR DEKA</p>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">88228 37774</p>
                  </div>
                  <a
                    href="tel:8822837774"
                    className="p-3 bg-white hover:bg-slate-900 hover:text-white transition-colors border border-slate-200 rounded-full shadow-xs text-slate-700"
                    title="Call Nibir"
                  >
                    <Phone size={16} />
                  </a>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Official SynapseHack Community</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Join the official WhatsApp group for updates and queries.</p>
                </div>
                <a
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-2 shrink-0"
                >
                  <FaWhatsapp size={15} />
                  <span>JOIN GROUP</span>
                </a>
              </div>
            </section>
          </div>

          {/* UNSTOP RIGHT STICKY SIDEBAR */}
          <div className="lg:col-span-4 sticky top-[140px] space-y-4">
            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-slate-900 text-white text-[10px] font-mono font-bold px-3.5 py-1 rounded-br-xl uppercase">
                REGISTRATION OPEN
              </div>

              <div className="pt-5 border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">FEE</span>
                  <p className="text-xl font-extrabold text-slate-900">FREE</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono block">PRIZE POOL</span>
                  <p className="text-base font-extrabold text-amber-600 flex items-center gap-1 justify-end">
                    <Trophy size={14} /> ₹4,000
                  </p>
                </div>
              </div>

              {isRegistered ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 size={16} />
                    <span>TEAM REGISTERED</span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">
                    TEAM: {registrationData?.teamName || 'REGISTERED'}
                  </p>
                  <a
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FaWhatsapp size={16} />
                    <span>JOIN WHATSAPP GROUP</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (!user) {
                        setToast({ message: 'Please sign in to register your team.', type: 'error' });
                      } else {
                        setIsRegisterModalOpen(true);
                      }
                    }}
                    className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{user ? 'REGISTER NOW' : 'SIGN IN TO REGISTER'}</span>
                    <ArrowRight size={14} />
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-mono">
                    Free Hardware Kits provided to qualifying teams
                  </p>
                </div>
              )}

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Application Deadline</span>
                  <span className="font-semibold text-slate-900">27 Oct 2026, EOD</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Eligibility</span>
                  <span className="font-semibold text-purple-950 bg-purple-100 px-2 py-0.5 rounded text-[11px]">B.Tech 1st - 4th Year (All Branches)</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Organizer</span>
                  <span className="font-semibold text-slate-900">CSS NIT Silchar</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Fest</span>
                  <span className="font-semibold text-slate-900">Tecnoesis '26</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
              <div>
                <p className="text-xs font-bold text-slate-900">Share Competition</p>
                <p className="text-[11px] text-slate-500">Invite teammates to join</p>
              </div>
              <button
                onClick={shareEvent}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-full text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Share2 size={13} /> SHARE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN LIVE REGISTRATIONS SPREADSHEET MODAL */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white border border-slate-200 p-6 shadow-2xl z-10 text-slate-900 rounded-3xl"
            >
              {/* Modal Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-bold rounded-full font-mono">
                      ADMIN LIVE DASHBOARD
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-full font-mono">
                      TOTAL TEAMS: {adminRegistrations.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    SynapseHack Live Registrations
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                      placeholder="Search team or scholar ID..."
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-full focus:outline-none focus:border-slate-900 w-52 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    <Download size={13} /> EXPORT CSV
                  </button>

                  <button
                    onClick={() => setIsAdminModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-x-auto overflow-y-auto mt-4 border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-900 text-white font-mono uppercase text-[10px] tracking-wider z-10">
                    <tr>
                      <th className="p-3 border-b border-slate-800">#</th>
                      <th className="p-3 border-b border-slate-800">Team Name</th>
                      <th className="p-3 border-b border-slate-800">Leader Name</th>
                      <th className="p-3 border-b border-slate-800">Scholar ID</th>
                      <th className="p-3 border-b border-slate-800">Year</th>
                      <th className="p-3 border-b border-slate-800">Contact Number</th>
                      <th className="p-3 border-b border-slate-800">Size</th>
                      <th className="p-3 border-b border-slate-800">PPT Link</th>
                      <th className="p-3 border-b border-slate-800">Members (Name, ID, Year)</th>
                      <th className="p-3 border-b border-slate-800">Idea Summary</th>
                      <th className="p-3 border-b border-slate-800">Sensor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-sans">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-8 text-center text-slate-400 italic">
                          No registrations found matching search query.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg, idx) => {
                        const f = reg.form_data || {};
                        const members = f.members || [];
                        return (
                          <tr key={reg.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{f.teamName || 'N/A'}</td>
                            <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{f.leaderName || 'N/A'}</td>
                            <td className="p-3 font-mono text-slate-700 whitespace-nowrap">{f.scholarId || 'N/A'}</td>
                            <td className="p-3 font-semibold text-purple-700 whitespace-nowrap">{f.leaderYear || '1st Year'}</td>
                            <td className="p-3 font-mono text-slate-700 whitespace-nowrap">{f.contactNumber || 'N/A'}</td>
                            <td className="p-3 font-mono font-bold text-slate-900">{f.teamSize || '3'}</td>
                            <td className="p-3 whitespace-nowrap">
                              {f.pptLink ? (
                                <a
                                  href={f.pptLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 underline"
                                >
                                  <span>View PPT</span>
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>
                            <td className="p-3 min-w-[220px]">
                              {members.length > 0 ? (
                                <ul className="space-y-1 text-[11px]">
                                  {members.map((m, mIdx) => (
                                    <li key={mIdx} className="text-slate-700">
                                      <strong>{m.name || 'Member'}</strong> ({m.scholarId || 'N/A'}, {m.year || '1st Year'})
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-slate-400">No extra members</span>
                              )}
                            </td>
                            <td className="p-3 min-w-[240px] text-slate-600 leading-snug line-clamp-2" title={f.ideaSummary}>
                              {f.ideaSummary || 'N/A'}
                            </td>
                            <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                              {f.additionalSensor || 'None'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTRATION MODAL FORM */}
      <AnimatePresence>
        {isRegisterModalOpen && !isRegistered && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-6 sm:p-10 shadow-2xl z-10 text-slate-900 rounded-3xl"
            >
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <div className="mb-6 border-b border-slate-100 pb-4">
                <p className="text-xs text-slate-400 font-mono mb-1">// REGISTRATION PORTAL</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Register Team for SynapseHack
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  TECNOESIS 2026 | Cross-Year (1st - 4th Year) & Cross-Branch Teams Allowed
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Team Name */}
                <div>
                  <label className="block mb-2 text-slate-600 font-mono text-xs">TEAM NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="Enter team name"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                  />
                </div>

                {/* Leader Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">TEAM LEADER NAME *</label>
                    <input
                      type="text"
                      required
                      value={formData.leaderName}
                      onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                      placeholder="Full Name"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">SCHOLAR ID / ROLL NO *</label>
                    <input
                      type="text"
                      required
                      value={formData.scholarId}
                      onChange={e => setFormData({ ...formData, scholarId: e.target.value })}
                      placeholder="Scholar ID"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Leader Year & Contact Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">LEADER ACADEMIC YEAR *</label>
                    <select
                      required
                      value={formData.leaderYear}
                      onChange={e => setFormData({ ...formData, leaderYear: e.target.value })}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">LEADER WHATSAPP / CONTACT NUMBER *</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="10-digit phone number"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-slate-600 font-mono text-xs">COLLEGE / INSTITUTION *</label>
                  <input
                    type="text"
                    required
                    value={formData.collegeName}
                    onChange={e => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-slate-600 font-mono text-xs">TOTAL TEAM SIZE (INCLUDING LEADER) *</label>
                  <select
                    value={formData.teamSize}
                    onChange={e => handleTeamSizeChange(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                  >
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                  </select>
                </div>

                {/* Mandatory Additional Team Members Fields */}
                <div className="space-y-4 pt-2">
                  <p className="text-xs font-mono text-slate-500">// ADDITIONAL TEAM MEMBERS (ALL FIELDS MANDATORY)</p>
                  {formData.members.map((member, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-slate-900">MEMBER {idx + 2} *</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Full Name *"
                          value={member.name}
                          onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                          className="p-3 bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs rounded-lg"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Scholar ID / Roll No *"
                          value={member.scholarId}
                          onChange={e => handleMemberChange(idx, 'scholarId', e.target.value)}
                          className="p-3 bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs rounded-lg"
                        />
                        <select
                          required
                          value={member.year || '1st Year'}
                          onChange={e => handleMemberChange(idx, 'year', e.target.value)}
                          className="p-3 bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900 text-xs rounded-lg"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">
                      PPT / IDEA PROPOSAL LINK (GOOGLE DRIVE / CANVA / ONEDRIVE) *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.pptLink}
                      onChange={e => setFormData({ ...formData, pptLink: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">BRIEF PROBLEM & PROPOSED SOLUTION SUMMARY *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.ideaSummary}
                      onChange={e => setFormData({ ...formData, ideaSummary: e.target.value })}
                      placeholder="Summarize the problem statement and proposed hardware solution architecture..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm resize-y rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-slate-600 font-mono text-xs">ONE ADDITIONAL SENSOR CHOICE (OPTIONAL)</label>
                    <input
                      type="text"
                      value={formData.additionalSensor}
                      onChange={e => setFormData({ ...formData, additionalSensor: e.target.value })}
                      placeholder="e.g. Ultrasonic Sensor / Heart Rate Sensor"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors text-sm rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="py-2.5 px-5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-full"
                  >
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 bg-slate-900 text-white text-xs font-semibold rounded-full hover:bg-slate-800 transition-colors"
                  >
                    {loading ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-500 font-mono block">PRIZE POOL</span>
          <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
            <Trophy size={13} /> ₹4,000
          </span>
        </div>
        {isRegistered ? (
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full shadow-xs flex items-center gap-2"
          >
            <FaWhatsapp size={16} />
            <span>JOIN WHATSAPP GROUP</span>
          </a>
        ) : (
          <button
            onClick={() => {
              if (!user) {
                setToast({ message: 'Please sign in to register your team.', type: 'error' });
              } else {
                setIsRegisterModalOpen(true);
              }
            }}
            className="py-2.5 px-6 bg-slate-900 text-white text-xs font-bold rounded-full shadow-xs"
          >
            <span>{user ? 'REGISTER NOW' : 'SIGN IN TO REGISTER'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
