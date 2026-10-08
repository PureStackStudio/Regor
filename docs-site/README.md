# Regor documentation

The source for <https://regor.purestack.studio/>, built with **PureStack**.

Use Node.js 22 or newer and Yarn 4.9.2. From this directory:

```sh
yarn install --immutable
yarn dev
```

Open <http://127.0.0.1:4173/>. PureStack watches `content/` and reloads changes.

```sh
yarn build     # Clean development build in docs-dist/
yarn release   # Minified deployment artifact in docs-publish/
```

`release` prepares static files; it does not upload them. Serve the contents of
`docs-publish/` at the root of `regor.purestack.studio`, with directory-index
support (`/guide/` serves `/guide/index.html`). No `/regor` base path is needed.
DNS and the host's TLS certificate must be configured for that domain separately.

Write pages in `content/` as Markdown or Regor MDX. Filenames define routes;
`index.md` defines a directory's landing page. Keep API filenames and links in
matching case. Use top-level `order` frontmatter to order navigation. Put static
files in `content/`; they are copied into the output at the same relative path.

`content/siteConfig.json` configures the logo, light/dark theme, navigation,
table of contents, Pagefind search, syntax highlighting, sitemap, and robots.txt.
The sitemap uses `https://regor.purestack.studio` as its public URL.

The docs CI workflow builds a release and uploads `docs-publish/` as an artifact.
Regor's npm package is built and published independently from this site.
