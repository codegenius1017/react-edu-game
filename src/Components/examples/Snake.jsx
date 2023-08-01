import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import randomColor from 'randomcolor';
import confetti from 'canvas-confetti';

const canvasSize = 20;
const scale = 20;

const Snake = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const draw = useCallback((ctx) => {
    // Limpar o Canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasSize * scale, canvasSize * scale);

    // Desenhar comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale);

    // Desenhar cobra
    ctx.fillStyle = 'green';
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
  }, [snake, food]);

  const moveSnake = useCallback(() => {
    // Movimentar a cobra
    const newSnake = snake.map((segment, index) => {
      if (index === 0) {
        switch (direction) {
          case 'UP':
            return { x: segment.x, y: segment.y - 1 };
          case 'DOWN':
            return { x: segment.x, y: segment.y + 1 };
          case 'LEFT':
            return { x: segment.x - 1, y: segment.y };
          case 'RIGHT':
            return { x: segment.x + 1, y: segment.y };
          default:
            return segment;
        }
      } else {
        return snake[index - 1];
      }
    });

    // Verificar colisões
    const head = newSnake[0];
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
      setGameOver(true);
      return;
    }

    newSnake.forEach((segment, index) => {
      if (index !== 0 && segment.x === head.x && segment.y === head.y) {
        setGameOver(true);
      }
    });

    // Comer a comida
    if (head.x === food.x && head.y === food.y) {
      setScore((prevScore) => prevScore + 1);
      const newFood = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
      setFood(newFood);

      // Adicionar um novo segmento à cobra
      newSnake.push({ ...newSnake[newSnake.length - 1] });
      confetti.create(document.getElementById('canvas'), {
        resize: true,
        particleCount: 100,
        spread: 70,
        colors: [randomColor(), randomColor(), randomColor()],
      });
    }

    setSnake(newSnake);
  }, [snake, food, direction]);

  const canvasContext = useMemo(() => {
    if (canvasRef.current) return canvasRef.current.getContext('2d');
  }, []);

  const handleKeyPress = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
      default:
        break;
    }
  }, []);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (!canvasContext) return
    if (!gameOver) {
      const ctx = canvasContext;
      draw(ctx);
      const gameInterval = setInterval(() => {
        draw(ctx);
        moveSnake();
      }, 200);

      document.addEventListener('keydown', handleKeyPress);

      return () => {
        clearInterval(gameInterval);
        document.removeEventListener('keydown', handleKeyPress);
      };
    } else {
      restartGame();
    }
  }, [snake, food, gameOver, draw, moveSnake, handleKeyPress, canvasContext]);

  return (
    <div>
      {gameOver ? (
        <div>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
        </div>
      ) : (
        <canvas ref={canvasRef} width={canvasSize * scale} height={canvasSize * scale} id="canvas" />
      )}
    </div>
  );
};

export default Snake;
