import React, { useEffect } from 'react';
// Side-effect import: this file's own markup no longer uses any of these
// classes, but src/pages/Home.jsx's pillar cards (.flip-card-inner,
// .mac-dots, .neon-border, .card-hover …) do, and Chatbot is the only
// place this stylesheet is imported anywhere in the app. Chatbot renders
// on every route, so this is what keeps that CSS in the bundle at all —
// removing it would silently break the pillars flip animation.
import '../../styles/chatbot.css';

const Chatbot = () => {
  useEffect(() => {
    const handleMessengerLoaded = () => {
      try {
        const dfMessenger = document.querySelector('df-messenger');
        if (!dfMessenger) return;

        // 1. Inject custom launcher button styles into df-messenger's shadowRoot
        if (dfMessenger.shadowRoot) {
          if (!dfMessenger.shadowRoot.querySelector('#df-custom-launcher-style')) {
            const launcherStyle = document.createElement('style');
            launcherStyle.id = 'df-custom-launcher-style';
            launcherStyle.textContent = `
              button#widgetIcon {
                border-radius: 0px !important;
                background: #1C1C1C !important;
                box-shadow: none !important;
                border: 1px solid #1C1C1C !important;
                width: 56px !important;
                height: 56px !important;
                right: 24px !important;
                bottom: 24px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                            color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                            border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
              }
              button#widgetIcon:hover {
                background: #F4F3EF !important;
                border-color: #1C1C1C !important;
              }
              button#widgetIcon svg {
                fill: #F4F3EF !important;
                width: 24px !important;
                height: 24px !important;
                transition: fill 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
              }
              button#widgetIcon:hover svg {
                fill: #1C1C1C !important;
              }
              button#widgetIcon img {
                width: 32px !important;
                height: 32px !important;
                object-fit: contain !important;
                transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
              }
              button#widgetIcon:hover img {
                transform: scale(1.1) !important;
              }
            `;
            dfMessenger.shadowRoot.appendChild(launcherStyle);
          }
        }

        // 2. Inject custom mobile/responsive styles into df-messenger-chat's shadowRoot
        if (dfMessenger.shadowRoot) {
          const chat = dfMessenger.shadowRoot.querySelector('df-messenger-chat');
          if (chat && chat.shadowRoot) {
            if (!chat.shadowRoot.querySelector('#df-custom-mobile-style')) {
              const mobileStyle = document.createElement('style');
              mobileStyle.id = 'df-custom-mobile-style';
              mobileStyle.textContent = `
                @media screen and (max-width: 500px) {
                  .chat-wrapper {
                    bottom: 90px !important;
                    right: 24px !important;
                    width: 320px !important;
                    max-width: calc(100vw - 48px) !important;
                    height: 480px !important;
                    max-height: 70vh !important;
                    border-radius: 0px !important;
                    border: 1px solid #E0DED8 !important;
                    box-shadow: none !important;
                  }
                }
              `;
              chat.shadowRoot.appendChild(mobileStyle);
            }
          }
        }
      } catch (err) {
        console.warn('Could not inject Dialogflow styles into shadow root:', err);
      }
    };

    window.addEventListener('dfMessengerLoaded', handleMessengerLoaded);

    // Run immediately if already loaded
    const dfMessenger = document.querySelector('df-messenger');
    if (dfMessenger && dfMessenger.shadowRoot) {
      handleMessengerLoaded();
    }

    return () => {
      window.removeEventListener('dfMessengerLoaded', handleMessengerLoaded);
    };
  }, []);

  return null;
};

export default Chatbot;
