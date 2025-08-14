import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingMessages = [
  "INITIALIZING QUANTUM MATRIX...",
  "CALIBRATING STELLAR CARTOGRAPHY...",
  "ESTABLISHING NEURAL LINK...",
  "LOADING SHIP SYSTEMS...",
  "SYNCHRONIZING WARP CORE...",
  "ACTIVATING LIFE SUPPORT...",
  "CONNECTING TO GALACTIC NETWORK...",
  "FINALIZING INITIALIZATION..."
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update message based on progress
        const messageIndex = Math.min(
          Math.floor((newProgress / 100) * loadingMessages.length),
          loadingMessages.length - 1
        );
        setCurrentMessage(messageIndex);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200 + Math.random() * 300); // Randomize timing for authenticity

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: `
          linear-gradient(135deg, 
            hsl(var(--space-void)) 0%, 
            hsla(var(--space-void), 0.8) 50%, 
            hsl(var(--space-void)) 100%
          ),
          repeating-linear-gradient(
            45deg,
            transparent 0px,
            transparent 20px,
            hsla(var(--accent-friendly), 0.02) 20px,
            hsla(var(--accent-friendly), 0.02) 40px
          )
        `
      }}
    >
      <h1 
        className="text-2xl md:text-4xl mb-8 font-bold"
        style={{
          fontFamily: 'Orbitron, monospace',
          color: 'hsl(var(--fx-glow-cyan))',
          textShadow: `
            0 0 8px hsl(var(--fx-glow-cyan)),
            0 0 16px hsl(var(--accent-friendly)),
            0 0 24px hsl(var(--fx-glow-energy))
          `,
          animation: 'title-glow 3s ease-in-out infinite alternate'
        }}
      >
        SPACE EXPLORER 16-BIT
      </h1>
      
      <div 
        className="w-96 h-4 mb-5 relative overflow-hidden"
        style={{
          background: 'hsl(var(--space-void))',
          border: '2px solid hsl(var(--accent-friendly))'
        }}
      >
        <div 
          className="h-full transition-all duration-300 ease-out relative"
          style={{
            width: `${progress}%`,
            background: `
              linear-gradient(90deg, 
                hsl(var(--accent-friendly)) 0%, 
                hsl(var(--fx-glow-cyan)) 50%, 
                hsl(var(--fx-glow-energy)) 100%
              )
            `
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent 0px,
                transparent 2px,
                rgba(0, 0, 0, 0.3) 2px,
                rgba(0, 0, 0, 0.3) 4px
              )
            `
          }}
        />
      </div>
      
      <div 
        className="mt-4 text-xs font-mono"
        style={{
          color: 'hsl(var(--accent-friendly))',
          letterSpacing: '0.1em'
        }}
      >
        {loadingMessages[currentMessage]}
      </div>
      
      <div 
        className="absolute bottom-20 max-w-lg text-xs leading-relaxed font-mono"
        style={{
          color: 'hsl(var(--hull-secondary))',
          textAlign: 'left'
        }}
      >
        <div className="mb-2">SYSTEM STATUS:</div>
        <div>QUANTUM DRIVE: <span style={{ color: 'hsl(var(--fx-glow-cyan))' }}>NOMINAL</span></div>
        <div>LIFE SUPPORT: <span style={{ color: 'hsl(var(--fx-glow-cyan))' }}>ACTIVE</span></div>
        <div>NAVIGATION: <span style={{ color: 'hsl(var(--fx-glow-orange))' }}>CALIBRATING</span></div>
        <div>WEAPONS: <span style={{ color: 'hsl(var(--accent-hostile))' }}>OFFLINE</span></div>
        <div>SHIELDS: <span style={{ color: 'hsl(var(--accent-friendly))' }}>STANDBY</span></div>
      </div>
    </div>
  );
};

// Add title glow animation
const style = document.createElement('style');
style.textContent = `
  @keyframes title-glow {
    0% { 
      text-shadow: 
        0 0 8px hsl(var(--fx-glow-cyan)), 
        0 0 15px hsl(var(--accent-friendly)); 
    }
    100% { 
      text-shadow: 
        0 0 15px hsl(var(--fx-glow-cyan)), 
        0 0 25px hsl(var(--accent-friendly)), 
        0 0 35px hsl(var(--fx-glow-energy)); 
    }
  }
`;
if (!document.head.querySelector('style[data-title-glow]')) {
  style.setAttribute('data-title-glow', 'true');
  document.head.appendChild(style);
}