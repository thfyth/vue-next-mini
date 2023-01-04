import { activeEffect, trackEffects, triggerEffects } from './effect';
import { Dep, createDep } from './dep';
import { toReactive } from './reactive';
import { isChanged } from '@vue/shared';
export interface Ref<T = any> {
  value: T;
}
export function ref(value?: unknown) {
  return createRef(value, false);
}

function createRef(rawValue: unknown, shallow: boolean) {
  // 判断是否ref数据
  if (isRef(rawValue)) return rawValue;
  return new RefImpl(rawValue, shallow);
}

class RefImpl<T> {
  private _value: T;
  // 原始值
  private _rawValue: T;
  public dep?: Dep = undefined;
  public readonly __v_isRef = true;
  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(val) {
    this._value = val;
    // 对比数据是否发生改变
    if (isChanged(val, this._rawValue)) {
      this._rawValue = this._value = toReactive(val);
      triggerRefValue(this);
    }
  }
}

/**
 * 是否为ref
 * @param r
 * @returns
 */
export function isRef(r: any): r is Ref {
  // 是否存在ref标识
  return !!(r && r.__v_isRef === true);
}
export function trackRefValue<T extends RefImpl<T>>(ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()));
  }
}
export function triggerRefValue<T extends RefImpl<T>>(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep);
  }
}
