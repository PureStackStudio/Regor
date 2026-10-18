import { defineComponent, RegorConfig } from '../../src'

export const REGOR_COMPONENT_TEMPLATE = `<section>
  <bench-row r-for="row in rows" :key="row.id" :row="row" class="bench-item">
    <span class="bench-slot" r-text="row.id"></span>
  </bench-row>
</section>`

export const createRegorComponentWorkload = () => {
  const config = new RegorConfig()
  const BenchLabel = defineComponent(
    '<span class="bench-label" r-text="label"></span>',
    { props: ['label'], config },
  )
  const BenchValue = defineComponent(
    '<span class="bench-value" r-text="value"></span>',
    { defaultName: 'BenchValue', props: ['value'], config },
  )
  config.addComponent(BenchValue)
  const BenchRow = defineComponent(
    `<article class="bench-row" :class="{ active: row.active }">
      <header><bench-label :label="row.label"></bench-label></header>
      <div><bench-value :value="row.value"></bench-value></div>
      <footer><slot></slot></footer>
    </article>`,
    {
      props: ['row'],
      context: () => ({ components: { BenchLabel } }),
      config,
    },
  )
  return { config, components: { BenchRow } }
}

export type VueBenchmarkComponent = {
  props?: string[]
  components?: Record<string, VueBenchmarkComponent>
  template: string
}

export const createVueComponentWorkload = (): VueBenchmarkComponent => {
  const BenchLabel = {
    props: ['label'],
    template: '<span class="bench-label">{{ label }}</span>',
  }
  const BenchValue = {
    props: ['value'],
    template: '<span class="bench-value">{{ value }}</span>',
  }
  const BenchRow = {
    props: ['row'],
    components: { BenchLabel, BenchValue },
    template: `<article class="bench-row" :class="{ active: row.active }">
      <header><bench-label :label="row.label"></bench-label></header>
      <div><bench-value :value="row.value"></bench-value></div>
      <footer><slot></slot></footer>
    </article>`,
  }
  return {
    components: { BenchRow },
    template: `<section>
      <bench-row v-for="row in rows" :key="row.id" :row="row" class="bench-item">
        <span class="bench-slot">{{ row.id }}</span>
      </bench-row>
    </section>`,
  }
}

// Check actual rendered output after timing, so incomplete rendering cannot win.
export const verifyComponentWorkload = (
  root: HTMLElement,
  rows: ReadonlyArray<{
    id: number
    label: string
    value: number
    active: boolean
  }>,
  scenario = 'mount',
): void => {
  const cards = root.querySelectorAll<HTMLElement>('.bench-row')
  if (cards.length !== rows.length)
    throw new Error(
      `${scenario}: expected ${rows.length} component rows, got ${cards.length}`,
    )
  for (let i = 0; i < rows.length; ++i) {
    const card = cards[i]
    const row = rows[i]
    if (
      card.querySelector('.bench-label')?.textContent !== row.label ||
      card.querySelector('.bench-value')?.textContent !== String(row.value) ||
      card.querySelector('.bench-slot')?.textContent !== String(row.id) ||
      card.classList.contains('active') !== row.active ||
      !card.classList.contains('bench-item')
    )
      throw new Error(
        `${scenario}: incorrect component output for row ${row.id} at index ${i}`,
      )
  }
}
