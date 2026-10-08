import {
  computed,
  defineComponent,
  html,
  ref,
  unref,
  type RefOrValue,
} from 'regor'

interface ProfileProps {
  name: RefOrValue<string>
  role: RefOrValue<string>
  compact: RefOrValue<boolean>
}

export function createProfile(interactive = false) {
  const ProfileCard = defineComponent<
    ProfileProps & { initials: RefOrValue<string> }
  >(
    html` <article class="guide-profile" :class="{ 'is-compact': compact }">
      <div class="guide-avatar" aria-hidden="true">{{ initials }}</div>
      <div>
        <h3>{{ name || 'Your name' }}</h3>
        <p>{{ role }}</p>
      </div>
      <footer><slot name="footer"></slot></footer>
    </article>`,
    {
      props: ['name', 'role', 'compact'],
      context: (head) => {
        head.enableSwitch = true // The named slot reads the parent's context.
        return {
          ...head.props,
          initials: computed(
            () =>
              unref(head.props.name)
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0] ?? '')
                .join('')
                .toUpperCase() || '?',
          ),
        }
      },
    },
  )
  return {
    interactive,
    name: ref('Ada Lovelace'),
    role: ref('Engineer'),
    compact: ref(false),
    available: ref(true),
    components: { ProfileCard },
  }
}

export const profileTemplate = html` <div class="guide-demo guide-demo--split">
  <div class="guide-controls">
    <label for="profile-name">Display name</label
    ><input
      id="profile-name"
      type="text"
      maxlength="40"
      r-model="name"
      :disabled="!interactive"
    />
    <label for="profile-role">Role</label
    ><select id="profile-role" r-model="role" :disabled="!interactive">
      <option>Engineer</option>
      <option>Designer</option>
      <option>Researcher</option>
    </select>
    <label class="guide-check"
      ><input type="checkbox" r-model="compact" :disabled="!interactive" />
      Compact layout</label
    >
    <label class="guide-check"
      ><input type="checkbox" r-model="available" :disabled="!interactive" />
      Available for a project</label
    >
  </div>
  <div class="guide-profile-preview">
    <span class="guide-kicker">CHILD COMPONENT / LIVE PROPS</span>
    <ProfileCard :name="name" :role="role" :compact="compact">
      <template #footer
        ><span class="guide-slot-label">PARENT SLOT</span
        ><span
          >{{ available ? 'Open to collaboration' : 'Focused on a project'
          }}</span
        ></template
      >
    </ProfileCard>
  </div>
</div>`
