import React from 'react';

export const CRTOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40 crt-effect"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 255, 255, 0.02),
            rgba(0, 255, 255, 0.02) 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(255, 140, 0, 0.015),
            rgba(255, 140, 0, 0.015) 1px,
            transparent 1px,
            transparent 2px
          )
        `,
        animation: 'crt-flicker 0.2s infinite linear alternate'
      }}
    />
  );
};

// Add CRT flicker animation
const style = document.createElement('style');
style.textContent = `
  @keyframes crt-flicker {
    0% { opacity: 1; }
    98% { opacity: 1; }
    99% { opacity: 0.97; }
    100% { opacity: 0.95; }
  }
`;
if (!document.head.querySelector('style[data-crt]')) {
  style.setAttribute('data-crt', 'true');
  document.head.appendChild(style);
}