import { defineComponent } from 'regor'
import {
  createCounter,
  counterTemplate,
} from '../content/examples/first-app/counter'
import { createQuote, quoteTemplate } from '../content/guide/demos/quote'
import {
  createServices,
  servicesTemplate,
} from '../content/guide/demos/services'
import { createProfile, profileTemplate } from '../content/guide/demos/profile'
import {
  createLifecycle,
  lifecycleTemplate,
} from '../content/guide/demos/lifecycle'

export function defineGuideComponents() {
  return {
    GettingStartedCounter: defineComponent(counterTemplate, {
      context: () => createCounter(),
    }),
    GuideQuote: defineComponent(quoteTemplate, {
      context: () => createQuote(),
    }),
    GuideServices: defineComponent(servicesTemplate, {
      context: () => createServices(),
    }),
    GuideProfile: defineComponent(profileTemplate, {
      context: () => createProfile(),
    }),
    GuideLifecycle: defineComponent(lifecycleTemplate, {
      context: () => createLifecycle(),
    }),
  }
}
