import { Shot } from "./Sprites";

export const ShotTypes = {
  default: {
    getSprite: (spaceshipData) => new Shot({
      width: 30,
      height: 30,
      color: "red",
      damage: spaceshipData.damage,
      vel: 5,
      finalCordinates: { y: -30 },
      spaceshipData,
    })
  }

};