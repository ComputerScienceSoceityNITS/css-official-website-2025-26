import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'
import Developers from './pages/Developers'
import Wings from './pages/Wings'
import EditorialsComingSoon from './pages/Editorials'
import { NavbarDemo } from './components/Navbar'
import Events from './pages/Events'
import MoreEvents from './pages/MoreEvents'

const App = () => {
  return (
    <BrowserRouter>
      {/* Render NavbarDemo for all routes except Home */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/members"
          element={
            <>
              <NavbarDemo />
              <Member />
            </>
          }
        />
        <Route
          path="/developers"
          element={
            <>
              <NavbarDemo />
              <Developers />
            </>
          }
        />
        <Route
          path="/wings"
          element={
            <>
              <NavbarDemo />
              <Wings />
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <NavbarDemo />
              <Events />
            </>
          }
        />
        <Route
          path="/events/:slug"
          element={
            <>
              <NavbarDemo />
              <MoreEvents />
            </>
          }
        />
        <Route
          path="/editorials"
          element={
            <>
              <NavbarDemo />
              <EditorialsComingSoon />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <NavbarDemo />
              <Login />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

// Placeholder Login component (create this in pages/Login.js if needed)
const Login = () => <h1>Login Page</h1>

export default App
