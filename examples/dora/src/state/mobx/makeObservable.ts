// Hack based on https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-322267089
// We need this, because otherwise, AdditionalKeys is going to be inferred to be any
// set of superfluous keys. But, we rather want to get a compile error unless AdditionalKeys is
// _explicity_ passed as generic argument

import { collectStoredAnnotations } from "./decorators";

// Fixes: https://github.com/mobxjs/mobx/issues/2325#issuecomment-691070022
type NoInfer<T> = [T][T extends any ? 0 : never];
const hasGetOwnPropertySymbols = typeof Object.getOwnPropertySymbols !== "undefined";

// From Immer utils
// Returns all own keys, including non-enumerable and symbolic
export const ownKeys: (target: any) => Array<string | symbol> =
  typeof Reflect !== "undefined" && Reflect.ownKeys
    ? Reflect.ownKeys
    : hasGetOwnPropertySymbols
    ? obj => Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj) as any)
    : /* istanbul ignore next */ Object.getOwnPropertyNames;

export function makeObservable<T extends object, AdditionalKeys extends PropertyKey = never>(
  target: T
  // annotations?: AnnotationsMap<T, NoInfer<AdditionalKeys>>,
  // options?: CreateObservableOptions
): T {
  // const adm: ObservableObjectAdministration = asObservableObject(target, options)[$mobx];
  // startBatch();
  console.log(target);
  let annotations;
  try {
    // Default to decorators
    annotations ??= collectStoredAnnotations(target);
    console.log(annotations);
    // Annotate
    ownKeys(annotations).forEach(key => {
      console.log(Object.getOwnPropertyDescriptor(target, key));
      annotations![key].make(target, key);
    });
  } finally {
    // endBatch();
  }
  return target;
}

// proto[keysSymbol] = new Set<PropertyKey>()
const keysSymbol = Symbol("mobx-keys");
