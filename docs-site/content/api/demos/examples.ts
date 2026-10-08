import { createState, stateTemplate } from './state'
import { createDerived, derivedTemplate } from './derived'
import { createObservation, observationTemplate } from './observation'
import { createEffects, effectsTemplate } from './effects'
import { createBatching, batchingTemplate } from './batching'
import { createNotifications, notificationsTemplate } from './notifications'
import { createEntanglement, entanglementTemplate } from './entanglement'
import { createRawState, rawStateTemplate } from './raw-state'
import { createTemplates, templatesTemplate } from './templates'
import { createCleanup, cleanupTemplate } from './cleanup'
import { createRegistry, registryTemplate } from './registry'
import { createValidation, validationTemplate } from './validation'
import { createConfiguration, configurationTemplate } from './configuration'
import { createLifecycle, lifecycleTemplate } from '../../guide/demos/lifecycle'
import { createProfile, profileTemplate } from '../../guide/demos/profile'
import {
  createCounter,
  counterTemplate,
} from '../../examples/first-app/counter'

export const apiExamples = {
  state: { create: createState, template: stateTemplate },
  derived: { create: createDerived, template: derivedTemplate },
  observation: { create: createObservation, template: observationTemplate },
  effects: { create: createEffects, template: effectsTemplate },
  batching: { create: createBatching, template: batchingTemplate },
  notifications: {
    create: createNotifications,
    template: notificationsTemplate,
  },
  entanglement: { create: createEntanglement, template: entanglementTemplate },
  rawState: { create: createRawState, template: rawStateTemplate },
  templates: { create: createTemplates, template: templatesTemplate },
  cleanup: { create: createCleanup, template: cleanupTemplate },
  registry: { create: createRegistry, template: registryTemplate },
  validation: { create: createValidation, template: validationTemplate },
  configuration: {
    create: createConfiguration,
    template: configurationTemplate,
  },
  lifecycle: { create: createLifecycle, template: lifecycleTemplate },
  component: { create: createProfile, template: profileTemplate },
  app: { create: createCounter, template: counterTemplate },
} as const
