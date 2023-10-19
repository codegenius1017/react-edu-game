export const asteroidsTypes = [
    {
      id: 1,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroi-1.png`,
      vel: 1,
      damage: 1,
      size: 60,
      health: 2,
    },
    {
      id: 2,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-2.png`,
      vel: 0.5,
      damage: 2,
      size: 100,
      health: 4,
    },
    {
      id: 3,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/meteor-1.png`,
      vel: 1.7,
      damage: 0.5,
      size: 50,
      health: 1,
    },
    {
      id: 4,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-4.png`,
      vel: 1.5,
      damage: 1.5,
      size: 65,
      health: 2,
      type: "ZIGZAG"
    },
    {
      id: 5,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-5.png`,
      vel: 1.2,
      damage: 1,
      size: 30,
      health: 1,
      type: "GANG",
      quant: 3
    },
    {
      id: 6,
      imageSrc: `${process.env.PUBLIC_URL}/images/asteroids/asteroid-6.png`,
      vel: 1,
      damage: 1,
      size: 35,
      health: 1,
      type: "GANG",
      quant: 5
    },
  ];
