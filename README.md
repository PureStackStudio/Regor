[![Regor](https://raw.githubusercontent.com/PureStackStudio/Regor/main/docs/images/logo1.png)](https://regor.purestack.studio/)

# Regor

**Reactive UI for HTML and SVG.**

[![npm version](https://img.shields.io/npm/v/regor?style=flat-square&logo=npm&logoColor=white&labelColor=101211&color=d2fa56)](https://www.npmjs.com/package/regor)
[![Tests](https://img.shields.io/github/actions/workflow/status/PureStackStudio/Regor/test.yml?branch=main&style=flat-square&logo=github&logoColor=white&label=tests&labelColor=101211)](https://github.com/PureStackStudio/Regor/actions/workflows/test.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-d2fa56?style=flat-square&labelColor=101211)](LICENSE)

Regor connects reactive state to the DOM. Start with existing HTML, add bindings where you need interaction, and compose reusable components as your interface grows. Updates go directly to the bound DOM nodes, without a Virtual DOM.

Write your application in ordinary TypeScript or JavaScript. Templates use HTML with Vue-inspired directives such as `r-if`, `r-for`, and `r-model`; components are functions and objects, with no special file format or template compilation step.

[Documentation](https://regor.purestack.studio/) · [Getting started](https://regor.purestack.studio/getting-started/) · [Guide](https://regor.purestack.studio/guide/) · [API reference](https://regor.purestack.studio/api/)

## Why Regor?

- **Start with the page you have.** Bind existing static or server-rendered markup in place, or supply a template when mounting. Mount independent interactive regions on the same page.
- **Make state explicit.** Use refs for state, computed refs for derived values, and observers or effects for side effects. Choose deep or shallow reactivity and coordinate updates with batching.
- **Compose in TypeScript.** Model app and component contexts with interfaces or classes. Components support reactive props, events, slots, and lifecycle hooks.
- **Choose your tooling.** Install from npm for a bundled application, or import a browser module from a CDN. Regor interprets template expressions at runtime; TypeScript itself still needs to be compiled to JavaScript.

Regor is useful for adding a form, widget, or interactive island to an existing site, as well as building interfaces from components. You choose the DOM region each app binds to.

## Install

```sh
npm install regor
```

Or use `yarn add regor` or `pnpm add regor`. The package includes TypeScript declarations.

## Your first app

In a project that bundles npm imports, add this markup to your page:

```html
<div id="counter">
  <p>Count: <output>{{ count }}</output></p>
  <button type="button" @click="count++">Increment</button>
  <button type="button" @click="count = 0" :disabled="count === 0">
    Reset
  </button>
</div>
```

Then add this to your JavaScript or TypeScript entry point, and run it after the root element exists. A module script runs after the HTML has been parsed.

```ts
import { createApp, ref } from 'regor'

const app = createApp({ count: ref(0) }, { selector: '#counter' })
```

`createApp` mounts immediately. With only a `selector`, it binds the existing markup. `{{ count }}` displays the current value, `@click` handles events, and `:disabled` keeps the button's disabled state in sync. Refs are automatically unwrapped in template expressions, so `count++` updates the ref.

The returned app handle provides teardown when you need it:

```ts
app.unbind() // Stop bindings and listeners, keeping the DOM in place.
// Or: app.unmount() // Remove the root element and schedule cleanup.
```

### Try it without a build step

Save this as `index.html` and open it in a modern browser with an internet connection:

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Regor counter</title>

  <div id="counter">
    <p>Count: <output>{{ count }}</output></p>
    <button type="button" @click="count++">Increment</button>
    <button type="button" @click="count = 0" :disabled="count === 0">
      Reset
    </button>
  </div>

  <script type="module">
    import {
      createApp,
      ref,
    } from 'https://unpkg.com/regor@1.7.3/dist/regor.es2022.esm.prod.js'

    createApp({ count: ref(0) }, { selector: '#counter' })
  </script>
</html>
```

The CDN example pins the package version so its behavior stays consistent. See [getting started](https://regor.purestack.studio/getting-started/) for more mounting and installation options.

## State and derived values

A ref is callable: call it with no arguments to read its value, or with a value to update it. You can also use its `.value` property.

```ts
import { computed, ref } from 'regor'

const count = ref(0)
const doubled = computed(() => count() * 2)

count(3)
console.log(count()) // 3
console.log(doubled()) // 6

count.value = 4
console.log(doubled()) // 8
```

`computed` tracks the refs read by its function and derives a read-only value. In a template, use `count` and `doubled` directly.

For object state, choose the conversion you need:

| API           | Behavior                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref(value)`  | Converts nested properties to refs recursively, modifying the supplied object in place.                                                                          |
| `cref(value)` | Creates deep reactive state from a flattened copy, leaving the supplied object unchanged.                                                                        |
| `sref(value)` | Holds shallow state without converting nested properties to refs. For plain objects, replace the value or call `trigger` to notify bindings after a nested edit. |

Use `watchEffect` or `observe` to react to changes outside templates, and `batch` to group notifications. Create app effects and lifecycle hooks inside `useScope` so they are cleaned up with the app; component context factories already run in a scope. Read the [reactivity guide](https://regor.purestack.studio/guide/reactivity/) and [lifecycle guide](https://regor.purestack.studio/guide/lifecycle-and-cleanup/) for examples.

## Reusable components

Components pair a template with a context factory. This counter receives its label from the parent and keeps its own count.

Add a root to your page:

```html
<div id="components-app"></div>
```

Then define and mount the component:

```ts
import { createApp, defineComponent, html, ref, type Ref } from 'regor'

interface CounterContext {
  label: Ref<string>
  count: Ref<number>
}

const CounterButton = defineComponent<CounterContext>(
  html`<button type="button" @click="count++">
    {{ label }}: {{ count }}
  </button>`,
  {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
      count: ref(0),
    }),
  },
)

createApp(
  {
    components: { CounterButton },
    label: ref('Clicks'),
  },
  {
    selector: '#components-app',
    template: html`
      <label>Button label <input r-model="label" /></label>
      <counter-button :label="label"></counter-button>
    `,
  },
)
```

The `html` tag produces a template string. Supplying `template` to `createApp` replaces the root's content before binding it. Here, `:label="label"` passes a reactive ref into the component; editing the input updates its label, while each component instance owns a separate count.

TypeScript checks the context code; template expressions are evaluated at runtime. For optional runtime prop checks, use `head.validateProps` with [`pval`](https://regor.purestack.studio/api/pval/). The [component guide](https://regor.purestack.studio/guide/components/) covers props, slots, events, and shared context.

## Template essentials

| Purpose                | Syntax                                              |
| ---------------------- | --------------------------------------------------- |
| Display text           | `{{ message }}` or `r-text="message"`               |
| Bind an attribute      | `:title="message"` or `r-bind:title="message"`      |
| Bind a DOM property    | `.value="message"` or `r-bind:value.prop="message"` |
| Handle an event        | `@click="save"` or `r-on:click="save"`              |
| Bind a form value      | `r-model="name"`                                    |
| Render conditionally   | `r-if="visible"`, `r-else-if`, `r-else`             |
| Toggle visibility      | `r-show="visible"`                                  |
| Render a keyed list    | `r-for="item in items"` with `:key="item.id"`       |
| Bind classes or styles | `:class="{ active: selected }"`, `:style="styles"`  |

Explore the [directive reference](https://regor.purestack.studio/directives/) for modifiers, dynamic components, teleporting, element refs, and more.

## Documentation and examples

The documentation includes live examples and their source code.

| Resource                                                           | Start here for…                                      |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| [Getting started](https://regor.purestack.studio/getting-started/) | Installation and your first reactive view.           |
| [Guide](https://regor.purestack.studio/guide/)                     | Reactivity, templates, components, and lifecycle.    |
| [Mounting](https://regor.purestack.studio/guide/mounting/)         | Existing markup, templates, and independent islands. |
| [Directives](https://regor.purestack.studio/directives/)           | Binding syntax, modifiers, and examples.             |
| [API reference](https://regor.purestack.studio/api/)               | Public functions, types, and configuration.          |
| [Performance](https://regor.purestack.studio/guide/performance/)   | Measuring and profiling your interface.              |

Regor powers interactive UI in [PureStack](https://purestack.studio/), which in turn builds Regor's documentation site. The site's source and examples live in [`docs-site/`](docs-site/); see its [README](docs-site/README.md) to run it locally.

## Contributing

Bug reports, documentation improvements, and code contributions are welcome. Read the [contribution guide](.github/CONTRIBUTING.md) and [code of conduct](.github/CODE_OF_CONDUCT.md), or [open an issue](https://github.com/PureStackStudio/Regor/issues) with a reproducible example.

To work on the library, install Node.js and use the Yarn version pinned in `package.json`. From a clone of this repository:

```sh
corepack enable
yarn install --immutable
yarn tsc --noEmit
yarn vitest run
yarn lint
yarn build
```

Run `yarn test` for watch mode. The [benchmark suite](benchmarks/README.md) documents performance comparisons and local measurement tools.

## License

Regor is [MIT licensed](LICENSE).
