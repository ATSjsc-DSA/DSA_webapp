<template>
  <div class="card mb-4">
    <h3>Documentation</h3>
    <p class="bg-primary border-round p-3">
      This application for DSA_Service, @Atsjsc - all rights reserved
      <a href="https://ats.com.vn/" class="font-bold bg-primary hover:underline">Atsjsc</a>
    </p>
    <h5>Getting Started</h5>
    <p>Smart-DSA solution of ATS JSC Company for Dynamic Security Assessment calculation application.</p>
    <p>Includes 3 main modules:</p>
    <p>SSR</p>
    <pre
      class="app-code"
    ><code> Calculate and evaluate the risk of resonance under synchronization of generating units at the time of calculation with scenarios of changing grid configuration (SSR-Sub Synchronous Resonance). </code></pre>
    <p>TSA</p>
    <pre
      class="app-code"
    ><code> Calculate transmission limit assessment to ensure dynamic stability at message time (TSA - Transient Security Assessment). </code></pre>
    <p>VSA</p>
    <pre
      class="app-code"
    ><code> Calculate the voltage stability limit, the level of backup at the time of calculation and the load shedding plan to ensure the stability limit (VSA - Voltage Security Assessment). </code></pre>

    <P> Dashboard screen for centralized data management according to proposed criteria </P>
    <h5>Structure</h5>
    <p>
      Smart-DSA includes calculations that can be performed automatically with a settable period (approximately 5-30
      minutes) taking into account random fault modes (n-1), (n-2) or (n-k) as well as load shedding systems F27, F81
      and SPS. Specific displays in each module:
    </p>
    <ul class="line-height-3">
      <li>
        <span class="text-primary font-medium">Dashboard</span>: Monitor existing smart-DSA functions on a centralized
        screen including an expanded map calculated according to selected criteria. You can drag, drop, and replace
        those functions on the screen
      </li>
      <li>
        <span class="text-primary font-medium">SSR</span>: Calculate according to the results of SSR criteria to warn on
        the map, draw charts of generating sets at the time of change
      </li>
      <li>
        <span class="text-primary font-medium">TSA</span>: Calculate according to TSA criteria results to warn on the
        map. Graphs of calculations include SPS Check, TTTG Check and lines
      </li>
      <li><span class="text-primary font-medium">DSA</span>: Assets used in layout</li>
    </ul>

    <h5>Sidebar Config</h5>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
  .video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
