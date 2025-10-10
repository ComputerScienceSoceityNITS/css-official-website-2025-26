import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaArrowRight, FaGithub, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white border-t border-cyan-500/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-900/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-6 sm:mb-8">
          {/* Navigation - Left Side */}
          <div className="text-center lg:text-left order-1 lg:order-1">
            <h3 className="text-cyan-400 font-mono text-base sm:text-lg mb-4 sm:mb-6 flex items-center justify-center lg:justify-start">
              <span className="text-cyan-400 mr-2">$~</span>
              NAVIGATION
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/events', label: 'Events' },
                { path: '/members', label: 'Members' },
                { path: '/developers', label: 'Developers' },
                { path: '/wings', label: 'Wings' },
                { path: '/editorials', label: 'Editorials' },
                { path: '/chat', label: 'Chat' },
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-mono text-sm group flex items-center justify-center lg:justify-start"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                    <span className="border-b border-transparent hover:border-cyan-400 transition-all duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo and Social Links - Center */}
          <div className="text-center order-3 lg:order-2 col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex justify-center items-center ">
              <div className="relative group">
                   <img 
                      src="https://res.cloudinary.com/dp4sknsba/image/upload/v1760078712/Untitled_design_xzhopc.svg" 
                      alt="CSS Logo" 
                      className="h-50 w-auto" // Adjust height as needed
                    />
                  {/* Fallback text logo */}
                  <div className="text-cyan-400 font-bold text-3xl tracking-wider font-mono hidden">
                    CSS  
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4 sm:mb-6 font-mono max-w-md mx-auto">
              <span className="text-cyan-400">$~ </span>
              Building the future of technology through innovation, collaboration, and continuous learning.
            </p>

            {/* Online Status */}
            <div className="flex justify-center items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/40"></div>
              <span className="text-cyan-300 font-mono text-sm">ONLINE</span>
            </div>

            {/* Social Links - Simple Icons */}
            <div className="flex justify-center items-center space-x-4">
              {[
                { icon: FaInstagram, label: 'Instagram', color: 'text-pink-400 hover:text-pink-300', url: '#' },
                { icon: FaFacebook, label: 'Facebook', color: 'text-blue-400 hover:text-blue-300', url: '#' },
                { icon: FaLinkedin, label: 'LinkedIn', color: 'text-blue-500 hover:text-blue-400', url: '#' },
                { icon: FaGithub, label: 'GitHub', color: 'text-gray-400 hover:text-gray-300', url: '#' },
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.url}
                  className={`group transition-all duration-300 transform hover:scale-110 ${social.color}`}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info - Right Side */}
          <div className="text-center lg:text-right order-2 lg:order-3">
            <h3 className="text-cyan-400 font-mono text-base sm:text-lg mb-4 sm:mb-6 flex items-center justify-center lg:justify-end">
              <span className="text-cyan-400 mr-2">$~</span>
              CONTACT
            </h3>
            <div className="space-y-3 sm:space-y-4 font-mono text-sm">
              <div className="flex items-center justify-center lg:justify-end text-gray-300">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
                <span className="break-all">contact@cssociety.org</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end text-gray-300">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 animate-pulse delay-1000 flex-shrink-0"></div>
                <span>+91 (555) 123-CODE</span>
              </div>
              <div className="flex items-center justify-center lg:justify-end text-gray-300">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 animate-pulse delay-2000 flex-shrink-0"></div>
                <span>National Institute of Technology, Silchar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-500/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 font-mono text-xs sm:text-sm text-center sm:text-left">
              <span className="text-cyan-400">$~ </span>
              &copy; 2025 Computer Science Society. All systems operational.
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono">
              <Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 whitespace-nowrap">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 whitespace-nowrap">
                Terms
              </Link>
              <Link to="/conduct" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 whitespace-nowrap">
                Conduct
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t border-l border-cyan-400/50"></div>
      <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t border-r border-cyan-400/50"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b border-l border-cyan-400/50"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b border-r border-cyan-400/50"></div>
    </footer>
  );
};

export default Footer;