<script lang="ts">
import { Canvas } from '@threlte/core'
import Sphere from '$lib/BlochSphere.svelte'
import TextEditor from '$lib/TextEditor.svelte' 
import type { Vector3Tuple } from 'three';

let element: HTMLElement | undefined = $state()
let paths = $state<Vector3Tuple[][]>([])
</script>

<div class="bg-zinc-900 h-screen w-screen flex">
  <div class="w-1/3 h-full border-r border-zinc-700">
    <TextEditor bind:paths />
  </div>
  
  <div class="flex-1 relative">
    <div
      id="css-renderer-target"
      bind:this={element}
      class="absolute top-0 left-0 w-full h-full pointer-events-none"
    ></div>
    
    <Canvas>
      <Sphere {element} {paths} />
    </Canvas>
  </div>
</div>

<style>
  #css-renderer-target {
    z-index: 1;
    transform: translateZ(0);
  }
</style>
