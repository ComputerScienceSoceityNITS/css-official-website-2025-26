import React, { useState, useEffect, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CSSAppPage = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(427);
  const [suggestions, setSuggestions] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  
  // Mock app features data
  const appFeatures = useMemo(() => [
    {
      icon: '📱',
      title: 'Live Announcements',
      description: 'Get real-time updates about events, workshops, and important notices'
    },
    {
      icon: '🗓️',
      title: 'Event Calendar',
      description: 'Never miss an event with integrated calendar and reminders'
    },
    {
      icon: '👥',
      title: 'Member Connect',
      description: 'Network with fellow CSS members and alumni'
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description: 'Access curated tutorials, code snippets, and study materials'
    },
    {
      icon: '🏆',
      title: 'Leaderboard',
      description: 'Track your participation and achievements in CSS events'
    },
    {
      icon: '💬',
      title: 'Discussion Forum',
      description: 'Engage in tech discussions and Q&A sessions'
    }
  ], []);

  // Mock system requirements
  const systemRequirements = useMemo(() => [
    { platform: 'Android', version: '8.0+', storage: '50 MB' },
    { platform: 'iOS', version: '13.0+', storage: '60 MB' }
  ], []);

  // Handle wishlist toggle
  const handleWishlist = () => {
    if (!isWishlisted) {
      setIsWishlisted(true);
      setWishlistCount(prev => prev + 1);
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Handle suggestion submission
  const handleSubmitSuggestion = (e) => {
    e.preventDefault();
    if (suggestions.trim()) {
      const newSuggestion = {
        id: Date.now(),
        text: suggestions,
        timestamp: new Date().toLocaleDateString(),
        upvotes: 0
      };
      setUserSuggestions(prev => [newSuggestion, ...prev]);
      setSuggestions('');
      
      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // GSAP animations
  useGSAP(() => {
    // Animate app mockup on scroll
    gsap.fromTo('.app-mockup',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.app-mockup',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Animate features cards
    gsap.fromTo('.feature-card',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Animate system requirements
    gsap.fromTo('.requirement-card',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.requirements-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white overflow-hidden">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-cyan-900 to-purple-900 border border-cyan-500/50 rounded-lg p-4 shadow-lg shadow-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="font-mono text-sm">
                {isWishlisted ? 'Added to wishlist!' : 'Suggestion submitted!'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-purple-900/10 to-black/50"></div>
        
        <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-cyan-400 font-mono text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
                  CSS_APP_TERMINAL
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-cyan-400">$~ </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400">
                  CSS Mobile App
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed font-mono">
                <span className="text-green-400">Coming Soon</span> to iOS App Store & Google Play Store
              </p>

              <div className="inline-flex flex-wrap items-center gap-4 mb-8 p-4 bg-black/50 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                <span className="text-cyan-400 font-mono">Status:</span>
                <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-mono border border-yellow-500/30">
                  🚧 Under Development
                </span>
                <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-mono border border-purple-500/30">
                  Q2 2024 Release
                </span>
              </div>
            </div>

            {/* Wishlist Section */}
            <div className="bg-black/60 rounded-2xl border border-cyan-500/30 p-6 backdrop-blur-md shadow-xl shadow-cyan-500/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 font-mono">
                    <span className="text-cyan-400">$~ </span>
                    Wishlist It Now!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Be the first to know when the app launches. Join {wishlistCount}+ CSS members who are waiting.
                  </p>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="font-mono">{wishlistCount} wishlisted</span>
                  </div>
                </div>

                <button
                  onClick={handleWishlist}
                  disabled={isWishlisted}
                  className={`px-8 py-3 rounded-xl font-bold font-mono transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isWishlisted
                      ? 'bg-green-900/50 text-green-300 border border-green-500/50'
                      : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                  }`}
                >
                  {isWishlisted ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Wishlisted ✓
                    </span>
                  ) : (
                    'Add to Wishlist'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - App Mockup */}
          <div className="flex-1 flex justify-center app-mockup">
            <div className="relative">
              {/* iPhone Mockup */}
              <div className="relative w-64 md:w-80">
                {/* iPhone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl shadow-cyan-500/20 border-2 border-gray-800">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
                  
                  {/* Screen */}
                  <div className="relative bg-gradient-to-br from-cyan-900 via-purple-900 to-black rounded-[2rem] overflow-hidden h-[500px]">
                    {/* App Header */}
                    <div className="p-6 bg-gradient-to-r from-cyan-900/80 to-purple-900/80">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold">CSS</span>
                          </div>
                          <span className="font-bold text-white">CSS App</span>
                        </div>
                        <span className="text-xs text-cyan-300">Beta</span>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="p-4 space-y-4">
                      {/* Live Announcement */}
                      <div className="bg-black/50 rounded-xl p-3 border border-cyan-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-cyan-300">Live</span>
                        </div>
                        <p className="text-sm">Hackathon 2024 registration open!</p>
                      </div>

                      {/* Upcoming Events */}
                      <div className="bg-black/50 rounded-xl p-3 border border-purple-500/30">
                        <h4 className="text-sm font-bold mb-2">📅 Today's Events</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Web Dev Workshop</span>
                            <span className="text-cyan-300">4:00 PM</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/50 rounded-lg p-3 text-center border border-green-500/30">
                          <div className="text-lg font-bold text-green-400">24</div>
                          <div className="text-xs text-gray-400">Events</div>
                        </div>
                        <div className="bg-black/50 rounded-lg p-3 text-center border border-blue-500/30">
                          <div className="text-lg font-bold text-blue-400">427</div>
                          <div className="text-xs text-gray-400">Members</div>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-around bg-black/70 rounded-full p-2 border border-gray-700">
                          {['🏠', '📅', '👥', '⚙️'].map((icon, idx) => (
                            <button key={idx} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                              <span className="text-xl">{icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Home Button */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full"></div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl rounded-[4rem] -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-cyan-400 font-mono text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
                APP_FEATURES_TERMINAL
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-cyan-400">$~ </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                Powerful Features
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Everything you need to stay connected with CSS activities, all in one place
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appFeatures.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-black/40 rounded-2xl border border-cyan-500/20 p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="requirements-section py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-cyan-400 font-mono text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
                SYSTEM_REQUIREMENTS
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-cyan-400">$~ </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                System Requirements
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {systemRequirements.map((req, index) => (
              <div
                key={index}
                className="requirement-card bg-gradient-to-br from-black/60 to-cyan-900/20 rounded-2xl border border-cyan-500/30 p-8 backdrop-blur-md w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <div className={`text-5xl mb-4 ${index === 0 ? 'text-green-400' : 'text-blue-400'}`}>
                    {index === 0 ? '🤖' : '🍎'}
                  </div>
                  <h3 className="text-2xl font-bold">{req.platform}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Minimum Version</span>
                    <span className="font-mono text-cyan-300">{req.version}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Storage Required</span>
                    <span className="font-mono text-green-300">{req.storage}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Release Status</span>
                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-mono">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/50 rounded-2xl border border-cyan-500/30 p-8 backdrop-blur-md shadow-xl shadow-cyan-500/10">
            <div className="flex items-center mb-8">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-cyan-400 font-mono text-sm">
                SUGGEST_FEATURES_TERMINAL
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-2">
              <span className="text-cyan-400">$~ </span>
              Suggest Features
            </h2>
            <p className="text-gray-300 mb-8">
              Help us build the perfect app. Share your ideas and feature requests!
            </p>

            <form onSubmit={handleSubmitSuggestion} className="mb-8">
              <div className="mb-4">
                <label className="block text-cyan-400 font-mono mb-2">
                  Your Suggestion
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded-xl p-4 text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                  rows="4"
                  placeholder="Type your feature suggestion here... e.g., 'Dark mode toggle', 'Offline event details', etc."
                  maxLength={500}
                />
                <div className="text-right text-gray-400 text-sm mt-2">
                  {suggestions.length}/500 characters
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                Submit Suggestion
              </button>
            </form>

            {/* Submitted Suggestions */}
            {userSuggestions.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6 text-cyan-400">
                  <span className="text-green-400">$~ </span>
                  Submitted Suggestions
                </h3>
                <div className="space-y-4">
                  {userSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="bg-black/30 rounded-xl border border-cyan-500/20 p-4"
                    >
                      <p className="text-gray-200 mb-2">{suggestion.text}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span className="font-mono">{suggestion.timestamp}</span>
                        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                          ▲ Upvote ({suggestion.upvotes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <span className="text-cyan-400 font-mono text-sm bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
                RELEASE_TIMELINE
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-cyan-400">$~ </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
                Development Timeline
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-green-500"></div>

            {/* Timeline items */}
            {[
              { date: 'Jan 2024', title: 'Planning & Design', status: 'completed', icon: '📋' },
              { date: 'Mar 2024', title: 'Development Started', status: 'completed', icon: '💻' },
              { date: 'Apr 2024', title: 'Beta Testing', status: 'current', icon: '🧪' },
              { date: 'Jun 2024', title: 'App Store Launch', status: 'upcoming', icon: '🚀' },
              { date: 'Jul 2024', title: 'Feature Updates', status: 'upcoming', icon: '✨' },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative mb-12 w-full ${index % 2 === 0 ? 'pr-[50%] text-right' : 'pl-[50%]'}`}
              >
                <div className={`p-6 rounded-2xl backdrop-blur-md border ${
                  item.status === 'completed' 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : item.status === 'current'
                    ? 'bg-cyan-900/20 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                    : 'bg-purple-900/20 border-purple-500/30'
                }`}>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <div className={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-full text-sm ${
                        item.status === 'completed' 
                          ? 'bg-green-900/50 text-green-300' 
                          : item.status === 'current'
                          ? 'bg-cyan-900/50 text-cyan-300 animate-pulse'
                          : 'bg-purple-900/50 text-purple-300'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' : 
                          item.status === 'current' ? 'bg-cyan-500 animate-pulse' : 'bg-purple-500'
                        }`}></div>
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-4 border-black z-10 ${
                  item.status === 'completed' 
                    ? 'bg-green-500' 
                    : item.status === 'current'
                    ? 'bg-cyan-500 animate-pulse'
                    : 'bg-purple-500'
                } ${index % 2 === 0 ? 'right-0 translate-x-2' : 'left-0 -translate-x-2'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-green-900/30 rounded-3xl border border-cyan-500/30 p-12 backdrop-blur-md">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to experience the CSS App?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of CSS members who are already excited for the launch!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWishlist}
                disabled={isWishlisted}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isWishlisted
                    ? 'bg-green-900/50 text-green-300 border border-green-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-2xl shadow-cyan-500/30'
                }`}
              >
                {isWishlisted ? '✓ Already Wishlisted' : '✨ Add to Wishlist'}
              </button>
              
              <button className="px-8 py-4 rounded-xl font-bold text-lg border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                View Progress Updates
              </button>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-gray-400">
              <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="font-mono">Beta release expected: Q2 2024</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CSSAppPage;