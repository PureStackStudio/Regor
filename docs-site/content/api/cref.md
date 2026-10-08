---
title: cref
---

## Overview

The `cref` function creates a deep ref from a flattened copy of the given value.

It is equivalent to calling `ref(flatten(value))`: nested refs are unwrapped into plain values first, then the copied structure is converted into deep refs.

Use `cref` when you want deep ref behavior without mutating the original object graph during initial conversion.

## Usage

```ts
import { cref } from 'regor'

const source = {
  user: {
    name: 'Ada',
  },
}

const state = cref(source)

state().user().name('Grace')

console.log(source.user.name)
// Outputs: Ada

console.log(state().user().name())
// Outputs: Grace
```

## Parameters

- `value` (optional): Any value that you want to copy and convert into a deep ref.

## Return Value

The `cref` function returns the same kind of deep ref as `ref`.

## Notes

- `cref(value)` is equivalent to `ref(flatten(value))`.
- `cref` does not mutate the original object graph during initial conversion.
- `cref` does extra work compared with `ref`, so use `ref` for performance-critical paths where in-place conversion is acceptable.
- `cref` follows `flatten` behavior for nested refs, arrays, sets, maps, and circular references.

## See Also

- [`ref`](/api/ref)
- [`sref`](/api/sref)
- [`flatten`](/api/flatten)
- [`isDeepRef`](/api/isDeepRef)
- [`isRef`](/api/isRef)
- [`unref`](/api/unref)

[Back to the API list](/api/)
