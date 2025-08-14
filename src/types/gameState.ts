export type GameScreen = 'menu' | 'game' | 'loading';

export interface GameSettings {
  pilotName: string;
  shipType: 'explorer' | 'trader' | 'fighter';
  galaxySize: 'small' | 'medium' | 'large';
  difficulty: 'easy' | 'normal' | 'hard';
}