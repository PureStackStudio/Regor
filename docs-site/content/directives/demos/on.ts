import { html, ref } from 'regor'

export function createOn(interactive = false) {
  const message = ref('Ship something useful')
  const submissions = ref(0)
  const lastMessage = ref('Nothing submitted yet.')
  const submit = () => {
    submissions(submissions() + 1)
    lastMessage(message().trim() || 'An empty message')
  }
  return { interactive, message, submissions, lastMessage, submit }
}

export const onTemplate = html` <div class="guide-demo guide-demo--split">
  <form class="guide-controls" @submit.prevent="submit">
    <label for="event-message">Message</label
    ><input
      id="event-message"
      type="text"
      maxlength="80"
      r-model="message"
      :value="message"
      :disabled="!interactive"
    /><button type="submit" :disabled="!interactive">Submit locally</button>
    <p class="guide-hint">
      Press Enter or click Submit. .prevent keeps the page in place. No message
      is sent.
    </p>
  </form>
  <div class="guide-readout">
    <span class="guide-kicker">SUBMIT EVENT / HANDLED</span
    ><output class="guide-total">{{ submissions }}</output>
    <p role="status">{{ lastMessage }}</p>
  </div>
</div>`
