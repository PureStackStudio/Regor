import { expect, test } from 'vitest'

import { preprocess } from '../../src/app/preprocess-template'

test('returns original template when tbody does not exist', () => {
  const template = '<div><Foo/></div>'
  expect(preprocess(template)).toBe('<div><Foo></Foo></div>')
})

test('rewrites tr/td outside tbody into alias hosts', () => {
  const template = '<tr><td>A</td><td>B</td></tr>'
  expect(preprocess(template)).toBe(
    '<trx is="r-tr"><tdx is="r-td">A</tdx><tdx is="r-td">B</tdx></trx>',
  )
})

test('rewrites th outside tbody into alias host', () => {
  const template = '<tr><th>A</th></tr>'
  expect(preprocess(template)).toBe(
    '<trx is="r-tr"><thx is="r-th">A</thx></trx>',
  )
})

test('rewrites caption outside table into alias host', () => {
  const template = '<caption>People</caption>'
  expect(preprocess(template)).toBe(
    '<captionx is="r-caption">People</captionx>',
  )
})

test('rewrites colgroup and col outside table into alias hosts', () => {
  const template = '<colgroup><col span="2"><col /></colgroup>'
  expect(preprocess(template)).toBe(
    '<colgroupx is="r-colgroup"><colx is="r-col" span="2"></colx><colx is="r-col" ></colx></colgroupx>',
  )
})

test('rewrites colgroup root with explicit native col close without corrupting following columns', () => {
  const template = '<colgroup><col></col><col /></colgroup>'
  expect(preprocess(template)).toBe(
    '<colgroupx is="r-colgroup"><colx is="r-col"></colx><colx is="r-col" ></colx></colgroupx>',
  )
})

test('rewrites table section roots outside table into alias hosts', () => {
  const template =
    '<thead><tr><th>H</th></tr></thead><tbody><tr><td>B</td></tr></tbody><tfoot><tr><td>F</td></tr></tfoot>'
  expect(preprocess(template)).toBe(
    '<theadx is="r-thead"><trx is="r-tr"><thx is="r-th">H</thx></trx></theadx><tbodyx is="r-tbody"><trx is="r-tr"><tdx is="r-td">B</tdx></trx></tbodyx><tfootx is="r-tfoot"><trx is="r-tr"><tdx is="r-td">F</tdx></trx></tfootx>',
  )
})

test('does not treat PascalCase table-like component names as native aliases', () => {
  expect(
    preprocess(
      '<Caption></Caption><Thead><Tr><Td>A</Td><Th>B</Th></Tr></Thead><Tbody></Tbody><Tfoot></Tfoot>',
    ),
  ).toBe(
    '<Caption></Caption><Thead><Tr><Td>A</Td><Th>B</Th></Tr></Thead><Tbody></Tbody><Tfoot></Tfoot>',
  )
  expect(preprocess('<Col />')).toBe('<Col ></Col>')
  expect(preprocess('<Table><Col /></Table>')).toBe(
    '<Table><Col ></Col></Table>',
  )
})

test('keeps valid colgroup and col table children unchanged', () => {
  const template =
    '<table><caption>People</caption><colgroup><col span="2"></colgroup><tbody><tr><td>A</td></tr></tbody></table>'
  expect(preprocess(template)).toBe(template)
})

test('rewrites direct table child col to row host because col belongs in colgroup', () => {
  const template =
    '<table><col span="2" /><tbody><tr><td>A</td></tr></tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><tr is="regor:col" span="2" ></tr><tbody><tr><td>A</td></tr></tbody></table>',
  )
})

test('rewrites direct colgroup child components to col hosts', () => {
  const template = '<table><colgroup><TableCol span="2" /></colgroup></table>'
  expect(preprocess(template)).toBe(
    '<table><colgroup><col is="regor:TableCol" span="2" /></colgroup></table>',
  )
})

test('rewrites direct colgroup child component with explicit close without corrupting following table scope', () => {
  const template =
    '<table><colgroup><TableCol span="2"></TableCol></colgroup><tbody><tr><td>A</td></tr></tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><colgroup><col is="regor:TableCol" span="2"></colgroup><tbody><tr><td>A</td></tr></tbody></table>',
  )
})

test('keeps explicit native col close from corrupting following table scope', () => {
  const template =
    '<table><colgroup><col></col></colgroup><tbody><tr><td>A</td></tr></tbody></table>'
  expect(preprocess(template)).toBe(template)
})

test('replaces direct tbody child non-tr self-closing tag', () => {
  const template = '<table><tbody>  <TableRow a="1" /> </tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><tbody>  <tr is="regor:TableRow" a="1" ></tr> </tbody></table>',
  )
})

test('replaces direct tbody child non-tr tag and its closing tag', () => {
  const template =
    '<table><tbody>\n<MyRow :x="x"><td>A</td></MyRow>\n</tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><tbody>\n<tr is="regor:MyRow" :x="x"><td>A</td></tr>\n</tbody></table>',
  )
})

test('rewrites direct tr children to td and keeps nested structure', () => {
  const template =
    '<table><tbody><tr><Cell /></tr><Custom><tr><Widget>X</Widget></tr></Custom></tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><tbody><tr><td is="regor:Cell" ></td></tr><tr is="regor:Custom"><td is="regor:tr"><Widget>X</Widget></td></tr></tbody></table>',
  )
})

test('keeps valid td and th direct tr children unchanged', () => {
  const template = '<table><tbody><tr><td>A</td><th>B</th></tr></tbody></table>'
  expect(preprocess(template)).toBe(template)
})

test('replaces non-td direct tr child opening and closing tags', () => {
  const template =
    '<table><tbody><tr><MyCell k="1">A</MyCell></tr></tbody></table>'
  expect(preprocess(template)).toBe(
    '<table><tbody><tr><td is="regor:MyCell" k="1">A</td></tr></tbody></table>',
  )
})

test('should normalize self-closing custom components in aliased tr', () => {
  const template = '<tr><TableCell /></tr>'
  expect(preprocess(template)).toBe(
    '<trx is="r-tr"><TableCell ></TableCell></trx>',
  )
})

test('should normalize self-closing kebab-case components in aliased tr', () => {
  const template = '<tr><table-cell /></tr>'
  expect(preprocess(template)).toBe(
    '<trx is="r-tr"><table-cell ></table-cell></trx>',
  )
})

test('normalizes self-closing custom tags outside table context', () => {
  expect(preprocess('<section><Icon /></section>')).toBe(
    '<section><Icon ></Icon></section>',
  )
  expect(preprocess('<btn><Icon /><span>x</span><Icon /></btn>')).toBe(
    '<btn><Icon ></Icon><span>x</span><Icon ></Icon></btn>',
  )
})

test('keeps void elements self-closing', () => {
  expect(preprocess('<div><img /><input /></div>')).toBe(
    '<div><img /><input /></div>',
  )
})

test('keeps malformed tags and unmatched closing tags unchanged', () => {
  expect(preprocess('<div><  ></div>')).toBe('<div><  ></div>')
  expect(preprocess('</ghost><div>x</div>')).toBe('</ghost><div>x</div>')
})

test('keeps special tags and unfinished tags unchanged', () => {
  const special = '<!doctype html><?xml version="1.0"?><div>x</div>'
  expect(preprocess(special)).toBe(special)
  expect(preprocess('<div')).toBe('<div')
})

test('preprocess supports plain text and unterminated comment tails', () => {
  expect(preprocess('plain text only')).toBe('plain text only')
  expect(preprocess('a<!--open comment')).toBe('a<!--open comment')
})
