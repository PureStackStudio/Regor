import { computed, html, ref, sref } from 'regor'

const initialServices = [
  { id: 'api', name: 'Public API', region: 'Frankfurt', healthy: true },
  { id: 'search', name: 'Search index', region: 'Amsterdam', healthy: false },
  { id: 'jobs', name: 'Background jobs', region: 'Frankfurt', healthy: true },
  { id: 'media', name: 'Media delivery', region: 'London', healthy: true },
]

export function createServices(interactive = false) {
  const query = ref('')
  const status = ref('all')
  const services = sref(initialServices.map((service) => ({ ...service })))
  const visible = computed(() =>
    services().filter((service) => {
      const matchesText = `${service.name} ${service.region}`
        .toLowerCase()
        .includes(query().trim().toLowerCase())
      return (
        matchesText &&
        (status() === 'all' || service.healthy === (status() === 'healthy'))
      )
    }),
  )
  // The row objects are plain values: replace the shallow ref's array to notify.
  const toggle = (id: string) =>
    services(
      services().map((service) =>
        service.id === id ? { ...service, healthy: !service.healthy } : service,
      ),
    )
  const reset = () => {
    query('')
    status('all')
  }
  return { interactive, query, status, services, visible, toggle, reset }
}

export const servicesTemplate = html` <div class="guide-demo">
  <div class="guide-filter">
    <label
      >Find a service<input
        type="search"
        placeholder="Try Frankfurt..."
        r-model="query"
        :disabled="!interactive"
    /></label>
    <label
      >Status<select r-model="status" :disabled="!interactive">
        <option value="all">All services</option>
        <option value="healthy">Healthy</option>
        <option value="degraded">Degraded</option>
      </select></label
    >
  </div>
  <p class="guide-result-count" role="status">
    {{ visible.length }} of {{ services.length }} services · illustrative data
  </p>
  <ul class="guide-service-list">
    <li r-for="service in visible" :key="service.id">
      <div>
        <strong>{{ service.name }}</strong><small>{{ service.region }}</small>
      </div>
      <button
        type="button"
        :class="{ 'is-healthy': service.healthy }"
        :aria-label="'Toggle status of ' + service.name"
        @click="toggle(service.id)"
        :disabled="!interactive"
      >
        <i aria-hidden="true"></i>{{ service.healthy ? 'Healthy' : 'Degraded' }}
      </button>
    </li>
  </ul>
  <div r-if="visible.length === 0" class="guide-empty">
    <strong>No matching services.</strong>
    <p>Try a different search or status.</p>
    <button type="button" @click="reset" :disabled="!interactive">
      Clear filters
    </button>
  </div>
  <p class="guide-hint">
    Filter the list, then click a status to change it. Stable keys identify each
    row.
  </p>
</div>`
