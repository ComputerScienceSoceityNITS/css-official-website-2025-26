import React, { useState } from 'react'
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { archSpring } from '../hooks/useArchAnim'
import '../styles/memberAnimations.css' // Make sure you have this file

const MemberCard = ({ member, flipped, onFlip, index }) => {
  // Contacts follow the pointer on desktop; the click handler stays for touch.
  const [hovered, setHovered] = useState(false)
  const showContacts = hovered || flipped

  const socials = [
    { href: member.social?.instagram, Icon: FaInstagram, label: 'Instagram' },
    { href: member.social?.facebook, Icon: FaFacebook, label: 'Facebook' },
    { href: member.social?.linkedin, Icon: FaLinkedin, label: 'LinkedIn' },
  ].filter((s) => s.href)

  return (
    <div
      className="group relative flex h-full cursor-pointer select-none flex-col bg-arch-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onFlip}
      data-arch="fade"
      data-arch-delay={`${(index % 4) * 0.07}`}
    >
      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-arch-bg-alt">
        <motion.img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover object-center"
          animate={{ scale: showContacts ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Contacts rise on hover */}
        <AnimatePresence>
          {showContacts && socials.length > 0 && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={archSpring}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-arch-card/95 py-5"
            >
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${label}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-10 w-10 items-center justify-center border border-arch-line text-arch-ink transition-colors duration-300 hover:bg-arch-ink hover:text-arch-bg"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col border-t border-arch-line p-6">
        <h3 className="arch-title text-lg leading-tight">{member.name}</h3>
        <p className="arch-body mt-2 text-[13px] leading-snug">{member.role}</p>
      </div>
    </div>
  )
}

export default MemberCard
