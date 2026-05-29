import { IsNull, RawTypes, Ref, RefInit, RefParam } from './types'

export declare function ref(value: string): Ref<string>
export declare function ref(value: number): Ref<number>
export declare function ref(value: boolean): Ref<boolean>
export declare function ref(value: bigint): Ref<bigint>
export declare function ref(value: symbol): Ref<symbol>
export declare function ref<TValueType>(
  value: (TValueType extends RawTypes | readonly unknown[]
    ? never
    : RefInit<TValueType>) &
    object,
): IsNull<TValueType> extends true ? Ref<unknown> : Ref<RefParam<TValueType>>
export declare function ref(value: string, eventSource?: unknown): Ref<string>

export declare function cref(value: string): Ref<string>
export declare function cref(value: number): Ref<number>
export declare function cref(value: boolean): Ref<boolean>
export declare function cref(value: bigint): Ref<bigint>
export declare function cref(value: symbol): Ref<symbol>
export declare function cref<TValueType>(
  value: (TValueType extends RawTypes | readonly unknown[]
    ? never
    : RefInit<TValueType>) &
    object,
): IsNull<TValueType> extends true ? Ref<unknown> : Ref<RefParam<TValueType>>
export declare function cref(value: string, eventSource?: unknown): Ref<string>
