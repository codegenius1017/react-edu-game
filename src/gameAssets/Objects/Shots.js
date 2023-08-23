import { Shot } from "./Sprites";

export const ShotTypes = {
  default: {
    getSprite: (spaceshipData) => new Shot({
      width: 10,
      height: 10,
      color: "red",
      damage: spaceshipData.damage,
      vel: 5,
      finalCordinates: { y: -30 },
      spaceshipData,
    })
  }

};