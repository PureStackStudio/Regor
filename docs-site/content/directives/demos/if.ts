import { html, ref } from 'regor'

export function createIf(interactive = false) {
  return { interactive, status: ref('review') }
}

export const ifTemplate = html` <div class="guide-demo">
  <div class="guide-controls">
    <label for="branch-status">Release status</label
    ><select id="branch-status" r-model="status" :disabled="!interactive">
      <option value="review">In review</option>
      <option value="ready">Ready</option>
      <option value="blocked">Blocked</option>
    </select>
  </div>
  <article class="directive-card directive-branch" r-if="status === 'ready'">
    <span class="guide-kicker">R-IF / READY</span
    ><strong>Ready to ship.</strong>
    <p>All checks passed. The release can move forward.</p>
  </article>
  <article
    class="directive-card directive-branch"
    r-else-if="status === 'review'"
  >
    <span class="guide-kicker">R-ELSE-IF / REVIEW</span
    ><strong>One more look.</strong>
    <p>The release is waiting for a review.</p>
  </article>
  <article class="directive-card directive-branch" r-else>
    <span class="guide-kicker">R-ELSE / BLOCKED</span
    ><strong>Resolve the blocker.</strong>
    <p>The release is paused until the issue is fixed.</p>
  </article>
  <p class="guide-hint">
    Exactly one branch is mounted. Switching status replaces it.
  </p>
</div>`
