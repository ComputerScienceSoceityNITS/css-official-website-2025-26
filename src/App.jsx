import React, { useEffect, useState, useCallback } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Dock, DockIcon, DockItem, DockLabel } from '../components/motion-primitives/dock'
import { Home as HomeIcon, Layers, Award, Users, BookOpen, User } from 'lucide-react'
import { cn } from '../lib/utils'
import Member from './pages/Member'
import Home from './pages/Home'
import { NavbarDemo } from './components/Navbar'
import Events from './pages/Events'
import Auth from './pages/Auth'
import OtpVerification from './pages/OtpVerification'
import Dashboard from './pages/Dashboard'
import CompleteProfile from './pages/CompleteProfilePage'
import AuthProvider from './context/AuthContext'
import AuthCallback from './pages/AuthCallback'
import Wings from './pages/Wings'
import Developers from './pages/Developers'

import { useAuth } from './context/AuthContext'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './components/Footer'
import Materials from './pages/Materials'

import Leaderboard from './pages/Leaderboard'
import ScrollToTop from './components/ScrolltoTop'

import { initGA, logPageView } from './utils/analytics'


import ChatSystem from './pages/ChatSystem'
import EmailMigration from './pages/EmailMigration'
import MigrationCallback from './pages/MigrationCallBack'
import FreshersEvents from './pages/FreshersEvents'
import EventsRegistration from './pages/Esperanza'
import Certificates from "./pages/Certificates";
import SystemVerification from "./components/SystemVerification";
import ErrorBoundary from './components/ErrorBoundary';
import AppDownload from './pages/CSS-APP'
import Abacus from './pages/Abacus'
const ProtectedRoute = ({
  children,
  requireProfileCompletion = false,
  requireCollegeVerification = false,
}) => {
  const {
    user,
    loading,
    requiresProfileCompletion,
    requiresCollegeVerification,
    isCollegeEmail,
  } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (requireProfileCompletion && requiresProfileCompletion) {
    return <Navigate to="/complete-profile" replace />
  }

  if (requireCollegeVerification && requiresCollegeVerification) {
    const skippedMigration = localStorage.getItem('skippedCollegeMigration')
    const isCollegeUser = isCollegeEmail(user.email)

    if (!isCollegeUser && !skippedMigration) {
      return <Navigate to="/email-migration" replace />
    }

    if (!isCollegeUser && skippedMigration) {
      return (
        <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <h1 className="text-2xl text-red-400 mb-4">Access Restricted</h1>
            <p className="text-gray-300 mb-4">
              This feature requires college email verification.
            </p>
            <button
              onClick={() => (window.location.href = '/email-migration')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg"
            >
              Verify College Email
            </button>
          </div>
        </div>
      )
    }
  }

  return children
}

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/Abacus" replace />
  }

  return children
}

const NavbarWrapper = () => {
  const location = useLocation()
  if (location.pathname === '/') {
    return null
  }

  return (
    <div className="hidden md:block">
      <NavbarDemo />
    </div>
  )
}

const MobileDockWrapper = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [showDock, setShowDock] = useState(false)

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowDock(true)
      return
    }

    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        const aboutSectionTop = aboutSection.offsetTop
        const scrollPosition = window.scrollY + window.innerHeight / 2
        setShowDock(scrollPosition >= aboutSectionTop)
      } else {
        setShowDock(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  if (!showDock) return null

  const isProfileActive = location.pathname === '/dashboard' || location.pathname === '/auth'

  const navData = [
    {
      title: 'Home',
      icon: <HomeIcon className="w-5 h-5" />,
      onClick: () => navigate('/'),
      active: location.pathname === '/'
    },
    {
      title: 'Wings',
      icon: <Layers className="w-5 h-5" />,
      onClick: () => navigate('/wings'),
      active: location.pathname === '/wings'
    },
    {
      title: 'Events',
      icon: <Award className="w-5 h-5" />,
      onClick: () => navigate('/events'),
      active: location.pathname === '/events'
    },
    {
      title: 'Members',
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigate('/members'),
      active: location.pathname === '/members'
    },
    {
      title: 'Materials',
      icon: <BookOpen className="w-5 h-5" />,
      onClick: () => navigate('/materials'),
      active: location.pathname === '/materials'
    },
    {
      title: user ? 'Profile' : 'Login',
      icon: user ? (
        <img
          src={profile?.avatar_url || `https://api.dicebear.com/8.x/identicon/svg?seed=${user?.email}`}
          alt="Profile"
          className="w-5 h-5 rounded-full object-cover border border-cyan-400/30"
        />
      ) : (
        <User className="w-5 h-5" />
      ),
      onClick: () => navigate(user ? '/dashboard' : '/auth'),
      active: isProfileActive
    }
  ]

  return (
    <div className="block md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-max select-none">
      <Dock
        className="bg-slate-950/75 border border-cyan-500/20 backdrop-blur-md rounded-full shadow-lg shadow-cyan-500/10 p-1.5 gap-2 items-center"
        panelHeight={58}
        magnification={70}
        distance={120}
      >
        {navData.map((item, idx) => (
          <DockItem
            key={idx}
            onClick={item.onClick}
            className={cn(
              "aspect-square rounded-full bg-[#020617] border border-cyan-500/15 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center",
              item.active && "border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            )}
          >
            <DockLabel className="bg-slate-950/90 text-cyan-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap shadow-md shadow-cyan-500/5">
              {item.title}
            </DockLabel>
            <DockIcon className="flex items-center justify-center">{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}

const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    logPageView(location.pathname + location.search)
  }, [location])

  return null
}

const PageWrapper = ({ children }) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  return (
    <div className={cn(
      "min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)]",
      !isHomePage && "pt-24 md:pt-28"
    )}>
      {children}
    </div>
  )
}

const App = () => {
  useEffect(() => {
    initGA()
  }, [])

  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AnalyticsTracker />
          <ScrollToTop />

          <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)]">
            <NavbarWrapper />

            <div className="relative">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <Home />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/members"
                  element={
                    <PageWrapper>
                      <Member />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/events"
                  element={
                    <PageWrapper>
                      <Events />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/wings"
                  element={
                    <PageWrapper>
                      <Wings />
                    </PageWrapper>
                  }
                />

                {/* <Route
                  path="/developers"
                  element={
                    <PageWrapper>
                      <Developers />
                    </PageWrapper>
                  }
                /> */}
                <Route
                  path="/Abacus"
                  element={
                    <PageWrapper>
                      <Abacus />
                    </PageWrapper>
                  }
                />

                {/* <Route path="/events/:slug" element={
                <PageWrapper>
                  <MoreEvents />
                </PageWrapper>
              } /> */}

                <Route
                  path="/events/:eventSlug"
                  element={
                    <ProtectedRoute requireProfileCompletion={true}>
                      <PageWrapper>
                        <FreshersEvents />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/esperanza"
                  element={
                    <PageWrapper>
                      <EventsRegistration />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/materials"
                  element={
                    <PageWrapper>
                      <Materials />
                    </PageWrapper>
                  }
                />

                <Route path="/certificates" element={
                  <PageWrapper>
                    <Certificates />
                  </PageWrapper>
                }
                />

                <Route path="/system-verification" element={
                  <PageWrapper>
                    <SystemVerification />
                  </PageWrapper>
                }
                />

                <Route
                  path="/auth"
                  element={
                    <GuestRoute>
                      <PageWrapper>
                        <Auth />
                      </PageWrapper>
                    </GuestRoute>
                  }
                />

                <Route
                  path="/auth/callback"
                  element={
                    <PageWrapper>
                      <AuthCallback />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/otp-verification"
                  element={
                    <PageWrapper>
                      <OtpVerification />
                    </PageWrapper>
                  }
                />

                <Route
                  path="/complete-profile"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <CompleteProfile />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requireProfileCompletion={true}>
                      <PageWrapper>
                        <Dashboard />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute requireProfileCompletion={true}>
                      <PageWrapper>
                        <Leaderboard />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireProfileCompletion={true}>
                      <AdminRoute>
                        <PageWrapper>
                          <AdminDashboard />
                        </PageWrapper>
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="*"
                  element={
                    <PageWrapper>
                      <Navigate to="/" replace />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute
                      requireProfileCompletion={true}
                      requireCollegeVerification={true}
                    >
                      <PageWrapper>
                        <ChatSystem />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/email-migration"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <EmailMigration />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auth/migration-callback"
                  element={
                    <PageWrapper>
                      <MigrationCallback />
                    </PageWrapper>
                  }
                />
                <Route path='/app-download' element={<AppDownload />} />
              </Routes>
            </div>
            {/* <DiwaliWidget /> */}
            <MobileDockWrapper />
            <Footer />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App
