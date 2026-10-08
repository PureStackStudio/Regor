import { createApp, useScope } from 'regor'
import { createQuote, quoteTemplate } from './quote'
import { createServices, servicesTemplate } from './services'
import { createProfile, profileTemplate } from './profile'
import { createLifecycle, lifecycleTemplate } from './lifecycle'

// Each guide mounts only its own island. Everything outside the root stays static.
function mount<T extends object>(
  id: string,
  create: (interactive: boolean) => T,
  template: string,
) {
  const element = document.getElementById(id)
  if (element)
    createApp(
      useScope(() => create(true)),
      { element, template },
    )
}

mount('guide-quote', createQuote, quoteTemplate)
mount('guide-services', createServices, servicesTemplate)
mount('guide-profile', createProfile, profileTemplate)
mount('guide-lifecycle', createLifecycle, lifecycleTemplate)
