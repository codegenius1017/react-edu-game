import React, { useRef, useEffect, useState } from "react";

const Ball = ({ x, y, size }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: "#00F",
        borderRadius: "50%",
      }}
    />
  );
};

export const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [boxX, setBoxX] = useState(0);
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const boxWidth = 100;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const handleKeydown = (e) => {
      if (e.key === "ArrowLeft" && boxX > 0) {
        setBoxX((prevX) => prevX - 10);
      } else if (e.key === "ArrowRight" && boxX < canvasWidth - boxWidth) {
        setBoxX((prevX) => prevX + 10);
      }
    };

    const spawnBall = () => {
      const x = Math.random() * (canvasWidth - 20);
      const ball = { x, y: 0, size: 20 };
      setBalls((prevBalls) => [...prevBalls, ball]);
    };

    const moveBalls = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => ({ ...ball, y: ball.y + 5 }))
      );
    };

    const checkCollision = () => {
      setBalls((prevBalls) =>
        prevBalls.filter((ball) => ball.y + ball.size < canvasHeight)
      );
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.fillStyle = "#F00";
      ctx.fillRect(boxX, canvasHeight - 50, boxWidth, 30);

      balls.forEach((ball) => {
        ctx.fillStyle = "#00F";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fill();
      });

      moveBalls();
      checkCollision();
      spawnBall();

      requestAnimationFrame(gameLoop);
    };

    const boxX = canvasWidth / 2 - boxWidth / 2;
    setBoxX(boxX);

    document.addEventListener("keydown", handleKeydown);

    const gameInterval = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(gameInterval);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [boxX, balls]);

  return <canvas ref={canvasRef} width={400} height={300} />;
};

export function GameCanvas1() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <GameCanvas />
    </div>
  );
}
