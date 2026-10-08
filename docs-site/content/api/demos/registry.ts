import { ContextRegistry, html, ref } from 'regor'

class Workspace {
  constructor(readonly name: string) {}
}

export function createRegistry(interactive = false) {
  const registry = new ContextRegistry()
  const name = ref('Regor Studio'),
    resolved = ref('Nothing registered yet.')
  const register = () => {
    registry.register(new Workspace(name()))
    resolved(registry.require(Workspace).name)
  }
  const clear = () => {
    registry.unregisterByClass(Workspace)
    resolved(registry.find(Workspace)?.name ?? 'Nothing registered yet.')
  }
  return { interactive, name, resolved, register, clear }
}

export const registryTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="registry-name">Workspace instance</label
    ><input
      id="registry-name"
      type="text"
      maxlength="40"
      r-model="name"
      :value="name"
      :disabled="!interactive"
    />
    <div class="guide-session-bar">
      <button type="button" @click="register" :disabled="!interactive">
        Register / replace</button
      ><button type="button" @click="clear" :disabled="!interactive">
        Unregister
      </button>
    </div>
  </div>
  <div class="guide-readout">
    <span class="guide-kicker">RESOLVED BY CLASS</span
    ><output class="directive-output" role="status">{{ resolved }}</output>
    <p>
      The registry stores an instance. Editing the draft alone does not replace
      it.
    </p>
  </div>
</div>`
