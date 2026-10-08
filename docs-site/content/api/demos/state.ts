import {
  computed,
  cref,
  flatten,
  html,
  isDeepRef,
  isRef,
  ref,
  sref,
  unref,
} from 'regor'

export function createState(interactive = false) {
  const original = { profile: { name: 'Ada' } }
  const deep = ref({ profile: { name: 'Ada' } })
  const copied = cref(original)
  const shallow = sref({ profile: { name: 'Ada' } })
  const name = ref('Grace')
  const apply = () => {
    deep().profile().name(name())
    copied().profile().name(name())
    shallow({ profile: { name: name() } })
  }
  return {
    interactive,
    name,
    deep,
    copied,
    shallow,
    apply,
    originalName: original.profile.name,
    snapshot: computed(() => JSON.stringify(flatten(deep()), null, 2)),
    refCheck: isRef(deep),
    deepCheck: isDeepRef(deep),
    shallowCheck: isDeepRef(shallow),
    plainName: computed(() => unref(deep().profile().name)),
  }
}

export const stateTemplate = html` <div class="guide-demo">
  <div class="guide-filter">
    <label
      >New name<input
        type="text"
        maxlength="30"
        r-model="name"
        :value="name"
        :disabled="!interactive" /></label
    ><button type="button" @click="apply" :disabled="!interactive">
      Apply to all three
    </button>
  </div>
  <div class="api-comparison">
    <article class="directive-card">
      <span class="guide-kicker">REF / DEEP</span
      ><strong>{{ deep.profile.name }}</strong>
      <p>Nested properties are refs.</p>
    </article>
    <article class="directive-card">
      <span class="guide-kicker">CREF / COPY FIRST</span
      ><strong>{{ copied.profile.name }}</strong>
      <p>Original still says {{ originalName }}.</p>
    </article>
    <article class="directive-card">
      <span class="guide-kicker">SREF / SHALLOW</span
      ><strong>{{ shallow.profile.name }}</strong>
      <p>Replace the plain object to notify.</p>
    </article>
  </div>
  <dl class="directive-values">
    <div>
      <dt>isRef(deep) / isDeepRef(deep)</dt>
      <dd>{{ refCheck }} / {{ deepCheck }}</dd>
    </div>
    <div>
      <dt>isDeepRef(shallow) / unref(name)</dt>
      <dd>{{ shallowCheck }} / {{ plainName }}</dd>
    </div>
  </dl>
  <pre class="api-snapshot" r-text="snapshot"></pre>
</div>`
