import React, { useRef, useEffect, useState } from 'react';
import { Ship } from '../types/ship';
import { GameState } from '../types/game';
import playerShipImage from '../assets/player-ship.png';
import starfieldImage from '../assets/starfield-bg.png';
import planetImage from '../assets/planet-rocky.png';

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<{[key: string]: HTMLImageElement}>({});

  // Load game assets
  useEffect(() => {
    const loadImages = async () => {
      const imageUrls = {
        playerShip: playerShipImage,
        starfield: starfieldImage,
        planet: planetImage
      };

      const loadedImages: {[key: string]: HTMLImageElement} = {};
      
      for (const [key, url] of Object.entries(imageUrls)) {
        const img = new Image();
        img.src = url;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        loadedImages[key] = img;
      }
      
      setImages(loadedImages);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  // Game loop
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.85; // Account for status bar
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Camera offset for following the ship
    let cameraX = 0;
    let cameraY = 0;

    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;

    let lastTime = 0;
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update camera to follow ship
      if (gameState.ship) {
        const targetX = canvas.width / 2 - gameState.ship.position.x;
        const targetY = canvas.height / 2 - gameState.ship.position.y;
        
        // Smooth camera following
        cameraX += (targetX - cameraX) * 0.1;
        cameraY += (targetY - cameraY) * 0.1;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(cameraX, cameraY);

      // Draw starfield background (with parallax)
      if (images.starfield) {
        ctx.drawImage(images.starfield, -cameraX * 0.2, -cameraY * 0.2, canvas.width, canvas.height);
      }

      // Draw celestial bodies (example planet)
      if (images.planet) {
        const planetX = 300;
        const planetY = 200;
        const planetSize = 100;
        ctx.drawImage(images.planet, planetX - planetSize/2, planetY - planetSize/2, planetSize, planetSize);
      }

      // Draw player ship
      if (images.playerShip && gameState.ship) {
        const ship = gameState.ship;
        const shipSize = 40;
        
        ctx.save();
        ctx.translate(ship.position.x, ship.position.y);
        ctx.rotate(ship.rotation);
        ctx.drawImage(images.playerShip, -shipSize/2, -shipSize/2, shipSize, shipSize);
        ctx.restore();

        // Draw engine trail if thrusting
        if (ship.isThrusting) {
          const trailLength = 20;
          const trailWidth = 8;
          
          ctx.save();
          ctx.translate(ship.position.x, ship.position.y);
          ctx.rotate(ship.rotation);
          
          // Create gradient for engine trail
          const gradient = ctx.createLinearGradient(-shipSize/2, 0, -shipSize/2 - trailLength, 0);
          gradient.addColorStop(0, '#ff8c00');
          gradient.addColorStop(0.5, '#ff4400');
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(-shipSize/2 - trailLength, -trailWidth/2, trailLength, trailWidth);
          ctx.restore();
        }
      }

      ctx.restore();

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, images, gameState]);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.ship) return;

      const ship = { ...gameState.ship };
      const thrustPower = 0.3;
      const rotationSpeed = 0.05;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          ship.isThrusting = true;
          ship.velocity.x += Math.cos(ship.rotation) * thrustPower;
          ship.velocity.y += Math.sin(ship.rotation) * thrustPower;
          break;
        case 'a':
        case 'arrowleft':
          ship.rotation -= rotationSpeed;
          break;
        case 'd':
        case 'arrowright':
          ship.rotation += rotationSpeed;
          break;
        case 's':
        case 'arrowdown':
          // Reverse thrust
          ship.velocity.x -= Math.cos(ship.rotation) * thrustPower * 0.5;
          ship.velocity.y -= Math.sin(ship.rotation) * thrustPower * 0.5;
          break;
      }

      onGameStateChange({ ...gameState, ship });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameState.ship) return;

      const ship = { ...gameState.ship };

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          ship.isThrusting = false;
          break;
      }

      onGameStateChange({ ...gameState, ship });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, onGameStateChange]);

  // Physics update
  useEffect(() => {
    const updatePhysics = () => {
      if (!gameState.ship) return;

      const ship = { ...gameState.ship };
      const friction = 0.99;
      const maxVelocity = 8;

      // Apply physics
      ship.position.x += ship.velocity.x;
      ship.position.y += ship.velocity.y;
      ship.velocity.x *= friction;
      ship.velocity.y *= friction;

      // Limit velocity
      const speed = Math.sqrt(ship.velocity.x ** 2 + ship.velocity.y ** 2);
      if (speed > maxVelocity) {
        ship.velocity.x = (ship.velocity.x / speed) * maxVelocity;
        ship.velocity.y = (ship.velocity.y / speed) * maxVelocity;
      }

      // Screen wrapping
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        if (ship.position.x < 0) ship.position.x = canvas.width;
        if (ship.position.x > canvas.width) ship.position.x = 0;
        if (ship.position.y < 0) ship.position.y = canvas.height;
        if (ship.position.y > canvas.height) ship.position.y = 0;
      }

      onGameStateChange({ ...gameState, ship });
    };

    const physicsInterval = setInterval(updatePhysics, 16); // ~60 FPS

    return () => clearInterval(physicsInterval);
  }, [gameState, onGameStateChange]);

  if (!imagesLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground">
        <div className="glow-text">Loading assets...</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block bg-background pixelated cursor-crosshair"
      style={{
        filter: 'brightness(0.9) contrast(1.2) saturate(0.8)',
      }}
    />
  );
};