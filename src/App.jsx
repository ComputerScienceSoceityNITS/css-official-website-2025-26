import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Member from './pages/Member'
import Home from './pages/Home'  
import Layout from './components/Layout'
import Developers from './pages/Developers'
import ContactUs from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Member />} />
          <Route path="/developers" element={<Developers / >} />
          <Route path="/contactus" element={<ContactUs / >} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
