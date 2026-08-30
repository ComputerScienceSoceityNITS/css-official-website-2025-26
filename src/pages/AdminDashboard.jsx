// pages/AdminDashboard.jsx - COMPACT UI VERSION
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { FaDownload, FaWhatsapp, FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaBars, FaTimes, FaGraduationCap, FaPlus, FaMinus, FaUsers, FaPhone, FaEnvelope, FaIdCard, FaCalendar, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [subEvents, setSubEvents] = useState({});
  const [subEventRegistrations, setSubEventRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSubEventForm, setShowSubEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [selectedParentEvent, setSelectedParentEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingSubEvent, setEditingSubEvent] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizer: '',
    status: 'Upcoming',
    section: 'Upcoming',
    slug: '',
    poster_url: '',
    whatsapp_group_link: '',
    date: '',
    max_participants: 100,
    requires_auth: true,
    is_direct_registration: true,
    is_cse_only: false,
    venue: '',
    event_flow: '',
    certificate_available: false,
    certificate_template_url: ''
  });

  const [subEventFormData, setSubEventFormData] = useState({
    name: '',
    description: '',
    slug: '',
    max_participants: 50,
    whatsapp_group_link: '',
    poster_url: '',
    is_cse_only: false,
    organizer: '',
    status: 'Upcoming',
    date: '',
    venue: '',
    event_flow: '',
    certificate_available: false,
    certificate_template_url: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const eventsSubscription = supabase
      .channel('events-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          fetchEvents();
        }
      )
      .subscribe();

    const userEventsSubscription = supabase
      .channel('user-events-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_events'
        },
        (payload) => {
          if (user) {
            fetchRegisteredEvents();
          }
        }
      )
      .subscribe();

    const subEventsSubscription = supabase
      .channel('sub-events-changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sub_events'
        },
        (payload) => {
          events.forEach(event => {
            if (!event.is_direct_registration) {
              fetchSubEvents(event.slug);
            }
          });
        }
      )
      .subscribe();

    return () => {
      eventsSubscription.unsubscribe();
      userEventsSubscription.unsubscribe();
      subEventsSubscription.unsubscribe();
    };
  }, [user, events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);

      if (data) {
        data.forEach(event => {
          if (!event.is_direct_registration) {
            fetchSubEvents(event.slug);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubEvents = async (parentSlug) => {
    try {
      const { data, error } = await supabase
        .from('sub_events')
        .select('*')
        .eq('parent_event_slug', parentSlug)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setSubEvents(prev => ({
        ...prev,
        [parentSlug]: data || []
      }));
    } catch (error) {
      console.error('Error fetching sub-events:', error);
    }
  };

  const fetchRegistrations = async (eventSlug) => {
    try {
      const { data: userEvents, error: userEventsError } = await supabase
        .from('user_events')
        .select('*')
        .eq('event_slug', eventSlug)
        .order('registered_at', { ascending: false });

      if (userEventsError) throw userEventsError;

      if (!userEvents || userEvents.length === 0) {
        setRegistrations(prev => ({
          ...prev,
          [eventSlug]: []
        }));
        return;
      }

      const userIds = userEvents.map(ue => ue.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const combinedData = userEvents.map(ue => {
        const userProfile = profiles?.find(p => p.user_id === ue.user_id);
        return {
          ...ue,
          profiles: userProfile || null
        };
      });

      setRegistrations(prev => ({
        ...prev,
        [eventSlug]: combinedData
      }));

    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Error fetching registrations: ' + error.message);
    }
  };

  const fetchSubEventRegistrations = async (parentSlug, subEventSlug) => {
    try {
      const fullEventSlug = `${parentSlug}-${subEventSlug}`;
      const { data: userEvents, error: userEventsError } = await supabase
        .from('user_events')
        .select('*')
        .eq('event_slug', fullEventSlug)
        .order('registered_at', { ascending: false });

      if (userEventsError) throw userEventsError;

      if (!userEvents || userEvents.length === 0) {
        setSubEventRegistrations(prev => ({
          ...prev,
          [fullEventSlug]: []
        }));
        return;
      }

      const userIds = userEvents.map(ue => ue.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const combinedData = userEvents.map(ue => {
        const userProfile = profiles?.find(p => p.user_id === ue.user_id);
        return {
          ...ue,
          profiles: userProfile || null
        };
      });

      setSubEventRegistrations(prev => ({
        ...prev,
        [fullEventSlug]: combinedData
      }));

    } catch (error) {
      console.error('Error fetching sub-event registrations:', error);
      alert('Error fetching sub-event registrations: ' + error.message);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          created_by: user.id,
          is_active: true,
          current_participants: 0
        }])
        .select();

      if (error) throw error;

      alert('Event created successfully!');
      setShowCreateForm(false);
      resetForm();
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id);

      if (error) throw error;

      alert('Event updated successfully!');
      setEditingEvent(null);
      resetForm();
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));

    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      organizer: '',
      status: 'Upcoming',
      section: 'Upcoming',
      slug: '',
      poster_url: '',
      whatsapp_group_link: '',
      date: '',
      max_participants: 100,
      requires_auth: true,
      is_direct_registration: true,
      is_cse_only: false,
      venue: '',
      event_flow: '',
      certificate_available: false,
      certificate_template_url: ''
    });
  };

  const resetSubEventForm = () => {
    setSubEventFormData({
      name: '',
      description: '',
      slug: '',
      max_participants: 50,
      whatsapp_group_link: '',
      poster_url: '',
      is_cse_only: false,
      organizer: '',
      status: 'Upcoming',
      date: '',
      venue: '',
      event_flow: '',
      certificate_available: false,
      certificate_template_url: ''
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      organizer: event.organizer,
      status: event.status,
      section: event.section,
      slug: event.slug,
      poster_url: event.poster_url,
      whatsapp_group_link: event.whatsapp_group_link,
      date: event.date ? event.date.split('+')[0] : '',
      max_participants: event.max_participants,
      requires_auth: event.requires_auth,
      is_direct_registration: event.is_direct_registration,
      is_cse_only: event.is_cse_only,
      venue: event.venue || '',
      event_flow: event.event_flow || '',
      certificate_available: event.certificate_available || false,
      certificate_template_url: event.certificate_template_url || ''
    });
  };

  const handleEditSubEvent = (subEvent, parentEvent) => {
    setEditingSubEvent(subEvent);
    setSelectedParentEvent(parentEvent);
    setSubEventFormData({
      name: subEvent.name,
      description: subEvent.description,
      slug: subEvent.slug,
      max_participants: subEvent.max_participants,
      whatsapp_group_link: subEvent.whatsapp_group_link,
      poster_url: subEvent.poster_url,
      is_cse_only: subEvent.is_cse_only,
      organizer: subEvent.organizer || parentEvent.organizer,
      status: subEvent.status || 'Upcoming',
      date: subEvent.date ? subEvent.date.split('+')[0] : '',
      venue: subEvent.venue || '',
      event_flow: subEvent.event_flow || '',
      certificate_available: subEvent.certificate_available || false,
      certificate_template_url: subEvent.certificate_template_url || ''
    });
    setShowSubEventForm(true);
  };

  const handleUpdateSubEvent = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('sub_events')
        .update(subEventFormData)
        .eq('id', editingSubEvent.id);

      if (error) throw error;

      alert('Sub-event updated successfully!');
      setShowSubEventForm(false);
      setEditingSubEvent(null);
      setSelectedParentEvent(null);
      resetSubEventForm();
      fetchSubEvents(selectedParentEvent.slug);
    } catch (error) {
      console.error('Error updating sub-event:', error);
      alert('Failed to update sub-event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations and sub-events for this event.')) return;

    try {
      const eventToDelete = events.find(e => e.id === eventId);
      if (!eventToDelete) {
        console.error('❌ Event not found in local state');
        alert('Event not found!');
        return;
      }

      const eventSlug = eventToDelete.slug;

      if (eventSlug) {
        const { error: subEventError } = await supabase
          .from('sub_events')
          .delete()
          .eq('parent_event_slug', eventSlug);

        if (subEventError) {
          console.error('❌ Error deleting sub-events:', subEventError);
        }

        const { error: regError } = await supabase
          .from('user_events')
          .delete()
          .eq('event_slug', eventSlug);

        if (regError) {
          console.error('❌ Error deleting registrations:', regError);
        }
      }

      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .select();

      if (error) {
        console.error('❌ Error deleting event:', error);
        throw error;
      }

      setEvents(prevEvents => {
        const newEvents = prevEvents.filter(event => event.id !== eventId);
        return newEvents;
      });

      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(null);
        setRegistrations(prev => {
          const newRegistrations = { ...prev };
          delete newRegistrations[eventSlug];
          return newRegistrations;
        });
      }

      window.dispatchEvent(new CustomEvent('eventDeleted', {
        detail: { eventId, eventSlug }
      }));
      alert('Event and all related data deleted successfully!');

    } catch (error) {
      console.error('💥 Error in handleDeleteEvent:', error);
      alert('Failed to delete event: ' + error.message);
      fetchEvents();
    }
  };

  const handleToggleEvent = async (eventId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      alert(`Event ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchEvents();
      window.dispatchEvent(new CustomEvent('eventsUpdated'));
    } catch (error) {
      console.error('Error toggling event:', error);
      alert('Failed to update event: ' + error.message);
    }
  };

  const handleCreateSubEvent = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('sub_events')
        .insert([{
          ...subEventFormData,
          parent_event_slug: selectedParentEvent.slug,
          current_participants: 0,
          organizer: subEventFormData.organizer || selectedParentEvent.organizer
        }])
        .select();

      if (error) throw error;

      alert('Sub-event created successfully!');
      setShowSubEventForm(false);
      resetSubEventForm();
      fetchSubEvents(selectedParentEvent.slug);
    } catch (error) {
      console.error('Error creating sub-event:', error);
      alert('Failed to create sub-event: ' + error.message);
    }
  };

  const handleDeleteSubEvent = async (subEventId, parentSlug) => {
    if (!confirm('Are you sure you want to delete this sub-event? This will also delete all registrations for this sub-event.')) return;

    try {
      const { data: subEvent } = await supabase
        .from('sub_events')
        .select('slug')
        .eq('id', subEventId)
        .single();

      if (subEvent) {
        const fullEventSlug = `${parentSlug}-${subEvent.slug}`;
        const { error: regError } = await supabase
          .from('user_events')
          .delete()
          .eq('event_slug', fullEventSlug);

        if (regError) {
          console.error('Error deleting sub-event registrations:', regError);
        }
      }

      const { error } = await supabase
        .from('sub_events')
        .delete()
        .eq('id', subEventId);

      if (error) throw error;

      alert('Sub-event deleted successfully!');
      fetchSubEvents(parentSlug);
    } catch (error) {
      console.error('Error deleting sub-event:', error);
      alert('Failed to delete sub-event: ' + error.message);
    }
  };

  const handleToggleSubEvent = async (subEventId, currentStatus, parentSlug) => {
    try {
      const { error } = await supabase
        .from('sub_events')
        .update({ is_active: !currentStatus })
        .eq('id', subEventId);

      if (error) throw error;

      alert(`Sub-event ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchSubEvents(parentSlug);
    } catch (error) {
      console.error('Error toggling sub-event:', error);
      alert('Failed to update sub-event: ' + error.message);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const exportRegistrations = (eventSlug, isSubEvent = false) => {
    const registrationsData = isSubEvent
      ? subEventRegistrations[eventSlug] || []
      : registrations[eventSlug] || [];

    const csvContent = [
      ['Name', 'Scholar ID', 'Email', 'Phone', 'Branch', 'Year', 'Registration Date', 'Status'],
      ...registrationsData.map(reg => [
        reg.profiles?.full_name || 'N/A',
        reg.profiles?.scholar_id || 'N/A',
        reg.profiles?.email || 'N/A',
        reg.profiles?.phone || 'N/A',
        reg.profiles?.branch || 'N/A',
        reg.profiles?.year || 'N/A',
        new Date(reg.registered_at).toLocaleDateString(),
        reg.attendance_status || 'registered'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${eventSlug}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const updateAttendanceStatus = async (registrationId, status, isSubEvent = false) => {
    try {
      const { error } = await supabase
        .from('user_events')
        .update({ attendance_status: status })
        .eq('id', registrationId);

      if (error) throw error;

      if (selectedEvent && !isSubEvent) {
        fetchRegistrations(selectedEvent.slug);
      } else if (selectedSubEvent && selectedParentEvent) {
        fetchSubEventRegistrations(selectedParentEvent.slug, selectedSubEvent.slug);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance status');
    }
  };

  const toggleExpandEvent = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const viewSubEventRegistrations = (subEvent, parentEvent) => {
    setSelectedSubEvent(subEvent);
    setSelectedParentEvent(parentEvent);
    setActiveTab('registrations');
    fetchSubEventRegistrations(parentEvent.slug, subEvent.slug);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arch-line mx-auto mb-4"></div>
          <p className="text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arch-bg text-arch-ink p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-arch-ink" >
              Admin Dashboard
            </h1>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-arch-ink hover:bg-arch-ink transition-colors hover:text-arch-bg"
            >
              {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <button
              onClick={() => { window.location.href = '/welcome-story?preview=true'; }}
              className="bg-arch-card text-arch-ink border border-arch-line font-semibold py-2 px-4 transition-all flex items-center gap-2 justify-center text-sm hover:border-arch-ink cursor-pointer"
            >
              ✨ Welcome Story
            </button>
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowCreateForm(true);
                resetForm();
              }}
              className="bg-arch-card text-arch-ink font-semibold py-2 px-4 transition-all flex items-center gap-2 justify-center text-sm cursor-pointer"
            >
              <FaPlus size={14} />
              New Event
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex space-x-1 mb-6 bg-arch-bg-alt p-1   ${mobileMenuOpen ? 'flex-col space-y-1' : 'flex-row'}   sm:flex-row sm:space-y-0`}>
          <button
            onClick={() => {
              setActiveTab('events');
              setMobileMenuOpen(false);
              setSelectedEvent(null);
              setSelectedSubEvent(null);
            }}
            className={`flex-1 px-3 py-2 font-medium transition-all text-sm   ${activeTab === 'events'
                ? 'bg-arch-ink text-arch-bg'
                : 'text-arch-ink-3 hover:text-arch-ink hover:bg-arch-bg-alt'
              }`}
          >
            📅 Manage Events
          </button>
          <button
            onClick={() => {
              setActiveTab('registrations');
              setMobileMenuOpen(false);
            }}
            className={`flex-1 px-3 py-2 font-medium transition-all text-sm   ${activeTab === 'registrations'
                ? 'bg-arch-ink text-arch-bg'
                : 'text-arch-ink-3 hover:text-arch-ink hover:bg-arch-bg-alt'
              }`}
          >
            👥 View Registrations
          </button>
        </div>

        {/* Create/Edit Event Modal */}
        {(showCreateForm || editingEvent) && (
          <div className="fixed inset-0 bg-arch-card flex items-center justify-center z-50 p-4">
            <div className="bg-arch-card border border-arch-line p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-arch-ink mb-4">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Event Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: editingEvent ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Slug *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      disabled={editingEvent}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-arch-ink mb-2 text-sm sm:text-base">Description *</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Organizer *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Status *</label>
                    <select
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Category/Section *</label>
                    <select
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming Only</option>
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Yearly">Yearly (Flagship)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Date *</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Poster URL</label>
                    <input
                      type="url"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.poster_url}
                      onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">WhatsApp Group Link *</label>
                    <input
                      type="url"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.whatsapp_group_link}
                      onChange={(e) => setFormData({ ...formData, whatsapp_group_link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Max Participants</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Venue *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="e.g. CSE Dept Seminar Hall"
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm sm:text-base">Event Flow / Detailed Timeline</label>
                    <textarea
                      rows="3"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm sm:text-base"
                      value={formData.event_flow}
                      onChange={(e) => setFormData({ ...formData, event_flow: e.target.value })}
                      placeholder="List event flow or rules... (Supports newlines)"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-arch-line pt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requires_auth"
                      className="mr-2"
                      checked={formData.requires_auth}
                      onChange={(e) => setFormData({ ...formData, requires_auth: e.target.checked })}
                    />
                    <label htmlFor="requires_auth" className="text-arch-ink text-sm sm:text-base">
                      Requires Authentication
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_direct_registration"
                      className="mr-2"
                      checked={formData.is_direct_registration}
                      onChange={(e) => setFormData({ ...formData, is_direct_registration: e.target.checked })}
                    />
                    <label htmlFor="is_direct_registration" className="text-arch-ink text-sm sm:text-base">
                      Direct Registration (One-click register)
                    </label>
                  </div>
                  <p className="text-xs text-arch-ink-3 ml-6">
                    ✅ Checked: Users register directly from events page<br />
                    ❌ Unchecked: Users go to event details page for registration
                  </p>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_cse_only"
                      className="mr-2"
                      checked={formData.is_cse_only}
                      onChange={(e) => setFormData({ ...formData, is_cse_only: e.target.checked })}
                    />
                    <label htmlFor="is_cse_only" className="text-arch-ink text-sm sm:text-base">
                      CSE Students Only
                    </label>
                  </div>
                  <p className="text-xs text-arch-ink-3 ml-6">
                    ✅ Checked: Only @cse.nits.ac.in emails can register<br />
                    ❌ Unchecked: All college emails can register
                  </p>

                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="certificate_available"
                      className="mr-2"
                      checked={formData.certificate_available}
                      onChange={(e) => setFormData({ ...formData, certificate_available: e.target.checked })}
                    />
                    <label htmlFor="certificate_available" className="text-arch-ink text-sm sm:text-base font-semibold">
                      Enable Attendance Certificates
                    </label>
                  </div>
                  {formData.certificate_available && (
                    <div className="ml-6 mt-1">
                      <label className="block text-arch-ink mb-1 text-xs sm:text-sm">Certificate Template Image URL *</label>
                      <input
                        type="url"
                        required
                        className="w-full p-2 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-xs sm:text-sm"
                        value={formData.certificate_template_url}
                        onChange={(e) => setFormData({ ...formData, certificate_template_url: e.target.value })}
                        placeholder="https://example.com/certificate-template.png"
                      />
                      <p className="text-[10px] text-arch-ink-3 mt-1">
                        Provide a landscape certificate image template. The system will overlay the student's Name and Scholar ID automatically.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-arch-ink hover:bg-arch-ink text-arch-bg font-bold py-3 px-6 transition-all flex-1 text-sm sm:text-base hover:text-arch-bg"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    className="bg-arch-bg-alt hover:bg-arch-bg-alt text-arch-ink font-bold py-3 px-6 transition-all flex-1 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create/Edit Sub-event Modal */}
        {(showSubEventForm && selectedParentEvent) && (
          <div className="fixed inset-0 bg-arch-card flex items-center justify-center z-50 p-4">
            <div className="bg-arch-card border border-arch-line p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-arch-ink mb-4">
                {editingSubEvent ? 'Edit Sub-event' : 'Create Sub-event for'} {selectedParentEvent.name}
              </h2>
              <form onSubmit={editingSubEvent ? handleUpdateSubEvent : handleCreateSubEvent} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Sub-event Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.name}
                      onChange={(e) => {
                        setSubEventFormData({
                          ...subEventFormData,
                          name: e.target.value,
                          slug: editingSubEvent ? subEventFormData.slug : generateSlug(e.target.value)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Slug *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.slug}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, slug: e.target.value })}
                      disabled={editingSubEvent}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-arch-ink mb-2 text-sm">Description</label>
                  <textarea
                    rows="3"
                    className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                    value={subEventFormData.description}
                    onChange={(e) => setSubEventFormData({ ...subEventFormData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Organizer</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.organizer}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, organizer: e.target.value })}
                      placeholder={selectedParentEvent.organizer}
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Status</label>
                    <select
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.status}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, status: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Date</label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.date}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Poster URL</label>
                    <input
                      type="url"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.poster_url}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, poster_url: e.target.value })}
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Max Participants</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.max_participants}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">WhatsApp Link</label>
                    <input
                      type="url"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.whatsapp_group_link}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, whatsapp_group_link: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Venue *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.venue}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, venue: e.target.value })}
                      placeholder="e.g. CSE Dept Seminar Hall"
                    />
                  </div>
                  <div>
                    <label className="block text-arch-ink mb-2 text-sm">Event Flow / Detailed Timeline</label>
                    <textarea
                      rows="3"
                      className="w-full p-3 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-sm"
                      value={subEventFormData.event_flow}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, event_flow: e.target.value })}
                      placeholder="List event flow or rules... (Supports newlines)"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sub_event_cse_only"
                    className="mr-2"
                    checked={subEventFormData.is_cse_only}
                    onChange={(e) => setSubEventFormData({ ...subEventFormData, is_cse_only: e.target.checked })}
                  />
                  <label htmlFor="sub_event_cse_only" className="text-arch-ink text-sm">
                    CSE Students Only
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sub_event_certificate_available"
                      className="mr-2"
                      checked={subEventFormData.certificate_available}
                      onChange={(e) => setSubEventFormData({ ...subEventFormData, certificate_available: e.target.checked })}
                    />
                    <label htmlFor="sub_event_certificate_available" className="text-arch-ink text-sm font-semibold">
                      Enable Attendance Certificates
                    </label>
                  </div>
                  {subEventFormData.certificate_available && (
                    <div className="ml-6 mt-1">
                      <label className="block text-arch-ink mb-1 text-xs">Certificate Template Image URL *</label>
                      <input
                        type="url"
                        required
                        className="w-full p-2 bg-arch-bg-alt border border-arch-line focus:outline-none focus:border-arch-line text-xs"
                        value={subEventFormData.certificate_template_url}
                        onChange={(e) => setSubEventFormData({ ...subEventFormData, certificate_template_url: e.target.value })}
                        placeholder="https://example.com/certificate-template.png"
                      />
                      <p className="text-[10px] text-arch-ink-3 mt-1">
                        Provide a landscape certificate image template. The system will overlay the student's Name and Scholar ID automatically.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-arch-ink hover:bg-arch-ink text-arch-bg font-bold py-2 px-4 transition-all flex-1 hover:text-arch-bg"
                  >
                    {editingSubEvent ? 'Update Sub-event' : 'Create Sub-event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubEventForm(false);
                      setSelectedParentEvent(null);
                      setEditingSubEvent(null);
                      resetSubEventForm();
                    }}
                    className="bg-arch-bg-alt hover:bg-arch-bg-alt text-arch-ink font-bold py-2 px-4 transition-all flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Management Tab */}
        {activeTab === 'events' && (
          <div className="bg-arch-card border border-arch-line p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-arch-ink flex items-center gap-2">
                <FaCalendar className="text-arch-ink" />
                Manage Events
              </h2>
              <span className="text-xs text-arch-ink-3 bg-arch-bg-alt px-2 py-1 rounded-full">
                {events.length} {events.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-arch-bg-alt border border-arch-line p-4 hover:border-arch-line transition-all duration-200">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-arch-ink truncate">
                          {event.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium   ${event.is_active
                            ? 'bg-arch-ink text-arch-bg border border-arch-ink'
                            : 'bg-arch-ink text-arch-bg border border-arch-ink'
                          }`}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-arch-ink-3 text-xs">{event.organizer} • {event.status}</p>
                    </div>
                  </div>

                  {/* Event Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {!event.is_direct_registration && (
                      <span className="px-2 py-0.5 bg-arch-ink text-arch-bg text-xs border border-arch-ink">
                        Multi-Event
                      </span>
                    )}
                    {event.is_cse_only && (
                      <span className="px-2 py-0.5 bg-arch-ink text-arch-bg text-xs border border-arch-ink flex items-center gap-1">
                        <FaGraduationCap size={10} /> CSE Only
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-arch-ink text-arch-bg text-xs border border-arch-ink">
                      {event.organizer}
                    </span>
                  </div>

                  {/* Event Details */}
                  <p className="text-arch-ink-3 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-arch-ink-3 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-arch-ink">Slug:</span>
                      <code className="text-arch-ink truncate">{event.slug}</code>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers size={10} className="text-arch-ink" />
                      <span>{event.current_participants}/{event.max_participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendar size={10} className="text-arch-ink" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {event.whatsapp_group_link && (
                      <div className="flex items-center gap-1">
                        <FaWhatsapp size={10} className="text-arch-ink" />
                        <span className="text-arch-ink">WhatsApp</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-1 col-span-2">
                        <span className="text-arch-ink font-semibold">Venue:</span>
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-arch-line">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveTab('registrations');
                        fetchRegistrations(event.slug);
                      }}
                      className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1.5 px-2 text-xs transition-all flex items-center justify-center gap-1.5 font-medium hover:text-arch-bg"
                    >
                      <FaEye size={10} />
                      View
                    </button>
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1.5 px-2 text-xs transition-all flex items-center justify-center gap-1.5 font-medium hover:text-arch-bg"
                    >
                      <FaEdit size={10} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleEvent(event.id, event.is_active)}
                      className={`flex-1 py-1.5 px-2 text-xs transition-all flex items-center justify-center gap-1.5 font-medium   ${event.is_active
                          ? 'bg-arch-ink hover:bg-arch-ink hover:text-arch-bg'
                          : 'bg-arch-ink hover:bg-arch-ink hover:text-arch-bg'
                        }   text-arch-ink`}
                    >
                      {event.is_active ? <FaToggleOff size={10} /> : <FaToggleOn size={10} />}
                      {event.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1.5 px-2 text-xs transition-all flex items-center justify-center gap-1.5 font-medium hover:text-arch-bg"
                    >
                      <FaTrash size={10} />
                      Delete
                    </button>
                  </div>

                  {/* Sub-events Section */}
                  {!event.is_direct_registration && (
                    <div className="mt-3 pt-3 border-t border-arch-line">
                      <div className="flex justify-between items-center mb-2">
                        <button
                          onClick={() => toggleExpandEvent(event.id)}
                          className="text-arch-ink hover:text-arch-ink font-medium flex items-center gap-2 text-sm"
                        >
                          {expandedEvents[event.id] ? <FaMinus size={12} /> : <FaPlus size={12} />}
                          Sub-events ({(subEvents[event.slug] || []).length})
                        </button>
                        <button
                          onClick={() => {
                            setSelectedParentEvent(event);
                            setShowSubEventForm(true);
                            setEditingSubEvent(null);
                            resetSubEventForm();
                          }}
                          className="bg-arch-ink hover:bg-arch-ink text-arch-bg text-xs py-1 px-2 flex items-center gap-1 font-medium hover:text-arch-bg"
                        >
                          <FaPlus size={10} /> Add
                        </button>
                      </div>

                      {expandedEvents[event.id] && (
                        <div className="space-y-2">
                          {(subEvents[event.slug] || []).map(subEvent => (
                            <div key={subEvent.id} className="bg-arch-bg-alt border border-arch-line p-3 hover:border-arch-line transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-arch-ink text-sm truncate">{subEvent.name}</h4>
                                  <p className="text-arch-ink-3 text-xs mt-0.5 line-clamp-1">{subEvent.description}</p>
                                </div>
                                <span className={`px-1.5 py-0.5 text-xs   ${subEvent.is_active ? 'bg-arch-ink text-arch-bg' : 'bg-arch-ink text-arch-bg'
                                  }`}>
                                  {subEvent.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-arch-ink-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-arch-ink">{subEvent.slug}</span>
                                  <span>•</span>
                                  <span>{subEvent.current_participants}/{subEvent.max_participants}</span>
                                </div>
                                {subEvent.is_cse_only && (
                                  <span className="text-arch-ink flex items-center gap-0.5">
                                    <FaGraduationCap size={9} /> CSE
                                  </span>
                                )}
                              </div>
                              {subEvent.venue && (
                                <div className="text-xs text-arch-ink-3 mb-2 flex items-center gap-1">
                                  <span className="text-arch-ink font-semibold">Venue:</span>
                                  <span>{subEvent.venue}</span>
                                </div>
                              )}

                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => viewSubEventRegistrations(subEvent, event)}
                                  className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1 px-1.5 text-xs transition-all flex items-center justify-center gap-1 font-medium hover:text-arch-bg"
                                >
                                  <FaEye size={9} />
                                </button>
                                <button
                                  onClick={() => handleEditSubEvent(subEvent, event)}
                                  className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1 px-1.5 text-xs transition-all flex items-center justify-center gap-1 font-medium hover:text-arch-bg"
                                >
                                  <FaEdit size={9} />
                                </button>
                                <button
                                  onClick={() => handleToggleSubEvent(subEvent.id, subEvent.is_active, event.slug)}
                                  className={`flex-1 py-1 px-1.5 text-xs transition-all flex items-center justify-center gap-1 font-medium   ${subEvent.is_active
                                      ? 'bg-arch-ink hover:bg-arch-ink hover:text-arch-bg'
                                      : 'bg-arch-ink hover:bg-arch-ink hover:text-arch-bg'
                                    }   text-arch-ink`}
                                >
                                  {subEvent.is_active ? <FaToggleOff size={9} /> : <FaToggleOn size={9} />}
                                </button>
                                <button
                                  onClick={() => handleDeleteSubEvent(subEvent.id, event.slug)}
                                  className="flex-1 bg-arch-ink hover:bg-arch-ink text-arch-bg py-1 px-1.5 text-xs transition-all flex items-center justify-center gap-1 font-medium hover:text-arch-bg"
                                >
                                  <FaTrash size={9} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {(subEvents[event.slug] || []).length === 0 && (
                            <div className="text-center py-3 text-arch-ink-3 text-sm bg-arch-bg-alt border border-dashed border-arch-line">
                              No sub-events yet. Click "Add" to create one.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {events.length === 0 && (
                <div className="text-center py-8 text-arch-ink-3 bg-arch-bg-alt border border-dashed border-arch-line">
                  <FaCalendar className="text-4xl text-arch-ink mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium text-arch-ink mb-2">No Events Found</p>
                  <p className="text-sm text-arch-ink-3">Create your first event to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="bg-arch-card border border-arch-line p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-arch-ink flex items-center gap-2">
                  <FaUsers className="text-arch-ink" />
                  {selectedSubEvent
                    ? `${selectedParentEvent?.name} - ${selectedSubEvent.name}`
                    : selectedEvent
                      ? selectedEvent.name
                      : 'Event Registrations'
                  }
                </h2>
                {(selectedEvent || selectedSubEvent) && (
                  <span className="text-xs text-arch-bg bg-arch-ink px-2 py-1 rounded-full border border-arch-ink">
                    {selectedSubEvent ? 'Sub-Event' : 'Main Event'}
                  </span>
                )}
              </div>

              {(selectedEvent || selectedSubEvent) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => exportRegistrations(
                      selectedSubEvent
                        ? `${selectedParentEvent.slug}-${selectedSubEvent.slug}`
                        : selectedEvent.slug,
                      !!selectedSubEvent
                    )}
                    className="bg-arch-ink hover:bg-arch-ink text-arch-bg font-medium py-2 px-3 transition-all flex items-center gap-2 text-sm hover:text-arch-bg"
                  >
                    <FaDownload size={12} />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setSelectedSubEvent(null);
                      setSelectedParentEvent(null);
                      setActiveTab('events');
                    }}
                    className="bg-arch-bg-alt hover:bg-arch-bg-alt text-arch-ink font-medium py-2 px-3 transition-all text-sm"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>

            {!selectedEvent && !selectedSubEvent ? (
              <div className="text-center py-12 text-arch-ink-3 bg-arch-bg-alt border border-dashed border-arch-line">
                <FaChartBar className="text-4xl text-arch-ink mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium text-arch-ink mb-2">Select an Event</p>
                <p className="text-sm text-arch-ink-3">Choose an event from the Manage Events tab to view registrations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-arch-ink p-3 border border-arch-ink">
                    <div className="text-arch-ink text-xs font-medium mb-1">Total Registrations</div>
                    <div className="text-xl font-bold text-arch-ink">
                      {selectedSubEvent
                        ? (subEventRegistrations[`${selectedParentEvent.slug}-${selectedSubEvent.slug}`] || []).length
                        : (registrations[selectedEvent.slug] || []).length
                      }
                    </div>
                  </div>
                  <div className="bg-arch-ink p-3 border border-arch-ink">
                    <div className="text-arch-ink text-xs font-medium mb-1">Event Capacity</div>
                    <div className="text-xl font-bold text-arch-ink">
                      {selectedSubEvent ? selectedSubEvent.max_participants : selectedEvent.max_participants}
                    </div>
                  </div>
                  <div className="bg-arch-ink p-3 border border-arch-ink">
                    <div className="text-arch-ink text-xs font-medium mb-1">Remaining Slots</div>
                    <div className="text-xl font-bold text-arch-ink">
                      {Math.max(0,
                        (selectedSubEvent ? selectedSubEvent.max_participants : selectedEvent.max_participants) -
                        (selectedSubEvent
                          ? (subEventRegistrations[`${selectedParentEvent.slug}-${selectedSubEvent.slug}`] || []).length
                          : (registrations[selectedEvent.slug] || []).length
                        )
                      )}
                    </div>
                  </div>
                  <div className="bg-arch-ink p-3 border border-arch-ink">
                    <div className="text-arch-ink text-xs font-medium mb-1">Status</div>
                    <div className="text-lg font-bold text-arch-ink capitalize">
                      {selectedSubEvent ? selectedSubEvent.status : selectedEvent.status}
                    </div>
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="overflow-x-auto border border-arch-line">
                  <table className="w-full text-xs text-left text-arch-ink-3">
                    <thead className="text-xs uppercase bg-arch-bg-alt text-arch-ink">
                      <tr>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Scholar ID</th>
                        <th className="px-3 py-2 hidden sm:table-cell">Email</th>
                        <th className="px-3 py-2 hidden md:table-cell">Phone</th>
                        <th className="px-3 py-2">Branch</th>
                        <th className="px-3 py-2 hidden lg:table-cell">Year</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedSubEvent
                        ? subEventRegistrations[`${selectedParentEvent.slug}-${selectedSubEvent.slug}`] || []
                        : registrations[selectedEvent.slug] || []
                      ).map((registration) => (
                        <tr key={registration.id} className="border-b border-arch-line bg-arch-bg-alt hover:bg-arch-bg-alt transition-colors">
                          <td className="px-3 py-2 font-medium text-arch-ink">
                            <div className="flex items-center gap-1.5 max-w-[100px] truncate">
                              <FaUsers size={10} className="text-arch-ink flex-shrink-0" />
                              <span className="truncate">{registration.profiles?.full_name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              <FaIdCard size={10} className="text-arch-ink flex-shrink-0" />
                              <span>{registration.profiles?.scholar_id || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5 max-w-[120px] truncate">
                              <FaEnvelope size={10} className="text-arch-ink flex-shrink-0" />
                              <span className="truncate">{registration.profiles?.email || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 hidden md:table-cell">
                            <div className="flex items-center gap-1.5">
                              <FaPhone size={10} className="text-arch-ink flex-shrink-0" />
                              <span>{registration.profiles?.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span className="bg-arch-bg-alt px-1.5 py-0.5 text-xs">
                              {registration.profiles?.branch || 'N/A'}
                            </span>
                          </td>
                          <td className="px-3 py-2 hidden lg:table-cell">
                            {registration.profiles?.year || 'N/A'}
                          </td>
                          <td className="px-3 py-2 text-xs">
                            {new Date(registration.registered_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={registration.attendance_status || 'registered'}
                              onChange={(e) => updateAttendanceStatus(registration.id, e.target.value, !!selectedSubEvent)}
                              className="bg-arch-bg-alt border border-arch-line px-1 py-1 text-xs text-arch-ink w-full max-w-[90px] focus:outline-none focus:border-arch-line"
                            >
                              <option value="registered">Registered</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no-show">No Show</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            {(selectedSubEvent?.whatsapp_group_link || selectedEvent?.whatsapp_group_link) && (
                              <a
                                href={selectedSubEvent?.whatsapp_group_link || selectedEvent.whatsapp_group_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-arch-ink hover:text-arch-ink transition-colors"
                                title="Join WhatsApp Group"
                              >
                                <FaWhatsapp size={12} />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(selectedSubEvent
                  ? (subEventRegistrations[`${selectedParentEvent.slug}-${selectedSubEvent.slug}`] || []).length === 0
                  : (registrations[selectedEvent.slug] || []).length === 0
                ) && (
                    <div className="text-center py-8 text-arch-ink-3 bg-arch-bg-alt border border-dashed border-arch-line">
                      <FaUsers className="text-3xl text-arch-ink mx-auto mb-2 opacity-50" />
                      <p className="text-arch-ink font-medium">No Registrations Yet</p>
                      <p className="text-sm text-arch-ink-3 mt-1">Participants will appear here once they register</p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;