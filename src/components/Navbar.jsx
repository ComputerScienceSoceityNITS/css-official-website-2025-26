import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PillNav from "../utils/PillNav";

const Navbar = () => {
  const location = useLocation();
  const [activeHref, setActiveHref] = useState(location.pathname);
  const [showNavbar, setShowNavbar] = useState(location.pathname !== "/"); // show immediately if not home

  useEffect(() => {
    setActiveHref(location.pathname);

    if (location.pathname === "/") {
      // Homepage: hide navbar initially
      setShowNavbar(false);

      const handleScroll = () => {
        const hero = document.querySelector(".svg"); // hero section
        if (hero) {
          const heroBottom = hero.getBoundingClientRect().bottom;
          if (heroBottom <= 0) {
            setShowNavbar(true); // show navbar after scrolling past hero
          } else {
            setShowNavbar(false);
          }
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // Other pages: always show navbar
      setShowNavbar(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showNavbar && (
        <div className="fixed top-0 left-0 w-full z-50 bg-[#00010a]/90 backdrop-blur-md shadow-lg transition-all duration-300">
          <div className="flex justify-center w-full">
            <PillNav
              logo="https://res.cloudinary.com/dludtk5vz/image/upload/v1757083555/CSS-LOGO_scfa6u.jpg"
              logoAlt="CSS"
              items={[
                { label: "Home", href: "/" },
                { label: "Wings", href: "/wings" },
                { label: "Events", href: "/events" },
                { label: "Members", href: "/members" },
                { label: "Editorials", href: "/editorials" },
                { label: "Developers", href: "/developers" },
              ]}
              activeHref={activeHref}
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#000000"
              pillColor="#0f172a"
              hoveredPillTextColor="#06b6d4"
              pillTextColor="#ffffff"
              initialLoadAnimation={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
