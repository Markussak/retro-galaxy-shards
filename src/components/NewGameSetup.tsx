import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface NewGameSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

type SetupStep = 'game-settings' | 'pilot-creation' | 'ship-selection' | 'crew-selection' | 'summary';

export const NewGameSetup: React.FC<NewGameSetupProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('game-settings');
  const [gameData, setGameData] = useState({
    pilotName: '',
    shipType: 'explorer',
    galaxySize: 'medium',
    difficulty: 'normal'
  });

  const steps = [
    { id: 'game-settings', title: 'NASTAVENÍ HRY' },
    { id: 'pilot-creation', title: 'TVORBA PILOTA' },
    { id: 'ship-selection', title: 'VÝBĚR LODI' },
    { id: 'crew-selection', title: 'VÝBĚR POSÁDKY' },
    { id: 'summary', title: 'SHRNUTÍ' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as SetupStep);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as SetupStep);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'game-settings':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'hsl(var(--hull-primary))' }}>
                Velikost galaxie:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['small', 'medium', 'large'].map(size => (
                  <Button
                    key={size}
                    className={`space-button ${gameData.galaxySize === size ? 'active' : ''}`}
                    onClick={() => setGameData({...gameData, galaxySize: size})}
                  >
                    {size.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2" style={{ color: 'hsl(var(--hull-primary))' }}>
                Obtížnost:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'normal', 'hard'].map(diff => (
                  <Button
                    key={diff}
                    className={`space-button ${gameData.difficulty === diff ? 'active' : ''}`}
                    onClick={() => setGameData({...gameData, difficulty: diff})}
                  >
                    {diff.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pilot-creation':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'hsl(var(--hull-primary))' }}>
                Jméno pilota:
              </label>
              <Input
                value={gameData.pilotName}
                onChange={(e) => setGameData({...gameData, pilotName: e.target.value})}
                placeholder="Zadejte jméno..."
                className="space-input"
              />
            </div>
            
            <div className="space-panel p-4">
              <div className="text-xs mb-2 glow-text" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
                POČÁTEČNÍ DOVEDNOSTI
              </div>
              <div className="grid grid-cols-2 gap-4 text-[10px]" style={{ color: 'hsl(var(--hull-primary))' }}>
                <div>Pilotování: 5</div>
                <div>Navigace: 3</div>
                <div>Inženýrství: 2</div>
                <div>Obchod: 2</div>
              </div>
            </div>
          </div>
        );

      case 'ship-selection':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { type: 'explorer', name: 'PRŮZKUMNÍK', desc: 'Vyvážená lod pro dlouhé cesty' },
                { type: 'trader', name: 'OBCHODNÍK', desc: 'Velký nákladní prostor' },
                { type: 'fighter', name: 'STÍHAČKA', desc: 'Rychlá a dobře vyzbrojená' }
              ].map(ship => (
                <Card 
                  key={ship.type}
                  className={`space-panel cursor-pointer p-4 ${gameData.shipType === ship.type ? 'border-accent-friendly' : ''}`}
                  onClick={() => setGameData({...gameData, shipType: ship.type})}
                >
                  <div className="text-sm font-bold mb-1" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
                    {ship.name}
                  </div>
                  <div className="text-xs" style={{ color: 'hsl(var(--hull-primary))' }}>
                    {ship.desc}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'crew-selection':
        return (
          <div className="space-y-6">
            <div className="space-panel p-4">
              <div className="text-sm mb-4 glow-text" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
                POČÁTEČNÍ POSÁDKA
              </div>
              <div className="space-y-2 text-[10px]" style={{ color: 'hsl(var(--hull-primary))' }}>
                <div>• Navigátor Chen (Navigace +2)</div>
                <div>• Inženýr Rodriguez (Opravy +2)</div>
                <div>• Obchodník Kim (Vyjednávání +1)</div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="space-panel p-4">
              <div className="text-sm mb-4 glow-text" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
                SHRNUTÍ NASTAVENÍ
              </div>
              <div className="space-y-2 text-[10px]" style={{ color: 'hsl(var(--hull-primary))' }}>
                <div>Pilot: {gameData.pilotName || 'Neznámý'}</div>
                <div>Lod: {gameData.shipType.toUpperCase()}</div>
                <div>Galaxie: {gameData.galaxySize.toUpperCase()}</div>
                <div>Obtížnost: {gameData.difficulty.toUpperCase()}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="space-panel m-4 p-4">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-[8px] px-2 py-1 ${
                index <= currentStepIndex
                  ? 'glow-text'
                  : ''
              }`}
              style={{
                color: index <= currentStepIndex
                  ? 'hsl(var(--fx-glow-cyan))'
                  : 'hsl(var(--hull-secondary))'
              }}
            >
              {step.title}
            </div>
          ))}
        </div>
        
        <div className="gauge-bar h-2">
          <div
            className="gauge-fill h-full"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              backgroundColor: 'hsl(var(--fx-glow-cyan))'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="space-panel p-8 max-w-lg w-full">
          <h2 className="text-lg mb-6 text-center glow-text" style={{ color: 'hsl(var(--fx-glow-cyan))' }}>
            {steps[currentStepIndex].title}
          </h2>
          
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              className="space-button"
              onClick={prevStep}
            >
              ZPĚT
            </Button>
            
            <Button
              className="space-button"
              onClick={nextStep}
              disabled={currentStep === 'pilot-creation' && !gameData.pilotName.trim()}
            >
              {currentStep === 'summary' ? 'ZAČÍT HRU' : 'DALŠÍ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};