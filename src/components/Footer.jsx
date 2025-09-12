import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const logo = "https://res.cloudinary.com/dludtk5vz/image/upload/v1757083555/CSS-LOGO_scfa6u.jpg";

  return (
    <footer className="relative bg-[#00010a] text-gray-400 py-8 overflow-hidden">
      {/* Dark glowing blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyan-700/20 rounded-full blur-3xl animate-float-1"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-800/15 rounded-full blur-3xl animate-float-2"></div>

      {/* Subtle cyan code rain */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 font-mono text-xs animate-[fall_6s_linear_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animationDelay: `${Math.random() * 6}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 md:gap-20 z-10">
        
        {/* Feedback Form */}
        <div className="flex-1 w-full md:w-1/3">
          <h2 className="text-cyan-300 font-mono text-2xl mb-3 text-center md:text-left">Send us a message</h2>
          <form className="flex flex-col gap-3 w-full">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#00010a] border border-cyan-500/50 rounded-md p-2 text-cyan-300 placeholder-cyan-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-[#00010a] border border-cyan-500/50 rounded-md p-2 text-cyan-300 placeholder-cyan-500 focus:outline-none focus:border-cyan-400"
            />
            <textarea
              placeholder="Your Message"
              rows={3}
              className="w-full bg-[#00010a] border border-cyan-500/50 rounded-md p-2 text-cyan-300 placeholder-cyan-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Logo in center */}
        <div className="flex justify-center items-center w-full md:w-auto mt-6 md:mt-0">
          <img src={logo} alt="CSS Logo" className="w-32 md:w-40" />
        </div>

        {/* Contact Info + Social Media */}
        <div className="flex-1 w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0 ">
          <h2 className="text-cyan-300 font-mono text-2xl mb-2 text-center md:text-left">Contact Us</h2>
          
          <div className="flex flex-col gap-2 text-cyan-300 font-mono text-lg">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <FaEnvelope className="text-cyan-400" />
              <a href="mailto:contact@css-official.com" className="hover:text-cyan-500 transition">
                contact@css-official.com
              </a>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <FaPhone className="text-cyan-400" />
              <a href="tel:+911234567890" className="hover:text-cyan-500 transition">
                +91 12345 67890
              </a>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <FaMapMarkerAlt className="text-cyan-400" />
              <span>CSS, NIT Silchar, Assam, India</span>
            </div>
          </div>

          <div className="flex gap-6 text-2xl text-cyan-300 mt-3 justify-center md:justify-start">
            <a
              href="https://www.instagram.com/css_nits/"
              className="hover:text-cyan-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/CSS.NITSilchar/"
              className="hover:text-cyan-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.linkedin.com/company/cssnits"
              className="hover:text-cyan-500 transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="relative z-10 mt-8 border-t border-cyan-500/10 pt-3 text-center text-cyan-300 font-mono text-sm">
        © 2025 CSS Official Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

