import React, { useState } from 'react';
import { Button } from './ui/button';
import { NewGameSetup } from './NewGameSetup';
import backgroundImage from '../assets/main-menu-bg.png';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [showSetup, setShowSetup] = useState(false);

  if (showSetup) {
    return <NewGameSetup onComplete={onStartGame} onBack={() => setShowSetup(false)} />;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        filter: 'brightness(0.8) contrast(1.1) saturate(0.9)'
      }}
    >
      {/* CRT Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />
      <div className="absolute inset-0 crt-effect pointer-events-none" />
      
      {/* Main Menu Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <div className="space-panel p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-8 glow-text" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
            SPACE EXPLORER
          </h1>
          <h2 className="text-sm mb-12" style={{ color: 'hsl(var(--hull-primary))' }}>
            16-BIT GALAXY WANDERER
          </h2>
          
          <div className="space-y-4">
            <Button 
              className="space-button w-full py-3 text-sm font-bold"
              onClick={() => setShowSetup(true)}
            >
              NOVÁ HRA
            </Button>
            
            <Button 
              className="space-button w-full py-3 text-sm font-bold"
              disabled
            >
              NAČÍST HRU
            </Button>
            
            <Button 
              className="space-button w-full py-3 text-sm font-bold"
              disabled
            >
              NASTAVENÍ
            </Button>
            
            <Button 
              className="space-button w-full py-3 text-sm font-bold"
              onClick={() => window.close()}
            >
              UKONČIT HRU
            </Button>
          </div>
        </div>
        
        {/* System Status */}
        <div className="absolute bottom-8 left-8 space-panel p-4 max-w-xs">
          <div className="text-[10px] mb-2 glow-text font-bold" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
            SYSTEM STATUS
          </div>
          <div className="space-y-1 text-[8px]" style={{ color: 'hsl(var(--hull-primary))' }}>
            <div>QUANTUM MATRIX: <span style={{ color: 'hsl(var(--fx-glow-cyan))' }}>ONLINE</span></div>
            <div>NAVIGATION: <span style={{ color: 'hsl(var(--fx-glow-cyan))' }}>READY</span></div>
            <div>LIFE SUPPORT: <span style={{ color: 'hsl(var(--fx-glow-orange))' }}>STANDBY</span></div>
            <div>WEAPONS: <span style={{ color: 'hsl(var(--accent-hostile))' }}>OFFLINE</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};