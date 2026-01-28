'use client'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { SparklesCore } from '../components/ui/sparkles'
import { Smartphone, Apple, Download, ShieldCheck, Zap, Globe } from 'lucide-react'
import { FcAndroidOs } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";

const AppDownload = () => {
  const [activePlatform, setActivePlatform] = useState(null)

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto py-20 px-6 z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] font-['Goldman']">
              CSS MOBILE
            </h1>
            <div className="absolute -inset-8 -z-10">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#22d3ee"
              />
            </div>
          </div>
          <p className="text-cyan-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            $ sudo fetch --app nits-css-society --platform all
            <br />
            {/* <span className="text-gray-400">// Experience NIT Silchar's official tech society on the go.</span> */}
          </p>
        </motion.div>

        {/* Download Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Android Card */}
          <motion.div 
            variants={cardVariants}
            className="group relative p-8 rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-md overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(34, 211, 238, 0.5)" }}
          >
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                  <FcAndroidOs size={28}/>
                </div>
                <h2 className="text-3xl font-bold font-['Goldman']">Android</h2>
              </div>
              
              <ul className="space-y-3 mb-8 text-cyan-100/70 font-mono text-sm">
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400"/> Direct APK Installation</li>
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400"/> Version 1.0.1 (Latest)</li>
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400"/> Official App of CSS</li>
              </ul>

              <a href="/downloads/css-app.apk" download>
                <button className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.3)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all">
                  <Download size={20} />
                  DOWNLOAD APK
                </button>
              </a>
            </div>
          </motion.div>

          {/* iOS Card */}
          <motion.div 
            variants={cardVariants}
            className="group relative p-8 rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-md overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.5)" }}
          >
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <IoLogoApple size={28} />
                </div>
                <h2 className="text-3xl font-bold font-['Goldman']">iOS / iPhone</h2>
              </div>
              
              <ul className="space-y-3 mb-8 text-purple-100/70 font-mono text-sm">
                <li className="flex items-center gap-2"><Globe size={16} className="text-purple-400"/> Direct APK Installation</li>
                <li className="flex items-center gap-2"><Globe size={16} className="text-purple-400"/> Version 1.0.0 (Latest)</li>
                <li className="flex items-center gap-2"><Globe size={16} className="text-purple-400"/> Native Apple UX</li>
              </ul>

              <button 
                onClick={() => window.open('https://testflight.apple.com/join/...', '_blank')}
                className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
              >
                <IoLogoApple size={28} />
                Coming Soon...
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Instructions Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center max-w-xl mx-auto p-6 rounded-xl border border-white/5 bg-white/5"
        >
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Installation Guide</h4>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            For Android: If you receive a "Blocked by Play Protect" warning, click "Install Anyway". 
            This is normal for apps not distributed via Play Store.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AppDownload