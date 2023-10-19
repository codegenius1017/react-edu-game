import { Shot } from "./Sprites";

// !TODO: formatos do shot na sprite
// !TODO: mensagem de erro para retorno inválidos (deve sempre retornar um array)

export const ShotTypes = {
  default: {
    getSprite: (spaceshipData) => {
      return [
        new Shot({
          width: 10,
          height: 10,
          color: "red",
          damage: spaceshipData.damage,
          vel: 3,
          position: {
            x: spaceshipData.position.x + 5 + spaceshipData.width / 2,
            y: spaceshipData.position.y + spaceshipData.width / 2,
          },
          finalCordinates: { y: -20 },
          spaceshipData,
        }),
      ];
    },
  },
  doubleShot: {
    getSprite: (spaceshipData, width = 5, height = 10) => {
      const shots = [];
      const spaceShipY = spaceshipData.position.y  + spaceshipData.height / 2;
      const spaceShipX = spaceshipData.position.x + spaceshipData.width / 2;
      const widthCalc = spaceshipData.width / 3;

      for (let i = 1; i <= 2; i++) {
        const posX = i === 1 ? spaceShipX + widthCalc : spaceShipX - widthCalc;

        shots.push(
          new Shot({
            width: width,
            height: height,
            color: "aqua",
            damage: spaceshipData.damage,
            vel: 3,
            position: { x: posX, y: spaceShipY },
            finalCordinates: { y: -30 },
            spaceshipData,
          }),
        );
      }

      return shots;
    },
  },
  bigShot: {
    getSprite: (spaceshipData, size=50) => {
      return [
        new Shot({
          width: size,
          height: size,
          color: "violet",
          damage: 3,
          vel: 2,
          position: {
            x: spaceshipData.position.x + 15 + spaceshipData.width / 2,
            y: spaceshipData.position.y + spaceshipData.width / 2,
          },
          finalCordinates: { y: -50 },
          spaceshipData,
        }),
      ];
    }
  },
  shotgunRandomized: {
    getSprite: (spaceshipData, sparklesNum, size = 10, margin = 10) => {
      const shots = [];
      const spaceShipY = spaceshipData.position.y;
      const spaceShipX = spaceshipData.position.x;
      const sizeShot = size + margin;
      const totalWidthShots = sparklesNum * sizeShot;

      for (let i = 0; i < sparklesNum; i++) {
        const moveY = i % 2 === 0 ? 15 : -15;
        const moveX = totalWidthShots - sizeShot * i;
        const posY = spaceShipY + moveY;
        const posX = spaceShipX + i > sparklesNum / 2 ? moveX : moveX * -1;

        shots.push(
          new Shot({
            width: size,
            height: size,
            color: "red",
            damage: spaceshipData.damage,
            vel: 2,
            locatePosition: { y: posY, x: posX },
            finalCordinates: { y: -30 },
            spaceshipData,
          }),
        );
      }

      return shots;
    },
  },
};
