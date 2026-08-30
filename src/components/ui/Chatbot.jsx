import React from 'react';
// Side-effect import: this file's own markup no longer uses any of these
// classes, but src/pages/Home.jsx's pillar cards (.flip-card-inner,
// .mac-dots, .neon-border, .card-hover …) do, and Chatbot is the only
// place this stylesheet is imported anywhere in the app. Chatbot renders
// on every route, so this is what keeps that CSS in the bundle at all —
// removing it would silently break the pillars flip animation.
import '../../styles/chatbot.css';

const Chatbot = () => {
  return null;
};

export default Chatbot;
