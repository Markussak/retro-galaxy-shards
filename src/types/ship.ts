export interface Vector2D {
  x: number;
  y: number;
}

export interface Ship {
  // Position and movement
  position: Vector2D;
  velocity: Vector2D;
  rotation: number;
  
  // Ship status
  hull: number;          // 0-100%
  shields: number;       // 0-100%
  fuel: number;          // 0-100%
  energy: number;        // 0-100%
  thrust: number;        // 0-100%
  cargoWeight: number;   // 0-100% of cargo capacity
  
  // Ship systems
  systems: {
    shields: boolean;
    warp: boolean;
    engines: boolean;
    reactor: boolean;
  };
  
  // Ship damage (8 sections)
  damage: boolean[];
  
  // Movement states
  isThrusting: boolean;
  
  // Capabilities
  maxSpeed: number;
  thrustPower: number;
  rotationSpeed: number;
}