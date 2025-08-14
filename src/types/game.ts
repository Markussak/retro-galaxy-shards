import { Ship } from './ship';

export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid' | 'comet' | 'station';
  position: { x: number; y: number };
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  hasAtmosphere?: boolean;
  resources?: string[];
}

export interface StarSystem {
  id: string;
  name: string;
  position: { x: number; y: number };
  bodies: CelestialBody[];
  discoveredAt?: Date;
}

export interface GameState {
  // Player ship
  ship: Ship | null;
  
  // Current location
  currentSystem: StarSystem | null;
  currentScene: 'system' | 'interstellar';
  
  // Galaxy data
  discoveredSystems: StarSystem[];
  
  // UI state
  isPaused: boolean;
  showingPopup: boolean;
  currentPopupType?: 'system-boundary' | 'celestial-approach' | 'communication';
  
  // Player progress
  experience: number;
  researchPoints: number;
  credits: number;
  
  // Time
  gameTime: number;
}