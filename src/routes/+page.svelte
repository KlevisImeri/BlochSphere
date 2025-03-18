<script lang="ts">
import { Canvas } from '@threlte/core'
import Sphere from '$lib/BlochSphere.svelte'
import TextEditor from '$lib/TextEditor.svelte' 
import type { Vector3Tuple } from 'three';

let element: HTMLElement | undefined = $state()
let paths = $state<Vector3Tuple[][]>([])

//TODO: convert the bits into the right 3D place on the shpere
function show(...vectors: any[]) {
  const path: Vector3Tuple[] = [];  
  for (const vec of vectors) {
    let complex;
    if (vec.size) {
      complex = vec.get([0, 0]);
    } else {
      complex = vec;
    }
    
    if (typeof complex === 'object' && complex.re !== undefined) {
      const magnitude = Math.sqrt(complex.re * complex.re + complex.im * complex.im);      
      if (Math.abs(magnitude - 1) < 0.001) {
        path.push([complex.re, complex.im, 0]);
      } else {
        console.warn(`Vector skipped: Magnitude ${magnitude} is not 1`);
      }
    } else {
      console.warn("Vector skipped: Not a complex number");
    }
  }
  
  if (path.length > 0) {
    paths.push(path);
    console.log("Added unit vector path:", path);
  } else {
    console.warn("No valid unit vectors found to add as path");
  }
  
  return path;
}
</script>

<div class="bg-zinc-900 h-screen w-screen flex">
  <div class="w-2/6 h-full border-r border-zinc-700">
    <TextEditor />
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
