import React, { useState, useEffect } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { StatusBar } from '../components/StatusBar';
import { CRTOverlay } from '../components/CRTOverlay';
import { LoadingScreen } from '../components/LoadingScreen';
import { MainMenu } from '../components/MainMenu';
import { GameState } from '../types/game';
import { Ship } from '../types/ship';
import { GameScreen } from '../types/gameState';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('loading');
  const [gameState, setGameState] = useState<GameState>({
    ship: null,
    currentSystem: null,
    currentScene: 'system',
    discoveredSystems: [],
    isPaused: false,
    showingPopup: false,
    experience: 0,
    researchPoints: 0,
    credits: 1000,
    gameTime: 0
  });

  // Initialize game state
  useEffect(() => {
    if (currentScreen === 'game' && !gameState.ship) {
      const initialShip: Ship = {
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        velocity: { x: 0, y: 0 },
        rotation: 0,
        hull: 100,
        shields: 85,
        fuel: 75,
        energy: 90,
        thrust: 50,
        cargoWeight: 25,
        systems: {
          shields: true,
          warp: false,
          engines: true,
          reactor: true
        },
        damage: Array(8).fill(false),
        isThrusting: false,
        maxSpeed: 8,
        thrustPower: 0.3,
        rotationSpeed: 0.05
      };

      setGameState(prev => ({ ...prev, ship: initialShip }));
    }
  }, [currentScreen, gameState.ship]);

  const handleLoadingComplete = () => {
    setCurrentScreen('menu');
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const handleShipUpdate = (ship: Ship) => {
    setGameState(prev => ({ ...prev, ship }));
  };

  if (currentScreen === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (currentScreen === 'menu') {
    return (
      <>
        <MainMenu onStartGame={handleStartGame} />
        <CRTOverlay />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <GameCanvas 
        gameState={gameState} 
        onGameStateChange={handleGameStateChange}
      />
      
      <StatusBar 
        ship={gameState.ship} 
        onShipUpdate={handleShipUpdate}
      />
      
      <CRTOverlay />
      
      {/* Game instructions overlay */}
      <div className="fixed top-4 left-4 z-30 text-xs font-mono max-w-sm">
        <div 
          className="space-panel p-3 opacity-80"
          style={{ color: 'hsl(var(--hull-primary))' }}
        >
          <div className="glow-text text-[10px] font-bold mb-2">FLIGHT CONTROLS</div>
          <div className="text-[8px] space-y-1">
            <div>W / ↑ - Thrust Forward</div>
            <div>A / ← - Rotate Left</div>
            <div>D / → - Rotate Right</div>
            <div>S / ↓ - Reverse Thrust</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
