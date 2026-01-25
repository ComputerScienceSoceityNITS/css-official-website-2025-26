import React from "react";
import { useNavigate } from "react-router-dom";



// 🔁 Replace with your real Cloudinary image URL
const heroImage =
  "https://res.cloudinary.com/do6mppbza/image/upload/v1769339007/WhatsApp_Image_2026-01-25_at_3.03.28_PM_ehnwhl.jpg";

  const sportEmojis = {
  Cricket: "🏏",
  Football: "⚽",
  Volleyball: "🏐",
  Kabaddi: "🤼",
  Badminton: "🏸",
  Chess: "♟️",
  "Table Tennis": "🏓",
  Athletics: "🏃",
  "Tug of War": "🪢",
  "Dodge Ball": "🤾",
  "Arm Wrestling": "💪",
};


// 🔁 Replace these with real Google Form links
const registrationLinks = {
  Cricket: "https://forms.gle/Uq3JcC3itwm5qNW36",
  Football: "https://forms.gle/LTZ9RWB3VCUwFaqcA",
  Volleyball: "https://forms.gle/ZELRMRWhmuyxCTb77",
  Kabaddi: "https://forms.gle/x6eGMGmHRSedTkR98",
  Badminton: "https://forms.gle/wXWrB9RDLY8NMz957",
  Chess: "https://forms.gle/PFyw7SE6YJyMTbEt9",
  "Table Tennis" : "https://forms.gle/YXDByMZcNgGdsMx76",
  Athletics: "https://docs.google.com/forms/d/e/1FAIpQLSdwTp7iA5HPmk9Spr8o0tFiceA528FJuRr0UrFyxVt0P4sasg/viewform",
  "Tug of War" : "https://forms.gle/1M8rWPchs5izVttf6",
  "Dodge Ball": "https://docs.google.com/forms/d/e/1FAIpQLScY6mzCA6oLhOjCJbIP5L2sBHWMsml6a1axZ72H76VbqWvLzA/viewform",
  "Arm Wrestling" : "https://docs.google.com/forms/d/e/1FAIpQLSdPh9jPhOknf8KPVUn-CpUH5Ah0sYc0p_fIk_vk3AT2EhosEQ/viewform",
};

const sports = Object.keys(registrationLinks);

const CSSOlympics = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[linear-gradient(to_right,#000000_55%,#021547_100%)] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <div className="mb-6">
        <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                    bg-gray-800 hover:bg-gray-700 text-cyan-400 
                    border border-cyan-500/30 transition-colors"
        >
            ← Back to Events
        </button>
        </div>


        {/* ================= TITLE SECTION ================= */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">
            CSS Olympics 🏆
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            A celebration of athletic excellence, unity, and competitive spirit.
            Join us in one of the biggest sporting events of CSS.
          </p>
        </div>

        {/* ================= HERO SECTION ================= */}
        <div className="mb-14">
          <div className="relative bg-black/70 border border-cyan-500/30 rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden items-center">


            {/* Terminal Box */}
            <div className="font-mono text-sm md:text-base text-gray-200 order-2 md:order-1">

              <div className="flex items-center gap-2 mb-3 text-cyan-400">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-xs tracking-widest">SYSTEM_TERMINAL</span>
              </div>

              <p className="leading-relaxed">
                <span className="text-cyan-400">$~</span> CSS Olympics is the
                flagship multi-sport competition organized by the Computer
                Science Society to promote teamwork, leadership, discipline, and
                sportsmanship among students.
                <br /><br />
                <span className="text-cyan-400">$~</span> Participate across
                multiple indoor and outdoor games, represent your teams, and
                compete for glory beyond academics.
                <br /><br />
                <span className="text-cyan-400">$~</span>_
              </p>

              <div className="flex gap-4 mt-6 text-xs">
                <span className="px-3 py-1 border border-green-500/40 text-green-400 rounded-full">
                  ● ACTIVE
                </span>
                <span className="px-3 py-1 border border-cyan-500/40 text-cyan-400 rounded-full">
                  ● MULTI-SPORT
                </span>
              </div>
            </div>

            {/* Image Panel */}
            <div className="relative border border-cyan-500/40 rounded-xl p-3 bg-black/60 flex flex-col justify-center order-1 md:order-2">


              {/* Cyber corners */}
              <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></span>
              <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></span>
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></span>
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></span>

              <img
                src={heroImage}
                alt="CSS Olympics"
                loading="lazy"
                className="rounded-lg w-full max-h-[300px] md:max-h-[350px] object-contain mx-auto"
              />

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-cyan-400 mb-1">
                  <span>IMG_PROC</span>
                  <span>100%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-cyan-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SPORTS LIST ================= */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">
            Sports List
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <div
                key={sport}
                className="bg-gray-900/70 border border-cyan-500/30 rounded-xl p-5 text-center hover:scale-105 transition-transform duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center justify-center gap-2">
                    <span>{sportEmojis[sport]}</span>
                    <span>{sport}</span>
                </h3>


                <a
                  href={registrationLinks[sport]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-semibold rounded-lg
                             bg-cyan-600 hover:bg-cyan-700 text-white transition-colors duration-300"
                >
                  Register Now
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CSSOlympics;
