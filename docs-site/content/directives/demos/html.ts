import { html, ref, computed } from 'regor'

// Only these fixed, trusted strings can reach r-html in this example.
const snippets = {
  welcome: '<strong>Welcome aboard.</strong> Your workspace is ready.',
  update: '<em>A small update:</em> the next release is in review.',
  shortcut: '<kbd>Ctrl</kbd> + <kbd>K</kbd> opens search.',
}

export function createHtml(interactive = false) {
  const selected = ref<keyof typeof snippets>('welcome')
  return { interactive, selected, markup: computed(() => snippets[selected()]) }
}

export const htmlTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="html-snippet">Trusted snippet</label
    ><select id="html-snippet" r-model="selected" :disabled="!interactive">
      <option value="welcome">Welcome</option>
      <option value="update">Release update</option>
      <option value="shortcut">Keyboard shortcut</option>
    </select>
  </div>
  <div class="directive-card">
    <span class="guide-kicker">RENDERED HTML</span>
    <p r-html="markup"></p>
  </div>
  <p class="guide-hint">
    The preview uses fixed strings. r-html does not sanitize arbitrary content.
  </p>
</div>`
