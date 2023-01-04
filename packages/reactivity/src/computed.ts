import { ReactiveEffect } from './effect';
import { Dep } from './dep';
import { isFunction } from '@vue/shared';
import { trackRefValue, triggerRefValue } from './ref';

export class ComputedRefImpl<T> {
  public dep?: Dep;
  private _value!: T;
  public readonly effect: ReactiveEffect<T>;
  public readonly __v_isRef = true;
  public _dirty = true;
  constructor(getter) {
    this.effect = new ReactiveEffect(getter, () => {
      console.log('初始化');

      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
  }
  get value() {
    console.log('获取');

    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }

    return this._value;
  }
}

export const computed = getterOrOptions => {
  let getter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
  }

  const cRef = new ComputedRefImpl(getter);
  return cRef;
};
