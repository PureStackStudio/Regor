# Regor documentation

The source for <https://regor.purestack.studio/>, built with **PureStack**.

Use Node.js 22 or newer and Yarn 4.9.2. From this directory:

```sh
yarn install --immutable
yarn serve
```

Open <http://127.0.0.1:4173/>. PureStack watches `content/` and reloads changes.

```sh
yarn build     # Clean development build in dist/web-dev/
yarn release   # Minified deployment artifact in dist/web/
```

`release` prepares static files; it does not upload them. Serve the contents of
`dist/web/` at the root of `regor.purestack.studio`, with directory-index
support (`/guide/` serves `/guide/index.html`). No `/regor` base path is needed.
DNS and the host's TLS certificate must be configured for that domain separately.

Write pages in `content/` as Markdown or Regor MDX. Filenames define routes;
`index.md` defines a directory's landing page. Keep API filenames and links in
matching case. Use top-level `order` frontmatter to order navigation. Put static
files in `content/`; they are copied into the output at the same relative path.

`content/siteConfig.json` configures the logo, light/dark theme, navigation,
table of contents, Pagefind search, syntax highlighting, sitemap, and robots.txt.
The sitemap uses `https://regor.purestack.studio` as its public URL.

Navigation uses PureStack's hybrid mode. `content/_nav.json` enables Previous
and Next page links throughout the docs, following the sidebar's page order
within the guide, directives, and API sections.

The site config explicitly sets stylesheet paths, output minification, script
cache busting, authentication policy, navigation, sidebar offsets, search,
and crawler settings. Consent uses PureStack's native component on the homepage
and docs, with its settings control in the footer and the privacy policy linked
directly to PureStack Studio.

The social preview is `content/assets/social-preview.png` (1200 × 630). Its
editable source is `design/assets/social-preview.svg`, using the library's
orbit icon and the site's chartreuse/graphite palette.

Regor's npm package is built and published independently from this site.

## Site design

`content/purestack.config.ts` registers the site plugin in `design/plugin.ts`.
It adds a custom homepage template, reusable Regor components, and a document
heading while retaining PureStack's documentation layout, search, navigation,
and table of contents.

`design/skin.ts` defines a vivid chartreuse identity on warm cream and graphite,
with a restrained orchid companion for PureStack. The palette feeds
the framework's semantic tones, so buttons, search, navigation, and panels
share the same colors. `design/styles.ts` registers typed, responsive styles
in PureStack's generated stylesheets; there is no separate CSS asset.

The live workbench and ecosystem section use PureStack's `theme--dark` regions
in both modes. Headline highlights and the closing section carry the bright
signal color; documentation links use a darker green in light mode for contrast.

The logo and generated favicon use `lucide:orbit` from PureStack's
`ts-svg-icons` library, with the same mark in the ecosystem diagram and footer.

Edit the homepage in `content/index.mdx`, the shared header/footer in their
MDX files, and the live counter/clipboard behavior in `content/home.ts`.
PureStack bundles the browser entry through `PageScript`. The source tabs use
the built-in `Tabs` and `TabPane` components.

## Live SVG example

The homepage's Signal Studio demonstrates three simulated event streams with
animated SVG paths, workload presets, intensity controls, series toggles,
computed summary metrics, and pointer or keyboard sample inspection.

- `content/examples/chart-model.ts`: refs, derived data, and smooth SVG paths.
- `content/examples/chart-view.ts`: the shared Regor template, including keyed
  SVG lists, attribute bindings, and two-way form controls.
- `content/examples/signal-chart.ts`: browser mounting, resize handling, and
  animation lifecycle. `home.ts` imports this entry, so the homepage uses one
  bundle for its counter and chart.

The build renders a static preview with the same model and template. The
browser mounts the interactive version, respects reduced-motion preferences,
and stops the frame clock when the chart is offscreen, the tab is hidden, or
the app is unmounted. The chart uses synthetic data and no chart library.

The expandable source panel uses `<import-codeblock>` for all three files, so
the displayed examples stay identical to the implementation.

Type-check site extensions from the repository root:

```sh
yarn tsc -p docs-site/tsconfig.json --noEmit
```
