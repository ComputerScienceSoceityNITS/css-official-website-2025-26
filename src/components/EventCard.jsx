import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const EventCard = ({ event, onRegister, isRegistered, isPast = false }) => {
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  const handleRegistrationClick = async () => {
    if (isRegistered || isPast) return;
    const success = await onRegister(event.id);
    if (success) {
      setShowWhatsapp(true);
    }
  };

  const formattedDate = event.date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div
      data-arch="fade"
      className={`group flex h-full flex-col border border-arch-line bg-arch-card transition-colors duration-500 ${isPast ? 'opacity-55' : 'hover:bg-arch-bg-alt'}`}
    >
      <div className="overflow-hidden border-b border-arch-line" data-arch="mask">
        <img
          src={event.image}
          alt={event.name}
          className="h-52 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-8">
        <p className="arch-label">{formattedDate}</p>
        <h3 className="arch-title mt-4 text-2xl">{event.name}</h3>
        <p className="arch-body mt-4 grow">{event.description}</p>

        {showWhatsapp || (isRegistered && !isPast) ? (
          <a
            href={event.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="arch-btn mt-8 w-full"
          >
            <FaWhatsapp />
            <span>Join WhatsApp</span>
          </a>
        ) : (
          <button
            className="arch-btn mt-8 w-full"
            onClick={handleRegistrationClick}
            disabled={isPast || isRegistered}
          >
            <span>{isPast ? 'Event Over' : isRegistered ? 'Registered' : 'Register'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;