import {
  addUnbinder,
  createApp,
  drainUnbind,
  getBindData,
  html,
  observerCount,
  onUnmounted,
  ref,
  removeNode,
  sref,
  unbind,
  useScope,
} from 'regor'

export function createCleanup(interactive = false) {
  const host = sref<HTMLElement | null>(null)
  const source = ref(0),
    value = ref(0),
    present = ref(false),
    bound = ref(false)
  const observers = ref(0),
    callbacks = ref(0),
    registered = ref(0)
  let node: HTMLElement | null = null
  const inspect = () => {
    observers(observerCount(source))
    registered(node ? getBindData(node).unbinders.length : 0)
  }
  const mount = () => {
    if (!host() || node) return
    node = document.createElement('div')
    node.className = 'directive-card api-owned-node'
    host()!.appendChild(node)
    createApp(
      useScope(() => ({ source })),
      {
        element: node,
        template:
          '<strong>Owned node</strong><p>Bound value: <output r-text="source"></output></p>',
      },
    )
    addUnbinder(node, () => callbacks(callbacks() + 1))
    present(true)
    bound(true)
    inspect()
  }
  const detach = () => {
    if (node) unbind(node)
    bound(false)
    inspect()
  }
  const remove = async () => {
    if (!node) return
    removeNode(node)
    await drainUnbind()
    node = null
    present(false)
    bound(false)
    inspect()
  }
  onUnmounted(() => {
    if (node) {
      unbind(node)
      node.remove()
    }
  })
  return {
    interactive,
    host,
    value,
    present,
    bound,
    observers,
    callbacks,
    registered,
    mount,
    detach,
    remove,
    increment: () => {
      source(source() + 1)
      value(source())
      inspect()
    },
  }
}

export const cleanupTemplate = html` <div class="guide-demo">
  <div class="guide-session-bar">
    <button type="button" @click="mount" :disabled="!interactive || present">
      Mount node</button
    ><button type="button" @click="increment" :disabled="!interactive">
      Write +1</button
    ><button type="button" @click="detach" :disabled="!interactive || !bound">
      Unbind</button
    ><button type="button" @click="remove" :disabled="!interactive || !present">
      Remove + drain
    </button>
  </div>
  <p>
    Source value: <strong>{{ value }}</strong> · Node: {{ present ? 'present' :
    'absent' }}
  </p>
  <div :ref="host"></div>
  <div class="guide-metrics">
    <div><output>{{ observers }}</output><span>Source observers</span></div>
    <div><output>{{ registered }}</output><span>Root unbinders</span></div>
    <div><output>{{ callbacks }}</output><span>Custom cleanup calls</span></div>
  </div>
  <p class="guide-hint">
    Unbind keeps the node but freezes its bindings. Remove + drain removes it
    and flushes deferred cleanup.
  </p>
</div>`
