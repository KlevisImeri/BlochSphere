<script lang="ts">
import { Canvas } from '@threlte/core';
import Sphere from '$lib/BlochSphere.svelte';
let element: HTMLElement | undefined = $state()
</script>


<div
  id="css-renderer-target"
  bind:this={element}
></div>
<div class="bg-zinc-900 h-screen w-screen">
  <Canvas>
    <Sphere {element} />
  </Canvas>
</div>

<style>
  #css-renderer-target {
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
  }
</style>
