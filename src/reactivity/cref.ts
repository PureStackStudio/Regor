import { IsNull, Ref, RefContent, RefParam, SRef, UnwrapRef } from '../api/types'
import { flatten } from '../misc/flatten'
import { ref } from './ref'

/**
 * Creates a deep ref from a flattened copy of the given value.
 *
 * Unlike `ref`, this does not mutate the original object graph during initial
 * conversion. cref is slower than ref. Use it when you need to preserve original object.
 */
export function cref<TValueType>(
  value?:
    | TValueType
    | RefContent<TValueType>
    | (TValueType extends Ref<infer V1> ? Ref<RefParam<V1>> : never)
    | (TValueType extends SRef<infer V2> ? SRef<UnwrapRef<V2>> : never)
    | RefParam<TValueType>
    | (TValueType extends Array<infer V1> ? V1[] : never)
    | null,
): IsNull<TValueType> extends true ? Ref<unknown> : Ref<RefParam<TValueType>> {
  return ref(flatten(value)) as any
}
