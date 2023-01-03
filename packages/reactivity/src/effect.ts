import { isArray } from './../../shared/src/index';
import { createDep, Dep } from './dep';

/**
 * 当前被激活的effect
 */
export let activeEffect: ReactiveEffect | undefined;
type keyToDepMap = Map<any, Dep>;
// 搜集的依赖
let targetMap = new WeakMap<any, keyToDepMap>();
export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    activeEffect = this;
    return this.fn();
  }
  stop() {}
}

export function effect<T = any>(fn: () => T) {
  const dep = new ReactiveEffect(fn);
  dep.run();
}

/**
 * 依赖收集
 * @param target
 * @param key
 */

export function track(target: object, key: string | symbol) {
  if (!activeEffect) return;
  let depMap = targetMap.get(target);
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()));
  }
  let dep = depMap.get(key);
  if (!dep) {
    depMap.set(key, (dep = createDep()));
  }
  trackEffects(dep);
  //   trackEffect.set(key, activeEffect);
}

/**
 * 利用dep依次跟踪指定key的所有effect
 * @param dep
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!);
}

/**
 * 派发更新
 * @param target
 * @param key
 * @param value
 */
export function trigger(target: object, key: string | symbol, value: unknown) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep: Dep | undefined = depsMap.get(key);
  if (!dep) return;
  triggerEffects(dep);
}
/**
 * 依次触发dep中保存的依赖
 * @param dep
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const item of effects) {
    triggerEffect(item);
  }
}

export function triggerEffect(dep: ReactiveEffect) {
  dep.fn();
}
