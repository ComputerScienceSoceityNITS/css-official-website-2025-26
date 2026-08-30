import React, { useRef } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useArchReveal } from '../hooks/useArchAnim'

const PORTALS = [
    {
        name: 'Previous Year Study Material',
        href: 'https://drive.google.com/drive/folders/1Wf6EZEi0NtcN1K286OgoIuO9Ebs0om5J',
        description:
            'Latest collection of previous year study materials, questions, and course resources.',
    },
    {
        name: 'Prep',
        href: 'https://raj8664.github.io/Prep/',
        description:
            'Lecture notes, assignments and semester-wise preparation material maintained by the society.',
    },
    {
        name: 'CSE23.xyz',
        href: 'https://cse23.xyz',
        description:
            'A student-run archive of course resources, previous papers and reference reading.',
    },
]

const Materials = () => {
    const scope = useRef(null)
    useArchReveal(scope, [])

    return (
        <div ref={scope} className="min-h-screen w-full bg-arch-bg text-arch-ink">
            <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
                {/* Masthead */}
                <header className="border-b border-arch-line py-20 md:py-32">
                    <h1
                        data-arch="lines"
                        className="arch-display text-[clamp(2.75rem,9vw,8rem)]"
                    >
                        <span className="arch-split-line">
                            <span className="arch-line-inner">Study</span>
                        </span>
                        <span className="arch-split-line">
                            <span className="arch-line-inner">Materials</span>
                        </span>
                    </h1>
                    <p className="arch-body mt-10 max-w-xl" data-arch="fade" data-arch-delay="0.2">
                        Course materials, lecture notes, assignments and resources live on our
                        dedicated portals. Both are maintained and updated by students.
                    </p>
                </header>

                {/* Portals */}
                <div className="arch-grid grid grid-cols-1 md:grid-cols-2">
                    {PORTALS.map((portal, i) => (
                        <a
                            key={portal.name}
                            href={portal.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-arch="fade"
                            data-arch-delay={`${i * 0.1}`}
                            className="group relative flex flex-col justify-between bg-arch-card px-8 py-14 transition-colors duration-500 hover:bg-arch-bg-alt md:px-12 md:py-20"
                        >
                            <div className="flex items-start justify-end">
                                <FaExternalLinkAlt className="h-3.5 w-3.5 text-arch-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-arch-ink" />
                            </div>

                            <div className="mt-20">
                                <h2 className="arch-title text-[clamp(1.75rem,4vw,3rem)]">
                                    {portal.name}
                                </h2>
                                <p className="arch-body mt-5 max-w-sm">{portal.description}</p>
                                <span className="arch-label mt-8 block transition-colors duration-500 group-hover:text-arch-ink">
                                    Open portal →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <p className="arch-body py-16">
                    For any issues with the materials portal, contact the technical team.
                </p>
            </div>
        </div>
    )
}

export default Materials
