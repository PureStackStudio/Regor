# Minidom Perf Suite

Regor performance suite running on `@purestack/ts-minidom`, with baseline comparison and optional regression gate.

## Component Workloads

The suite includes three component-heavy scenarios in addition to the original
list and branch scenarios:

- `mount_nested_components`: mount a keyed list of row cards, each containing
  a local label component, a globally registered value component, and slot content.
- `mutate_component_props`: mount that list, then update every row's label,
  value, and active class through reactive props.
- `remount_component_tree`: mount that list, then hide and show the entire
  subtree three times using `r-if`.

Each tree has three component instances per row: 1,500 at the default 500 rows,
or 6,000 at 2,000 rows. Component definitions and data setup are excluded from
timing. As in the original scenarios, the primary time includes initial mount
plus the scenario's operations; unmount and cleanup are reported separately.
Output checks verify every row's props, classes, order, and slot content outside
both timed sections. A mismatch fails the run.

These measurements use minidom's selector and DOM implementations. Use the
browser benchmark's **Nested components** workload to measure browser DOM costs.

## Quick Start

Run with default row count (`500`):

```bash
yarn perf
```

Run with custom rows:

```bash
yarn perf 1000
```

Record baseline for a row count:

```bash
yarn perf:record 1000
```

Gate against baseline:

```bash
yarn perf:check 1000
```

## Modes

- `perf` (`run` mode)
  - Executes suite, prints table, compares against baseline if present.
  - Interactive in TTY: `Enter` reruns, `q` quits.
- `perf:record` (`record` mode)
  - Executes suite, compares against current baseline, then overwrites baseline with new results.
- `perf:check` (`check` mode)
  - Executes suite, compares against baseline, fails process on regression over threshold (configurable).

## Profiling

Generate CPU profile + hotspot report in one command:

```bash
yarn perf:profile 2000
```

Optional second argument controls how many hotspot lines are printed:

```bash
yarn perf:profile 2000 40
```

What this does:

- Bundles `benchmarks/minidom/perf.ts` to plain Node JS (removes tsx runtime noise).
- Runs the benchmark under Node CPU profiler.
- Prints top functions and top frames (including Regor/minidom-focused frames).
- Writes artifacts to `benchmarks/minidom/profiles/`:
  - `perf-<rows>-<timestamp>.cpuprofile`
  - `perf-<rows>-<timestamp>.summary.txt`

Tip:

- Use `PERF_SAMPLES` and `PERF_WARMUPS` to tune profile stability.
- Example:
  - `PERF_SAMPLES=30 PERF_WARMUPS=8 yarn perf:profile 2000`

## Output

Table columns:

- `Median`, `P90`: primary runtime metrics per scenario.
- `Mean`, `Min`, `Max`: secondary distribution metrics.
- `UnmMed`, `UnmP90`: unmount cleanup timing.

Comparison section:

- `IMPROVEMENT ... (x.xx% faster)`
- `OK ... (x.xx% slower)` (within threshold)
- `REGRESSION ... (x.xx% slower)` (beyond threshold in check mode fails by default)

## Baselines

Baselines are row-count specific:

- `benchmarks/minidom/perf-baseline.<rows>.json`
- Example: `benchmarks/minidom/perf-baseline.500.json`

If a baseline does not exist, create it first:

```bash
yarn perf:record 500
```

When adding scenarios, existing baselines report them as missing and skip their
regression checks. Run `yarn perf:record <rows>` on the version you want to compare
against before evaluating subsequent changes. Recording replaces the baseline
for every scenario at that row count.

## Environment Variables

- `PERF_SAMPLES` (default `20`)
  - Number of measured runs per scenario.
- `PERF_WARMUPS` (default `5`)
  - Number of warmup runs per scenario (not measured).
- `PERF_MAX_REGRESSION_PCT` (default `5`)
  - Maximum allowed median slowdown per scenario for gate failure.
- `PERF_FAIL_ON_REGRESSION` (default `1`)
  - `1`: fail on regression over threshold.
  - `0`: warn only.

Example:

```bash
PERF_SAMPLES=30 PERF_WARMUPS=8 PERF_MAX_REGRESSION_PCT=3 yarn perf:check 1000
```
