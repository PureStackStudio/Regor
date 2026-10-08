import { html } from 'regor'

export const chartTemplate = html`<div
  class="signal-dashboard theme--dark tone--neutral"
>
  <div class="signal-toolbar">
    <div>
      <span class="signal-kicker">SIGNAL STUDIO</span>
      <h3>Three streams. One reactive view.</h3>
    </div>
    <div class="signal-actions">
      <span class="signal-status" :class="{ 'is-live': running }"
        ><i aria-hidden="true"></i><span r-text="status"></span
      ></span>
      <button
        class="signal-button"
        type="button"
        :disabled="!interactive"
        :aria-pressed="!running"
        @click="togglePlayback"
        r-text="running ? 'Pause' : 'Resume'"
      ></button>
      <button
        class="signal-button"
        type="button"
        :disabled="!interactive"
        @click="newWindow"
      >
        Jump ahead
      </button>
    </div>
  </div>
  <div class="signal-controls">
    <label class="signal-field"
      >Workload
      <select
        name="workload"
        r-model="workload"
        :disabled="!interactive"
        aria-label="Simulated workload"
      >
        <option value="steady">Steady flow</option>
        <option value="launch">Launch spike</option>
        <option value="waves">Traffic waves</option>
      </select>
    </label>
    <label class="signal-field signal-intensity"
      >Intensity <span r-text="intensity + '%'"></span>
      <input
        name="intensity"
        type="range"
        min="40"
        max="140"
        step="1"
        r-model.number="intensity"
        :disabled="!interactive"
        aria-label="Signal intensity"
      />
    </label>
    <div class="signal-legend" role="group" aria-label="Visible streams">
      <button
        r-for="signal in signals"
        :key="signal.id"
        class="signal-chip"
        :class="['signal--' + signal.id, { 'is-hidden': !signal.enabled }]"
        :aria-pressed="signal.enabled"
        :disabled="!interactive"
        type="button"
        @click="toggle(signal.id)"
      >
        <i aria-hidden="true"></i><span r-text="signal.label"></span>
      </button>
    </div>
  </div>
  <div class="signal-metrics">
    <div>
      <span
        title="Average combined rate of the visible streams across all 60 samples"
        >Total average</span
      ><strong><span r-text="average"></span><small> events/s</small></strong>
    </div>
    <div>
      <span title="Highest rate in any visible stream across all 60 samples"
        >Stream peak</span
      ><strong><span r-text="peak"></span><small> events/s</small></strong>
    </div>
    <div>
      <span>Visible streams</span
      ><strong><span r-text="series.length"></span><small> / 3</small></strong>
    </div>
  </div>
  <div class="signal-plot">
    <p class="signal-empty" r-if="series.length === 0">
      Enable a stream to bring the chart back.
    </p>
    <svg
      class="signal-svg"
      :view-box.camel="'0 0 ' + width + ' 310'"
      role="img"
      aria-labelledby="signal-chart-title signal-chart-description"
      @pointermove="inspect"
      @pointerleave="followLatest"
    >
      <title id="signal-chart-title">
        Simulated event rates across 60 samples
      </title>
      <desc id="signal-chart-description" r-text="description"></desc>
      <defs>
        <linearGradient
          r-for="signal in signals"
          :key="signal.id"
          :id="'signal-fill-' + signal.id"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            class="signal-stop"
            :class="'signal--' + signal.id"
            stop-opacity="0.18"
          />
          <stop
            offset="100%"
            class="signal-stop"
            :class="'signal--' + signal.id"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
      <g class="signal-grid" r-for="line in grid" :key="line.value">
        <line :x1="plot.left" :x2="plot.right" :y1="line.y" :y2="line.y" />
        <text
          x="42"
          :y="line.y + 4"
          text-anchor="end"
          r-text="line.value"
        ></text>
      </g>
      <text class="signal-axis-label" x="58" y="14">EVENTS / SECOND</text>
      <path
        r-for="s in series"
        :key="s.id"
        class="signal-area"
        :d="s.area"
        :fill="'url(#signal-fill-' + s.id + ')'"
      ></path>
      <path
        r-for="s in series"
        :key="s.id"
        class="signal-line"
        :class="'signal--' + s.id"
        :d="s.line"
      ></path>
      <line
        class="signal-cursor"
        :x1="cursorX"
        :x2="cursorX"
        :y1="plot.top"
        :y2="plot.bottom"
      />
      <circle
        r-for="point in readout"
        :key="point.id"
        class="signal-point"
        :class="'signal--' + point.id"
        :cx="point.x"
        :cy="point.y"
        r="4.5"
      ></circle>
      <text
        class="signal-tick"
        r-for="tick in ticks"
        :key="tick.label"
        :x="tick.x"
        y="290"
        text-anchor="middle"
        r-text="tick.label"
      ></text>
    </svg>
  </div>
  <div class="signal-inspector">
    <span class="signal-sample" r-text="sampleLabel"></span>
    <div class="signal-readouts">
      <span
        r-for="point in readout"
        :key="point.id"
        :class="'signal--' + point.id"
        ><i aria-hidden="true"></i><span r-text="point.label"></span
        ><strong r-text="point.value"></strong
      ></span>
    </div>
    <label class="signal-scrubber"
      >Inspect<input
        name="sample"
        type="range"
        min="0"
        max="59"
        step="1"
        .value="index"
        @input="selectSample"
        :disabled="!interactive"
        aria-label="Inspect chart sample"
    /></label>
  </div>
  <div class="signal-footnote">
    <span>Synthetic data. Real reactive SVG.</span
    ><span>60 samples · 3 streams · no chart dependency</span>
  </div>
</div>`
