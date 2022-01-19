import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { createDecoratorAnnotation } from "./mobx/decorators";

const s = Symbol("TL");

export { makeObservable } from "./mobx/makeObservable";
export function action(obj: any, prop: string, desc?: any): any {
  console.log(obj, prop, desc);
  return desc;
}

export function toJS(t: any) {
  return t;
}
export function observe() {}

// export function observable(obj: any, prop: string): any;
export const observable = createDecoratorAnnotation({
  make: (target: any, key: any) => {
    const [signal, setSignal] = createSignal(target[key]);
    Object.defineProperty(target, key, {
      get: signal,
      set: v => {
        setSignal(() => v);
      },
      configurable: true
    });
  }
});

export const store = createDecoratorAnnotation({
  make: (target: any, key: any) => {
    const [signal, setSignal] = createStore(target[key]);
    Object.defineProperty(target, key, {
      get: () => signal,
      set: v => setSignal(v),
      configurable: true
    });
  }
});

export function computed(obj: any, prop: string, val: any): any {
  let memo: any;
  return val;
}
