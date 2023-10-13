export const CONST = {
  defaultInterval: 10,
  velSizingAnimation: 5,
  velDistancingMitosedAsteroids: 8
}

export const LEVELS_DATA = [
  {
    respawnAsteroid: 2500,
    typesAsteroids: [1, 2, 3]
  },
  {
    respawnAsteroid: 2000,
    typesAsteroids: [1, 2, 3, 4]
  },
  {
    respawnAsteroid: 1500,
    typesAsteroids: [1, 2, 4]
  },
  {
    respawnAsteroid: 1000,
    typesAsteroids: [3, 4]
  },
  {
    respawnAsteroid: 750,
    typesAsteroids: [1, 3, 4]
  },
  {
    respawnAsteroid: 750,
    typesAsteroids: [1, 3, 4, 5]
  },
  {
    respawnAsteroid: 750,
    typesAsteroids: [1, 3, 4, 6]
  },
]

export function calcCollapse(objToCollapse, collapse) {
  if (!collapse || !objToCollapse) return false;
  const collapsed = (
    objToCollapse.position.y + objToCollapse.height >= collapse.position.y &&
    objToCollapse.position.x + objToCollapse.width >= collapse.position.x &&
    objToCollapse.position.x <= collapse.position.x + collapse.width
  )

  return collapsed;
}
