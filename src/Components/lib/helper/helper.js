
export const inactiveAll = (arrayObjs) => arrayObjs.forEach(obj => obj.active = false);
export const filterActives = (arrayObjs) => arrayObjs.filter(obj => obj.active);
export function calcCollapse(objToCollapse, collapse) {
    if (!collapse || !objToCollapse) return false;
    const collapsed = (
      objToCollapse.position.y + objToCollapse.height >= collapse.position.y &&
      objToCollapse.position.x + objToCollapse.width >= collapse.position.x &&
      objToCollapse.position.x <= collapse.position.x + collapse.width
    )
  
    return collapsed;
  }
