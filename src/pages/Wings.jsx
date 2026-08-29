'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

const Wings = () => {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)
  const [activeTerminal, setActiveTerminal] = useState(null)
  const [scrollDirection, setScrollDirection] = useState('down')
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down')
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up')
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  // Font definitions for each wing
  const wingFonts = [
    "font-bold font-['Goldman']", // Executive Wing
    "font-bold font-['Goldman']", // Dev Wing
    "font-bold font-['Goldman']", // CP Wing
    "font-bold font-['Goldman']", // ML Wing
    "font-bold font-['Goldman']", // PR Wing
    "font-bold font-['Goldman']", // Design Wing
    "font-bold font-['Goldman']", // Literature Wing
  ]

  // Animation variants for timeline markers
  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
        delay: 0.2,
      },
    },
    active: {
      scale: 1.08,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 30,
      },
    },
  }

  // Animation variants for terminal entries
  const terminalVariants = {
    hidden: {
      opacity: 0,
      y: scrollDirection === 'down' ? 40 : -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.09,
      },
    },
  }

  // Terminal content animation
  const contentVariants = {
    hidden: { opacity: 0, y: scrollDirection === 'down' ? 20 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Header animation
  const headerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.15,
      },
    },
  }

  // Data for the 7 wings of the Computer Science Society
  const wingsData = [
    {
      title: 'Executive Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 0 ? null : 0)}
          animate={{
            y: activeTerminal === 0 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">EXECUTIVE</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Focuses on leadership, management, and organizational strategies.
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The Executive Wing of CSS is considered to be the backbone of the
            entire Computer Science Society. With the goal of making each and
            every event, module, and session organized under the banner of CSS a
            grand success, the wing manages, coordinates, and arranges resources
            and assets to ensure a smooth workflow among all the individual
            wings. The wing thus forms the binding force between the various
            sub-wings, thereby making every inch of hard work a grand success.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'Dev Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 1 ? null : 1)}
          animate={{
            y: activeTerminal === 1 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">DEV</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Building practical solutions
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The Developers-Wing of CSS is one of the most significant parts of
            the society and is responsible for maintaining and upgrading the
            official Website and App of the Society. The wing is targeted to
            provide a platform for the junior members of the CSE branch to
            showcase and upskill their technical knowledge while working on
            industry-standard projects. It is an ever-growing and expanding
            group of enthusiastic developers that take pride in building
            real-world projects and contributing to the proper functioning of
            our society.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'CP Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 2 ? null : 2)}
          animate={{
            y: activeTerminal === 2 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">CP</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Enhancing problem-solving skills
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The CP-Wing is a crucial part of CSS which is responsible for the
            improvement of problem-solving skills, along with the strengthening
            of the core DSA concepts which also serves as a torchbearer for
            students in the field of CP. The CP-Wing works hard to produce
            better and more efficient coders, who will then be able to help take
            the world to even greater heights, exclusively for the benefit of
            our students.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'ML Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 3 ? null : 3)}
          animate={{
            y: activeTerminal === 3 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">ML</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Advancing machine learning techniques
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The ML Wing of CSS is mainly responsible for developing a culture of
            machine learning and other aspects of artificial intelligence in our
            college. In order to help budding ML and AI enthusiasts, the wing
            also organize different events, workshops, speaker sessions, etc. in
            the domains of AI and ML. All the members of ML Wing are highly
            motivated and enthusiastic to work towards the greater good of the
            CSS society.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'PR Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 4 ? null : 4)}
          animate={{
            y: activeTerminal === 4 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">PR</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Advancing public relations strategies
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The Public Relations Wing of the Computer Science Society, NIT
            Silchar Society is the division responsible for maintaining
            Relations of the Society with External Entities, Organizations, and
            Individuals. The PR Wing of the CSS, NIT Silchar works closely with
            other Wings of the society to ensure that all of the society's
            activities are effectively carried out and hereby make an impression
            on the image of the Society holistically.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'Design Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 5 ? null : 5)}
          animate={{
            y: activeTerminal === 5 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">DESIGN</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Crafting user experiences
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The Design Wing of CSS is a community of designers whose goal is to
            provide a good environment for designers to grow their existing
            talent and sharpen it by working on real-world projects for our
            society. It focuses on conducting introductory sessions on the
            basics of design and industry-standard tools such as Adobe
            Illustrator, Adobe Photoshop, Adobe Premiere Pro, Adobe After
            Effects, Figma, etc. The wing believes in the fact that everyone can
            be a designer with just a little bit of practice and dedication.
          </motion.p>
        </motion.div>
      ),
    },
    {
      title: 'Literature Wing',
      content: (
        <motion.div
          className="relative cursor-pointer overflow-hidden border border-arch-line bg-arch-card p-8 transition-colors duration-500 hover:border-arch-ink/25 md:p-12"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTerminal(activeTerminal === 6 ? null : 6)}
          animate={{
            y: activeTerminal === 6 ? [0, -5, 0] : 0,
            transition: { duration: 0.3 },
          }}
          variants={terminalVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          custom={scrollDirection}
        >
          <motion.div
            className="mb-8 flex items-center justify-between border-b border-arch-line pb-4"
            variants={contentVariants}
          >
            <span className="arch-label">LITERATURE</span>
          </motion.div>
          <motion.p
            className="mb-6 text-lg leading-relaxed tracking-[-0.015em] text-arch-ink md:text-xl"
            variants={contentVariants}
          >
            Exploring the world of literature
          </motion.p>
          <motion.p className="arch-body" variants={contentVariants}>
            The Literary wing of CSS takes care of all the literary work
            published and managed by the Computer Science Society of NIT
            Silchar. From social media posts, technical and website content for
            the official CSS website and Play Store application to description
            taglines of social media handles, the literary wing handles it all.
            BITSCRIBE, the annual magazine of the Computer Science Society, is
            also compiled and published by the literary wing.
          </motion.p>
        </motion.div>
      ),
    },
  ]

  return (
    <div
      className="relative w-full min-h-screen bg-arch-bg font-sans text-arch-ink"
      ref={containerRef}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        {/* Masthead */}
        <motion.header
          className="border-b border-arch-line py-20 md:py-32"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <p className="arch-label mb-10">Divisions — Index</p>
          <h1 className="arch-display text-[clamp(3rem,12vw,11rem)]">Wings</h1>
          <p className="arch-body mt-10 max-w-xl">
            The specialised divisions powering the Computer Science Society —
            each with its own remit, cadence and people.
          </p>
        </motion.header>

        {/* Timeline */}
        <div ref={ref} className="relative pb-24">
          {wingsData.map((item, index) => (
            <div
              key={index}
              className="flex justify-start border-b border-arch-line py-16 md:gap-10 md:py-28"
            >
              {/* Sticky index column */}
              <div className="sticky top-32 z-40 hidden max-w-xs flex-col self-start md:flex md:w-full md:max-w-sm md:flex-row">
                <motion.div
                  className="absolute left-3 top-3 h-2 w-2 bg-arch-ink"
                  variants={markerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  animate={activeTerminal === index ? 'active' : ''}
                />

                <h3
                  className={`hidden md:block md:pl-20 arch-title text-[clamp(1.5rem,3vw,2.75rem)]   ${wingFonts[index]}`}
                >
                  {item.title}
                </h3>
              </div>

              {/* Content column */}
              <div className="flex w-full justify-center px-0 md:justify-start md:pl-4 md:pr-4">
                <div className="w-full max-w-2xl md:max-w-none">
                  <h3 className={`arch-title mb-6 block text-2xl md:hidden   ${wingFonts[index]}`}>
                    {item.title}
                  </h3>
                  {item.content}
                </div>
              </div>
            </div>
          ))}

          {/* Progress rail */}
          <div
            className="absolute left-6 top-0 hidden w-px overflow-hidden bg-arch-line md:block"
            style={{
              height: height + 'px',
            }}
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-px bg-arch-ink"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wings
