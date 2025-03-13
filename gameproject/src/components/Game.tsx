import { useEffect, useRef, useState } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface PlayerShip extends GameObject {
  power: number;
}

interface Obstacle extends GameObject {
  active: boolean;
}

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [powerLevel, setPowerLevel] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  const playerRef = useRef<PlayerShip>({
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    speed: 45,
    power: 100
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const animationFrameRef = useRef<number>();
  const lastObstacleTimeRef = useRef<number>(0);

  const moveUp = () => {
    playerRef.current.y = Math.max(0, playerRef.current.y - playerRef.current.speed);
  };

  const moveDown = () => {
    playerRef.current.y = Math.min(
      canvasSize.height - playerRef.current.height,
      playerRef.current.y + playerRef.current.speed
    );
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const width = window.innerWidth < 800 ? window.innerWidth - 20 : 800;
      const height = window.innerHeight < 600 ? window.innerHeight - 20 : 600;
      setCanvasSize({ width, height });
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const createObstacle = () => {
      const obstacle: Obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: 3 + Math.random() * 2,
        active: true
      };
      obstaclesRef.current.push(obstacle);
    };

    const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerShip) => {
      ctx.fillStyle = `rgba(236, 72, 153, ${player.power / 100})`;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y + player.height / 2);
      ctx.lineTo(player.x + player.width, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 10;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.shadowBlur = 0;
    };

    const checkCollision = (player: PlayerShip, obstacle: Obstacle) => {
      return player.x < obstacle.x + obstacle.width &&
             player.x + player.width > obstacle.x &&
             player.y < obstacle.y + obstacle.height &&
             player.y + player.height > obstacle.y;
    };

    const gameLoop = (timestamp: number) => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastObstacleTimeRef.current > 1000) {
        createObstacle();
        lastObstacleTimeRef.current = timestamp;
      }

      obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
        obstacle.x -= obstacle.speed;
        if (obstacle.x + obstacle.width < 0) return false;
        
        if (checkCollision(playerRef.current, obstacle)) {
          setPowerLevel(prev => {
            const newPower = prev - 10;
            if (newPower <= 0) setGameOver(true);
            return newPower;
          });
          return false;
        }

        drawObstacle(ctx, obstacle);
        return true;
      });

      drawPlayer(ctx, playerRef.current);

      setScore(prev => prev + 1);
      if (!gameOver) {
        setPowerLevel(prev => {
          const newPower = prev - 0.02;
          if (newPower <= 0) setGameOver(true);
          return newPower;
        });
      }

      if (!gameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameOver]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex justify-between w-full max-w-md px-4 text-white text-2xl font-extrabold tracking-wider">
        <span className="text-pink-400">Power: {powerLevel.toFixed(0)}</span>
        <span className="text-indigo-400">Score: {score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="bg-purple-900/30 rounded-lg shadow-xl max-w-full mt-2"
      />
      <div className="flex gap-4 mt-2 sm:hidden">
        <button onClick={moveUp} className="bg-pink-500 text-white px-4 py-2 rounded">Up</button>
        <button onClick={moveDown} className="bg-indigo-500 text-white px-4 py-2 rounded">Down</button>
      </div>
      {gameOver && <div className="absolute text-5xl font-extrabold text-white mt-10 animate-bounce">GAME OVER</div>}
    </div>
  );
}
