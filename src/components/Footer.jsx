import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/members', label: 'Members' },
  { path: '/developers', label: 'Developers' },
  { path: '/wings', label: 'Wings' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/editorials', label: 'Editorials' },
  // { path: '/chat', label: 'Chat' },
];

const socials = [
  { icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/css_nits/?hl=en' },
  { icon: FaFacebook, label: 'Facebook', url: '#' },
  { icon: FaLinkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/company/cssnits/posts/?feedView=all' },
  { icon: FaGithub, label: 'GitHub', url: 'https://github.com/ComputerScienceSoceityNITS/' },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-arch-line bg-arch-bg text-arch-ink">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        {/* Masthead */}
        <div className="grid grid-cols-1 gap-10 border-b border-arch-line py-16 md:grid-cols-12 md:gap-6 md:py-24">
          <div className="md:col-span-7">
            <p className="arch-label mb-8">Computer Science Society</p>
            <h2 className="arch-display text-[clamp(2.25rem,6vw,4.5rem)]">
              Building the future
              <br />
              of technology.
            </h2>
          </div>

          <div className="flex flex-col justify-end md:col-span-5 md:items-end">
            <p className="arch-body max-w-sm md:text-right">
              Innovation, collaboration, and continuous learning at the National Institute
              of Technology, Silchar.
            </p>
            <div className="mt-8 flex items-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  title={social.label}
                  aria-label={social.label}
                  className="text-arch-muted transition-colors duration-300 hover:text-arch-ink"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 border-b border-arch-line md:grid-cols-12">
          <div className="border-arch-line py-12 md:col-span-4 md:border-r md:pr-10">
            <p className="arch-label mb-8">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="arch-link text-sm tracking-[-0.01em] text-arch-muted transition-colors duration-300 hover:text-arch-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-arch-line py-12 md:col-span-4 md:border-l-0 md:border-r md:border-t-0 md:px-10">
            <p className="arch-label mb-8">Contact</p>
            <div className="space-y-4 text-sm tracking-[-0.01em] text-arch-muted">
              <p className="break-all">computersciencesociety@cse.nits.ac.in</p>
              {/* <p>+91 (555) 123-CODE</p> */}
              <p>National Institute of Technology, Silchar</p>
            </div>
          </div>

          <div className="border-t border-arch-line py-12 md:col-span-4 md:border-t-0 md:pl-10">
            <p className="arch-label mb-8">Status</p>
            <div className="flex items-center gap-3 text-sm tracking-[-0.01em] text-arch-muted">
              <span className="h-1.5 w-1.5 bg-arch-ink" />
              <span>All systems operational</span>
            </div>
            <p className="arch-body mt-6 max-w-xs">
              Designed and maintained by the Dev Wing.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[0.16em] text-arch-faint">
            &copy; 2025 Computer Science Society
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
              { to: '/conduct', label: 'Conduct' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] uppercase tracking-[0.16em] text-arch-faint transition-colors duration-300 hover:text-arch-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
