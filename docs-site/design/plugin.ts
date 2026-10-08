import { h } from '@purestack/ts-html'
import { definePlugin, resolvePageTemplate } from 'purestack'
import { defineRegorComponents } from './components'
import { regorSkin } from './skin'
import { registerRegorStyles } from './styles'

const defaultDoc = resolvePageTemplate('doc').pageTemplate

export const regorPlugin = definePlugin({
  name: 'regor-site',
  skins: { regor: regorSkin },
  components: () => defineRegorComponents(),
  templates: {
    doc: async (input) => {
      const group = input.pageInfo.urlPath.split('/').filter(Boolean)[0]
      const sections: Record<string, string> = {
        guide: 'Guide',
        api: 'API reference',
        directives: 'Directives',
      }
      const heading = h('header')
        .class('regor-doc-heading')
        .id('main')
        .attr({ tabindex: '-1' })
        .push(
          h('nav')
            .class('regor-breadcrumb')
            .attr({ 'aria-label': 'Breadcrumb' })
            .push(
              h('a').attr({ href: '/' }).text('Regor'),
              h('span').attr({ 'aria-hidden': 'true' }).text('/'),
              ...(sections[group]
                ? [
                    h('a')
                      .attr({ href: `/${group}/` })
                      .text(sections[group]),
                  ]
                : [h('span').text('Documentation')]),
            ),
          h('h1').text(
            input.pageInfo.frontmatter.title ?? 'Regor documentation',
          ),
          ...(input.pageInfo.frontmatter.description
            ? [h('p').text(input.pageInfo.frontmatter.description)]
            : []),
        )
      input.head.push(
        h('noscript').push(
          h('style').raw(
            'html:not([data-theme-ready]) body{visibility:visible}',
          ),
        ),
      )
      const page = await defaultDoc({
        ...input,
        bodyHtml: heading.toHtml() + input.bodyHtml,
      })
      return page.attr({ 'data-theme': 'light' })
    },
    regor: ({ head, bodyHtml, headerHtml, footerHtml }) => {
      head.push(
        h('noscript').push(
          h('style').raw(
            'html:not([data-theme-ready]) body{visibility:visible}',
          ),
        ),
      )
      return h('html')
        .attr({ lang: 'en', 'data-theme': 'light' })
        .push(
          head,
          h('body')
            .class('regor-home tone--neutral')
            .push(
              h('a')
                .class('regor-skip')
                .attr({ href: '#main' })
                .text('Skip to content'),
              h('').raw(headerHtml ?? ''),
              h('main').id('main').attr({ tabindex: '-1' }).raw(bodyHtml),
              h('consent'),
              h('').raw(footerHtml ?? ''),
            ),
        )
    },
  },
  hooks: { onConfigResolved: () => registerRegorStyles() },
})
