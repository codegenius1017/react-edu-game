export const CONST = {
  defaultInterval: 10,
  velSizingAnimation: 5
}

export function calcCollapse(objToCollapse, collapse){
  const collapsed =  (
    objToCollapse.position.y + objToCollapse.height >= collapse.position.y &&
    objToCollapse.position.x + objToCollapse.width >= collapse.position.x &&
    objToCollapse.position.x <= collapse.position.x + collapse.width
  )

  return collapsed;
}