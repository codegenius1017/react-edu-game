
export const inactiveAll = (arrayObjs) => arrayObjs.forEach(obj => obj.active = false);
export const filterActives = (arrayObjs) => arrayObjs.filter(obj => obj.active);
