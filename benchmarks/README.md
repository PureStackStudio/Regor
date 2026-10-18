# DOM Benchmarks

This folder contains a browser DOM benchmark that compares:

- `Regor` (local source from this repository)
- `Vue@latest` (loaded from CDN at runtime)

## Workload

The benchmark mounts a large bound list and then runs repeated manipulations:

- `for`-bound list rendering with keyed rows
- row property updates (`label`, `value`, `active`)
- array operations (`splice`, `push`, `shift`)

Each framework runs the same operation pattern; timings are measured with
`performance.now()`.

Use the **Workload** selector to choose the original **Bound list** or
**Nested components (3 per row)**. Both workloads run the same keyed list
operations. The component workload renders a row card, label component, and
value component for each row, with reactive props, class fallthrough, and
parent-scoped slot content. Regor uses an app-local row component, a label
registered in each row's context, and a globally registered value component.
Vue renders the equivalent component tree and DOM.

At 500 rows this mounts 1,500 component instances; at 2,000 rows it mounts 6,000.
Component definitions are created before mount timing. Regor prepares its
component templates there; Vue's runtime template compilation occurs during
mount. Rendering is checked after mount and each operation, outside the timed
sections. A rendering mismatch fails the run.

Regor's swap uses batched `splice` calls, shuffle commits the shuffled order
with `splice`, and object replacement updates each existing element ref with
`rows[i](ref(replacements[i]))`. This preserves reactive updates rather than replacing the
ref functions stored at array indexes.

## Run

1. Build benchmark bundle:

```bash
yarn bench:build
```

2. Start static server:

```bash
yarn bench:serve
```

3. Open:

`http://localhost:4177/`

4. Select a workload and click **Run Regor**, **Run Vue**, or **Run Both**.

The mount-only benchmark at `http://localhost:4177/benchmarks/initial-load.html`
has the same workload selector.

## Notes

- `Vue@latest` requires internet access.
- Run multiple times and compare medians.
- Keep browser/devtools conditions consistent for fair comparisons.
- The Node-based [minidom suite](minidom/README.md) also includes component
  mounting, prop updates, and repeated subtree remounting.
