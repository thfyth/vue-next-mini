export const isArray = Array.isArray;

export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object';

// 新旧值是否一致
export const isChanged = (val: unknown, oldVal: unknown): boolean =>
  !Object.is(val, oldVal);
