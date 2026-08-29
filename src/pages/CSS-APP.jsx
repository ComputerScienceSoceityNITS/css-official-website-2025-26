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
    <div className="w-full min-h-screen bg-arch-bg text-arch-ink font-sans relative overflow-hidden">
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
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter font-['Goldman']">
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
          <p className="text-arch-ink text-sm md:text-base max-w-2xl mx-auto">
            $ sudo fetch --app nits-css-society --platform all
            <br />
            {/* <span className="text-arch-ink-3">// Experience NIT Silchar's official tech society on the go.</span> */}
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
            className="group relative p-8 border border-arch-line bg-arch-card overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(34, 211, 238, 0.5)" }}
          >
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-arch-ink text-arch-bg border border-arch-ink">
                  <FcAndroidOs size={28}/>
                </div>
                <h2 className="text-3xl font-bold font-['Goldman']">Android</h2>
              </div>
              
              <ul className="space-y-3 mb-8 text-arch-ink text-sm">
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-arch-ink"/> Direct APK Installation</li>
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-arch-ink"/> Version 1.0.1 (Latest)</li>
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-arch-ink"/> Official App of CSS</li>
              </ul>

              <a href="/downloads/css-app.apk" download>
                <button className="w-full py-6 bg-arch-ink hover:bg-arch-ink text-arch-bg font-bold flex items-center justify-center gap-2 transition-all hover:text-arch-bg">
                  <Download size={20} />
                  DOWNLOAD APK
                </button>
              </a>
            </div>
          </motion.div>

          {/* iOS Card */}
          <motion.div 
            variants={cardVariants}
            className="group relative p-8 border border-arch-line bg-arch-card overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.5)" }}
          >
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-arch-ink text-arch-bg border border-arch-ink">
                  <IoLogoApple size={28} />
                </div>
                <h2 className="text-3xl font-bold font-['Goldman']">iOS / iPhone</h2>
              </div>
              
              <ul className="space-y-3 mb-8 text-arch-ink text-sm">
                <li className="flex items-center gap-2"><Globe size={16} className="text-arch-ink"/> Direct APK Installation</li>
                <li className="flex items-center gap-2"><Globe size={16} className="text-arch-ink"/> Version 1.0.0 (Latest)</li>
                <li className="flex items-center gap-2"><Globe size={16} className="text-arch-ink"/> Native Apple UX</li>
              </ul>

              <button 
                onClick={() => window.open('https://testflight.apple.com/join/...', '_blank')}
                className="w-full py-6 bg-arch-ink hover:bg-arch-ink text-arch-bg font-bold flex items-center justify-center gap-2 transition-all hover:text-arch-bg"
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
          className="text-center max-w-xl mx-auto p-6 border border-arch-line bg-arch-card"
        >
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-arch-faint mb-4">Installation Guide</h4>
          <p className="text-xs text-arch-ink-3 leading-relaxed">
            For Android: If you receive a "Blocked by Play Protect" warning, click "Install Anyway". 
            This is normal for apps not distributed via Play Store.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AppDownload