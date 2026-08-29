import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
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
import Gallery from './pages/Gallery'

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
import WelcomeStoryPage from './pages/WelcomeStoryPage'
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
      <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 h-10 w-10 animate-spin border border-arch-line border-t-arch-ink"></div>
          <p className="arch-label">Loading</p>
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
        <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
          <div className="max-w-md border border-arch-line bg-arch-card p-10 text-left">
            <p className="arch-label mb-6">Restricted</p>
            <h1 className="arch-title mb-4 text-3xl">Access restricted</h1>
            <p className="arch-body mb-8">
              This feature requires college email verification.
            </p>
            <button
              onClick={() => (window.location.href = '/email-migration')}
              className="arch-btn"
            >
              <span>Verify College Email</span>
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
      <div className="min-h-screen bg-arch-bg text-arch-ink flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 h-10 w-10 animate-spin border border-arch-line border-t-arch-ink"></div>
          <p className="arch-label">Loading</p>
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
  // The bar now rides every route, home included. It stays transparent
  // over the hero and solidifies on scroll (handled inside NavbarDemo).
  return <NavbarDemo />
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
      "min-h-screen bg-arch-bg",
      !isHomePage && "pt-[76px]"
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

          <div className="min-h-screen bg-arch-bg">
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
                  path="/gallery"
                  element={
                    <PageWrapper>
                      <Gallery />
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
                <Route
                  path="/welcome-story"
                  element={
                    <ProtectedRoute>
                      <PageWrapper>
                        <WelcomeStoryPage />
                      </PageWrapper>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            {/* <DiwaliWidget /> */}
            <Footer />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}

export default App
