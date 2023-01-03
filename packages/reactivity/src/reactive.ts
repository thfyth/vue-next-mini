import { isObject } from '@vue/shared';
import { mutableHandlers } from './baseHandlers';

export const reactiveMap = new WeakMap<object, any>();

function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // 创建proxy实例
  const proxy = new Proxy(target, baseHandlers);
  // 保存到缓存map中
  proxyMap.set(target, proxy);
  return proxy;
}
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as object) : value;
};
