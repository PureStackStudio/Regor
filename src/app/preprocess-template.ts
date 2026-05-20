/**
 * Template preprocessor for table semantics + component interoperability.
 *
 * Why this exists:
 * HTML parsers enforce strict table content models. Custom component tags such as
 * <TableRow />, <TableCell />, or alias hosts like <trx is="r-tr"> can be
 * dropped, re-parented, or parsed unexpectedly when they appear in
 * table-related positions.
 * This preprocessor rewrites raw template text before DOM parsing so table structures
 * remain valid and binders can reliably mount components.
 *
 * High-level behavior:
 * 1) Single-pass scan over the template string.
 *    - We find each `<...>` tag, keep text between tags untouched, and preserve comments.
 * 2) Maintain a lightweight tag stack to infer structural context.
 *    - Each stack entry stores:
 *      - replacementHost: rewritten host tag name (or null if unchanged)
 *      - effectiveTag: semantic tag used for context decisions
 *    - Closing tags are emitted using the rewritten host when applicable.
 * 3) Apply table-focused rewrites based on current context.
 *
 * Context model:
 * - `tableScopeDepth > 0` means we are inside a native table scope: table,
 *   thead, tbody, or tfoot.
 * - Outside table scope (tableScopeDepth === 0):
 *   - `<caption> -> <captionx is="r-caption">`
 *   - `<thead> -> <theadx is="r-thead">`
 *   - `<tbody> -> <tbodyx is="r-tbody">`
 *   - `<tfoot> -> <tfootx is="r-tfoot">`
 *   - `<tr> -> <trx is="r-tr">`
 *   - `<td> -> <tdx is="r-td">`
 *   - `<th> -> <thx is="r-th">`
 *   - `<colgroup> -> <colgroupx is="r-colgroup">`
 *   - `<col> -> <colx is="r-col">`
 *   This aliasing avoids invalid native table nodes in non-table contexts while still
 *   enabling later runtime conversion through DynamicBinder.
 *
 * - Inside row parent containers (thead/tbody/tfoot):
 *   - Direct child non-<tr> tags are rewritten to:
 *     <tr is="regor:OriginalTag">
 *   - Direct <tr> stays as <tr>.
 *
 * - Inside <table> direct children:
 *   - Allowed unchanged: caption, colgroup, thead, tbody, tfoot, tr.
 *   - Any other direct child is rewritten to:
 *     <tr is="regor:OriginalTag">
 *
 * - Inside <tr> direct children:
 *   - <td> and <th> stay as-is.
 *   - Any other direct child is rewritten to:
 *     <td is="regor:OriginalTag">
 *
 * - Inside <colgroup> direct children:
 *   - <col> stays as-is.
 *   - Any other direct child is rewritten to:
 *     <col is="regor:OriginalTag">
 *
 * Self-closing normalization under <tr>:
 * - For self-closing tags directly under effective <tr>, we emit explicit closing tags:
 *   `<X ... /> -> <X ...></X>`
 * - This avoids parser collapsing/mis-nesting issues in table rows when custom tags are
 *   authored as self-closing components.
 *
 * Notes on implementation strategy:
 * - This is intentionally string-based and fast (no intermediate DOM parsing).
 * - It is designed for pragmatic table/component compatibility, not full HTML parsing.
 * - Quotes inside tag attributes are respected when searching for tag end (`>`).
 * - Special tags like `<! ...>` and `<? ...>` are passed through unchanged.
 */
const isNameChar = (ch: string): boolean => {
  const c = ch.charCodeAt(0)
  return (
    (c >= 48 && c <= 57) ||
    (c >= 65 && c <= 90) ||
    (c >= 97 && c <= 122) ||
    ch === '-' ||
    ch === '_' ||
    ch === ':'
  )
}

const findTagEnd = (text: string, start: number): number => {
  let quote = ''
  for (let i = start; i < text.length; ++i) {
    const ch = text[i]
    if (quote) {
      if (ch === quote) quote = ''
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '>') return i
  }
  return -1
}

const parseTagNameRange = (
  tagText: string,
  isClosing: boolean,
): { start: number; end: number; hasUppercase: boolean } | null => {
  let i = isClosing ? 2 : 1
  while (i < tagText.length && (tagText[i] === ' ' || tagText[i] === '\n')) ++i
  if (i >= tagText.length || !isNameChar(tagText[i])) return null
  const start = i
  let hasUppercase = false
  while (i < tagText.length && isNameChar(tagText[i])) {
    const c = tagText.charCodeAt(i)
    if (c >= 65 && c <= 90) {
      hasUppercase = true
    }
    ++i
  }
  return { start, end: i, hasUppercase }
}

const isTableScopeTag = (tagName: string): boolean => {
  switch (tagName) {
    case 'table':
    case 'thead':
    case 'tbody':
    case 'tfoot':
      return true
    default:
      return false
  }
}

const isRowParentTag = (tagName: string): boolean => {
  switch (tagName) {
    case 'thead':
    case 'tbody':
    case 'tfoot':
      return true
    default:
      return false
  }
}

const isTableDirectAllowed = (tagName: string): boolean => {
  switch (tagName) {
    case 'caption':
    case 'colgroup':
    case 'thead':
    case 'tbody':
    case 'tfoot':
    case 'tr':
      return true
    default:
      return false
  }
}

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const getTableAliasHost = (tagName: string): string | null => {
  switch (tagName) {
    case 'caption':
      return 'captionx'
    case 'thead':
      return 'theadx'
    case 'tbody':
      return 'tbodyx'
    case 'tfoot':
      return 'tfootx'
    case 'tr':
      return 'trx'
    case 'td':
      return 'tdx'
    case 'th':
      return 'thx'
    case 'colgroup':
      return 'colgroupx'
    case 'col':
      return 'colx'
    default:
      return null
  }
}

const getTableAliasTag = (host: string | null): string | undefined => {
  switch (host) {
    case 'captionx':
      return 'caption'
    case 'theadx':
      return 'thead'
    case 'tbodyx':
      return 'tbody'
    case 'tfootx':
      return 'tfoot'
    case 'trx':
      return 'tr'
    case 'tdx':
      return 'td'
    case 'thx':
      return 'th'
    case 'colgroupx':
      return 'colgroup'
    case 'colx':
      return 'col'
    default:
      return undefined
  }
}

const closeTag = (tagText: string, tagName: string): string =>
  `${tagText}</${tagName}>`

const expandSelfClosingTag = (tagText: string, tagName: string): string =>
  `${tagText.slice(0, tagText.length - 2)}></${tagName}>`

export const preprocess = (template: string): string => {
  let i = 0
  const out: string[] = []
  const stack: Array<{
    replacementHost: string | null
    effectiveTag: string
    isTableAlias: boolean
  }> = []
  const ignoredClosingTags: Array<{ tagName: string; emit: boolean }> = []
  let tableScopeDepth = 0

  while (i < template.length) {
    const lt = template.indexOf('<', i)
    if (lt === -1) {
      out.push(template.slice(i))
      break
    }

    out.push(template.slice(i, lt))

    if (template.startsWith('<!--', lt)) {
      const end = template.indexOf('-->', lt + 4)
      if (end === -1) {
        out.push(template.slice(lt))
        break
      }
      out.push(template.slice(lt, end + 3))
      i = end + 3
      continue
    }

    const tagEnd = findTagEnd(template, lt)
    if (tagEnd === -1) {
      out.push(template.slice(lt))
      break
    }

    const rawTag = template.slice(lt, tagEnd + 1)
    const isClosing = rawTag.startsWith('</')
    const isSpecial = rawTag.startsWith('<!') || rawTag.startsWith('<?')

    if (isSpecial) {
      out.push(rawTag)
      i = tagEnd + 1
      continue
    }

    const range = parseTagNameRange(rawTag, isClosing)
    if (!range) {
      out.push(rawTag)
      i = tagEnd + 1
      continue
    }

    const tagName = rawTag.slice(range.start, range.end)
    const nativeTagName = range.hasUppercase ? '' : tagName

    if (isClosing) {
      const ignoredClosing = ignoredClosingTags[ignoredClosingTags.length - 1]
      if (ignoredClosing?.tagName === tagName) {
        ignoredClosingTags.pop()
        if (ignoredClosing.emit) out.push(rawTag)
        i = tagEnd + 1
        continue
      }
      const top = stack[stack.length - 1]
      if (top) {
        stack.pop()
        out.push(top.replacementHost ? `</${top.replacementHost}>` : rawTag)
        if (!top.isTableAlias && isTableScopeTag(top.effectiveTag))
          --tableScopeDepth
      } else {
        out.push(rawTag)
      }
      i = tagEnd + 1
      continue
    }

    const selfClosing = rawTag.charCodeAt(rawTag.length - 2) === 47 // '/>'
    const parent = stack[stack.length - 1]
    let replacementHost: string | null = null
    if (tableScopeDepth === 0) {
      replacementHost = getTableAliasHost(nativeTagName)
    } else if (isRowParentTag(parent?.effectiveTag ?? '')) {
      replacementHost = nativeTagName === 'tr' ? null : 'tr'
    } else if (parent?.effectiveTag === 'table') {
      replacementHost = isTableDirectAllowed(nativeTagName) ? null : 'tr'
    } else if (parent?.effectiveTag === 'tr') {
      replacementHost =
        nativeTagName === 'td' || nativeTagName === 'th' ? null : 'td'
    } else if (parent?.effectiveTag === 'colgroup') {
      replacementHost = nativeTagName === 'col' ? null : 'col'
    }
    const aliasTag = getTableAliasTag(replacementHost)
    const isTableAlias = aliasTag !== undefined

    const shouldExpandSelfClosing =
      selfClosing && !voidElements.has(replacementHost || nativeTagName)
    const shouldCloseVoidAlias =
      !!replacementHost &&
      aliasTag === nativeTagName &&
      voidElements.has(nativeTagName)
    const shouldIgnoreClosingTag =
      !selfClosing &&
      !!replacementHost &&
      voidElements.has(replacementHost) &&
      !shouldCloseVoidAlias
    const shouldIgnoreNativeVoidClosingTag =
      !selfClosing && !replacementHost && voidElements.has(nativeTagName)

    if (replacementHost) {
      const rewrittenTag = `${rawTag.slice(0, range.start)}${replacementHost} is="${aliasTag ? `r-${aliasTag}` : `regor:${tagName}`}"${rawTag.slice(range.end)}`
      out.push(
        shouldExpandSelfClosing
          ? expandSelfClosingTag(rewrittenTag, replacementHost)
          : shouldCloseVoidAlias
            ? closeTag(rewrittenTag, replacementHost)
            : rewrittenTag,
      )
    } else {
      out.push(
        shouldExpandSelfClosing
          ? expandSelfClosingTag(rawTag, tagName)
          : rawTag,
      )
    }

    if (shouldIgnoreClosingTag) {
      ignoredClosingTags.push({ tagName, emit: false })
    } else if (shouldCloseVoidAlias && !selfClosing) {
      ignoredClosingTags.push({ tagName, emit: false })
    } else if (shouldIgnoreNativeVoidClosingTag) {
      ignoredClosingTags.push({ tagName, emit: true })
    }

    if (
      !selfClosing &&
      !shouldCloseVoidAlias &&
      !shouldIgnoreClosingTag &&
      !shouldIgnoreNativeVoidClosingTag &&
      !voidElements.has(replacementHost ?? nativeTagName)
    ) {
      const effectiveTag =
        aliasTag ?? replacementHost ?? (nativeTagName || tagName)
      stack.push({
        replacementHost,
        effectiveTag,
        isTableAlias,
      })
      if (!isTableAlias && isTableScopeTag(effectiveTag)) ++tableScopeDepth
    }

    i = tagEnd + 1
  }

  return out.join('')
}
