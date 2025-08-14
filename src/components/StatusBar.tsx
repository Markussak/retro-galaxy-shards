import React from 'react';
import { Ship } from '../types/ship';
import { Button } from './ui/button';

interface StatusBarProps {
  ship: Ship | null;
  onShipUpdate: (ship: Ship) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ ship, onShipUpdate }) => {
  if (!ship) return null;

  const toggleSystem = (system: keyof Ship['systems']) => {
    if (!ship) return;
    
    const updatedShip = {
      ...ship,
      systems: {
        ...ship.systems,
        [system]: !ship.systems[system]
      }
    };
    onShipUpdate(updatedShip);
  };

  const getBarColor = (value: number, type: 'health' | 'energy' | 'warning') => {
    if (type === 'health') {
      if (value > 60) return 'hsl(var(--accent-friendly))';
      if (value > 30) return 'hsl(var(--fx-glow-orange))';
      return 'hsl(var(--accent-hostile))';
    }
    if (type === 'energy') return 'hsl(var(--fx-glow-cyan))';
    return 'hsl(var(--accent-neutral))';
  };

  const updateShipEnergy = () => {
    if (!ship) return;
    
    let energyDrain = 0;
    if (ship.systems.shields) energyDrain += 0.1;
    if (ship.systems.warp) energyDrain += 0.2;
    if (ship.systems.engines) energyDrain += 0.05;
    if (ship.isThrusting) energyDrain += 0.3;
    
    const newEnergy = Math.max(0, ship.energy - energyDrain);
    const regeneration = ship.systems.reactor ? 0.15 : 0;
    const finalEnergy = Math.min(100, newEnergy + regeneration);
    
    if (finalEnergy !== ship.energy) {
      onShipUpdate({
        ...ship,
        energy: finalEnergy,
        systems: {
          ...ship.systems,
          shields: finalEnergy > 10 ? ship.systems.shields : false,
          warp: finalEnergy > 20 ? ship.systems.warp : false
        }
      });
    }
  };

  // Energy management
  React.useEffect(() => {
    const interval = setInterval(updateShipEnergy, 100);
    return () => clearInterval(interval);
  }, [ship]);

  return (
    <div className="status-bar fixed bottom-0 left-0 w-full h-[15%] flex items-stretch z-50">
      {/* Ship Systems Panel */}
      <div className="space-panel flex-1 mx-1 p-2">
        <div className="text-[8px] text-center mb-2 glow-text font-bold">SHIP SYSTEMS</div>
        
        <div className="space-y-1">
          <div className="flex items-center text-[6px]">
            <span className="w-8 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>HULL</span>
            <div className="gauge-bar flex-1 h-2 ml-2">
              <div 
                className="gauge-fill h-full"
                style={{ 
                  width: `${ship.hull}%`,
                  backgroundColor: getBarColor(ship.hull, 'health')
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center text-[6px]">
            <span className="w-8 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>SHLD</span>
            <div className="gauge-bar flex-1 h-2 ml-2">
              <div 
                className="gauge-fill h-full"
                style={{ 
                  width: `${ship.shields}%`,
                  backgroundColor: getBarColor(ship.shields, 'energy')
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center text-[6px]">
            <span className="w-8 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>FUEL</span>
            <div className="gauge-bar flex-1 h-2 ml-2">
              <div 
                className="gauge-fill h-full"
                style={{ 
                  width: `${ship.fuel}%`,
                  backgroundColor: getBarColor(ship.fuel, 'warning')
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center text-[6px]">
            <span className="w-8 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>ENGY</span>
            <div className="gauge-bar flex-1 h-2 ml-2">
              <div 
                className="gauge-fill h-full"
                style={{ 
                  width: `${ship.energy}%`,
                  backgroundColor: getBarColor(ship.energy, 'energy')
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ship Control Panel */}
      <div className="space-panel flex-1 mx-1 p-2">
        <div className="text-[8px] text-center mb-2 glow-text font-bold">CONTROLS</div>
        
        <div className="grid grid-cols-2 gap-1 mb-2">
          <button 
            className={`space-button text-[6px] py-1 ${ship.systems.shields ? 'active' : ''}`}
            onClick={() => toggleSystem('shields')}
          >
            SHLD
          </button>
          <button 
            className={`space-button text-[6px] py-1 ${ship.systems.warp ? 'active' : ''}`}
            onClick={() => toggleSystem('warp')}
          >
            WARP
          </button>
          <button 
            className={`space-button text-[6px] py-1 ${ship.systems.engines ? 'active' : ''}`}
            onClick={() => toggleSystem('engines')}
          >
            ENG
          </button>
          <button 
            className={`space-button text-[6px] py-1 ${ship.systems.reactor ? 'active' : ''}`}
            onClick={() => toggleSystem('reactor')}
          >
            RCTR
          </button>
        </div>
        
        <div className="flex items-center text-[6px]">
          <span className="w-8 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>THRT</span>
          <div className="gauge-bar flex-1 h-2 ml-2">
            <div 
              className="gauge-fill h-full"
              style={{ 
                width: `${ship.thrust}%`,
                backgroundColor: 'hsl(var(--fx-glow-orange))'
              }}
            />
          </div>
        </div>
      </div>

      {/* Central Monitor Panel */}
      <div className="space-panel flex-1 mx-1 p-2">
        <div className="text-[8px] text-center mb-2 glow-text font-bold">SHIP STATUS</div>
        
        <div className="crt-monitor h-8 p-1 mb-2">
          <div className="grid grid-cols-4 gap-px h-full">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="border border-border flex items-center justify-center text-[4px]"
                style={{
                  backgroundColor: `hsla(var(--accent-friendly), ${ship.damage[i] ? 0.6 : 0.1})`
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-[6px]">
          <span className="w-12 text-left" style={{ color: 'hsl(var(--hull-primary))' }}>CARGO</span>
          <div className="gauge-bar flex-1 h-2 ml-2">
            <div 
              className="gauge-fill h-full"
              style={{ 
                width: `${ship.cargoWeight}%`,
                backgroundColor: getBarColor(ship.cargoWeight, 'warning')
              }}
            />
          </div>
        </div>
      </div>

      {/* Weapons Systems Panel */}
      <div className="space-panel flex-1 mx-1 p-2">
        <div className="text-[8px] text-center mb-2 glow-text font-bold">WEAPONS</div>
        
        <div className="grid grid-cols-2 gap-1 mb-2">
          <button className="space-button text-[6px] py-1 active">LASER</button>
          <button className="space-button text-[6px] py-1">RAIL</button>
          <button className="space-button text-[6px] py-1">MISS</button>
          <button className="space-button text-[6px] py-1">TORP</button>
        </div>
        
        <div className="crt-monitor h-4 p-1">
          <div className="text-[4px] text-center" style={{ color: 'hsl(var(--hull-primary))' }}>
            DMG: 15 RNG: 800m<br />
            EFF: 95% HEAT: 12%
          </div>
        </div>
      </div>

      {/* Navigation/Radar Panel */}
      <div className="space-panel flex-1 mx-1 p-2">
        <div className="text-[8px] text-center mb-2 glow-text font-bold">NAVIGATION</div>
        
        <div className="space-radar h-12 mb-2 relative">
          {/* Radar sweep animation */}
          <div 
            className="absolute w-1/2 h-px top-1/2 left-1/2 origin-left"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(var(--fx-glow-cyan)) 100%)',
              animation: 'spin 4s linear infinite'
            }}
          />
          
          {/* Ship position (center) */}
          <div 
            className="absolute w-1 h-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: 'hsl(var(--fx-glow-cyan))' }}
          />
        </div>
        
        <div className="flex gap-1">
          <button className="space-button text-[6px] flex-1 py-1">ZOOM</button>
          <button className="space-button text-[6px] flex-1 py-1">MAP</button>
        </div>
      </div>
    </div>
  );
};

// Add the spin animation to the global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);