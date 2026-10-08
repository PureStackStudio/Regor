import { defineComponent, html } from 'regor'
import {
  type ChartModel,
  createChartModel,
} from '../content/examples/chart-model'
import { chartTemplate } from '../content/examples/chart-view'
import { defineGuideComponents } from './guideComponents'
import { defineDirectiveComponents } from './directiveComponents'
import { defineApiComponents } from './apiComponents'
import { defineRegorTopBar } from './topBar'

export interface RegorFeature {
  number: string
  title: string
  summary: string
  href: string
  icon: string
}

const featureTemplate = html`<article class="regor-feature">
  <Flex class="feature-meta" align="center" justify="between">
    <span>{{ number }}</span><Icon :name="icon" />
  </Flex>
  <h3>{{ title }}</h3>
  <p>{{ summary }}</p>
  <a :href="href" class="feature-link"
    >Explore <span>{{ title }}</span><Icon name="tabler:arrow-up-right"
  /></a>
</article>`

export interface RegorResource {
  number: string
  title: string
  summary: string
  href: string
}

const resourceTemplate = html`<a :href="href" class="regor-resource">
  <span class="resource-number">{{ number }}</span>
  <div>
    <h3>{{ title }}</h3>
    <p>{{ summary }}</p>
  </div>
  <Icon name="tabler:arrow-up-right" />
</a>`

export function defineRegorComponents() {
  return {
    RegorTopBar: defineRegorTopBar(),
    ...defineGuideComponents(),
    ...defineDirectiveComponents(),
    ...defineApiComponents(),
    SignalChart: defineComponent<ChartModel>(chartTemplate, {
      context: () => createChartModel(),
    }),
    RegorFeature: defineComponent<RegorFeature>(featureTemplate, {
      props: ['number', 'title', 'summary', 'href', 'icon'],
    }),
    RegorResource: defineComponent<RegorResource>(resourceTemplate, {
      props: ['number', 'title', 'summary', 'href'],
    }),
  }
}
