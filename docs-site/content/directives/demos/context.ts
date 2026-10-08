import { defineComponent, html, ref } from 'regor'

export function createContext(interactive = false) {
  const ReleaseCard = defineComponent(
    html`<article class="directive-card directive-context-card">
      <span class="guide-kicker">CHILD CONTEXT / OBJECT INPUT</span
      ><strong>{{ title || 'Untitled release' }}</strong>
      <p>
        {{ editable ? 'Editing is available.' : 'This release is read-only.' }}
      </p>
    </article>`,
    {
      context: () => ({ title: ref(''), editable: ref(false) }),
    },
  )
  return {
    interactive,
    title: ref('Regor release'),
    editable: ref(true),
    components: { ReleaseCard },
  }
}

export const contextTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="context-title">Parent title</label
    ><input
      id="context-title"
      type="text"
      maxlength="50"
      r-model="title"
      :value="title"
      :disabled="!interactive"
    /><label class="guide-check"
      ><input
        type="checkbox"
        r-model="editable"
        :checked="editable"
        :disabled="!interactive"
      />
      Allow editing</label
    >
  </div>
  <ReleaseCard :context="{ title: title, editable: editable }" />
</div>`
