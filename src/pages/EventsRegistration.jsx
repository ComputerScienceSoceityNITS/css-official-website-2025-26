import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${disabled ? 'bg-gray-700 cursor-not-allowed' : ''}`}
        />
    </div>
);


const FormTextarea = ({ id, label, value, onChange, placeholder, required = false, rows = 4 }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
    </div>
);

const SubmitButton = ({ text, loading = false }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed"
    >
        {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
        ) : (
            text
        )}
    </button>
);

const Event1Form = () => {
    const { user } = useAuth(); 
    const [teamName, setTeamName] = useState('');
    const [member2Email, setMember2Email] = useState('');
    const [githubRepo, setGithubRepo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Event 1 (Hackathon) Submission:', {
            teamName,
            leaderEmail: user.email,
            member2Email,
            githubRepo,
        });
        
        setTimeout(() => {
            setLoading(false);
            alert('Registered for Hackathon!');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-white">Register for Ramp Walk</h2>
            <FormInput
                id="teamName"
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., The Algo-Rhythms"
                required
            />
            <FormInput
                id="leaderEmail"
                label="Team Leader (Your Email)"
                value={user?.email || ''} // Prefill user email
                disabled
            />
            <FormInput
                id="member2Email"
                label="Teammate's Email"
                type="email"
                value={member2Email}
                onChange={(e) => setMember2Email(e.target.value)}
                placeholder="teammate@example.com"
                required
            />
            <FormInput
                id="githubRepo"
                label="GitHub Repository URL (Optional)"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/team/repo"
            />
            <SubmitButton text="Register Team" loading={loading} />
        </form>
    );
};


const Event2Form = () => {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState('');
    const [motivation, setMotivation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Event 2 (Design Workshop) Submission:', {
            email: user.email,
            portfolio,
            motivation,
        });
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Registered for Design Workshop!');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-white">Register for Event 2</h2>
            <FormInput
                id="fullName"
                label="Full Name"
                value={user?.name || ''} 
                disabled
            />
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            <FormInput
                id="portfolio"
                label="Portfolio URL (Behance, Dribbble, etc.)"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://your-portfolio.com"
                required
            />
            <FormTextarea
                id="motivation"
                label="Why do you want to join this workshop?"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="I'm passionate about design because..."
                required
            />
            <SubmitButton text="Register for Workshop" loading={loading} />
        </form>
    );
};

/**
 * Form for Event 3 (e.g., a Capture The Flag Contest)
 */
const Event3Form = () => {
    const { user } = useAuth();
    const [ctfUsername, setCtfUsername] = useState('');
    const [experience, setExperience] = useState('Beginner'); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // --- TODO: Add your submission logic here ---
        console.log('Event 3 (CTF) Submission:', {
            email: user.email,
            ctfUsername,
            experience,
        });
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Registered for CTF!');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-white">Register for Event 3</h2>
            <FormInput
                id="email"
                label="Email"
                value={user?.email || ''}
                disabled
            />
            <FormInput
                id="ctfUsername"
                label="CTF Platform Username"
                value={ctfUsername}
                onChange={(e) => setCtfUsername(e.target.value)}
                placeholder="YourHackerHandle"
                required
            />
            <div className="mb-4">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
                    CTF Experience {<span className="text-red-400">*</span>}
                </label>
                <select
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="Beginner">Beginner (Just starting out)</option>
                    <option value="Intermediate">Intermediate (Done a few CTFs)</option>
                    <option value="Advanced">Advanced (I pwn boxes for fun)</option>
                </select>
            </div>
            <SubmitButton text="Register for CTF" loading={loading} />
        </form>
    );
};


/**
 * Main EventsRegistration Component
 */
const EventsRegistration = () => {
    // This state will control which tab and form are active
    const [activeTab, setActiveTab] = useState('event1');

    // Define the tabs
    const tabs = [
        { id: 'event1', name: 'Ramp Walk' },
        { id: 'event2', name: 'Event 2' },
        { id: 'event3', name: 'Event 3' },
    ];

    return (
        <div className="pt-20 pb-12 text-white"> 
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
                    Event Registration
                </h1>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-6 border-b border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 sm:px-6 font-medium text-base sm:text-lg transition-colors duration-300 ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-cyan-500 text-cyan-400' // Active tab style
                                    : 'text-gray-400 hover:text-white border-b-2 border-transparent' // Inactive tab style
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="bg-gray-900 bg-opacity-50 p-6 sm:p-8 rounded-lg shadow-xl min-h-[400px]">
                    {activeTab === 'event1' && <Event1Form />}
                    {activeTab === 'event2' && <Event2Form />}
                    {activeTab === 'event3' && <Event3Form />}
                </div>
            </div>
        </div>
    );
};

export default EventsRegistration;