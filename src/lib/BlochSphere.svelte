<script lang="ts">
  import { T } from '@threlte/core';
  import {
    SphereGeometry,
    MeshPhongMaterial,
    BufferGeometry,
    LineBasicMaterial,
    Vector3,
  } from 'three';
  import type { Vector3Tuple } from 'three';
  import { OrbitControls } from '@threlte/extras';
  import Arrow from '$lib/BlochArrow.svelte';
  import Label from '$lib/BlochLabel.svelte';

  let autoRotate: boolean = false
  let enableDamping: boolean = true
  let rotateSpeed: number = 1
  let zoomToCursor: boolean = false
  let zoomSpeed: number = 1
  let minPolarAngle: number = 1
  let maxPolarAngle: number = 1
  let enableZoom: boolean = true 

  let SPHERE_SIZE = 5
  let AXES_SIZE = 5
  let MESH_SIZE = 40
  let LIGHT_DISTANCE = 100;

  let geometry = new SphereGeometry(SPHERE_SIZE, MESH_SIZE, MESH_SIZE);
  let material = new MeshPhongMaterial({
    color: 'gray',
    transparent: true,
    opacity: 0.25,
    specular: 0x222222,
    shininess: 10,
  });

  const axesGeometry = new BufferGeometry().setFromPoints([
      new Vector3(-AXES_SIZE, 0, 0), new Vector3(AXES_SIZE, 0, 0), // x-axis
      new Vector3(0, -AXES_SIZE, 0), new Vector3(0, AXES_SIZE, 0), // y-axis
      new Vector3(0, 0, -AXES_SIZE), new Vector3(0, 0, AXES_SIZE)  // z-axis
  ]);
  const axesMaterial = new LineBasicMaterial({ 
    color: 'gray',
    linewidth: 2
  });

  type lable = {
    position: Vector3Tuple;
    text: string;
  };
  
  // NOTE: Threlte uses Y as the up direction.
  // so Z->Y, Z->X, X->Y
  const labels: lable[] = [
    { position: [0, AXES_SIZE + 1, 0], text: '|0⟩' },
    { position: [0, -AXES_SIZE - 1, 0], text: '|1⟩' },
    { position: [0, 0, AXES_SIZE + 1], text: '|+⟩' },
    { position: [0, 0, -AXES_SIZE - 1], text: '|-⟩' },
    { position: [AXES_SIZE + 1, 0, 0], text: '|+i⟩' },
    { position: [-AXES_SIZE - 1, 0, 0], text: '|-i⟩' },
  ];

  export let element: HTMLElement;
  import { paths } from '$lib/stores';

  function colorForPath(i: number): string {
    if (i === 0) return 'hsl(0, 0%, 100%)';
    const hue = ((i - 1) * 137.508) % 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  function colorForPathRandom(): string {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 100%, 50%)`; 
  }

</script>

<T.Mesh {geometry} {material} />
<T.LineSegments geometry={axesGeometry} material={axesMaterial} />
{#each labels as { position, text }}
  <Label {element} {position} {text} />
{/each}

{#each $paths as path, i}
  {#each path as { theta, phi }}
    <Arrow {theta} {phi} color={colorForPath(i)} />
  {/each}
{/each}


<!-- https://threlte.xyz/docs/reference/extras/orbit-controls -->
<T.PerspectiveCamera
  makeDefault
  position={[15, 7.5, 15]}
  lookAt.y={0.5}
  fov={50}
>
  <T.DirectionalLight
    position={[LIGHT_DISTANCE, LIGHT_DISTANCE, LIGHT_DISTANCE]}
    intensity={0.8}
    castShadow
  />
  <OrbitControls
    {enableDamping}
    {autoRotate}
    {rotateSpeed}
    {zoomToCursor}
    {zoomSpeed}
    {minPolarAngle}
    {maxPolarAngle}
    {enableZoom}
  >
  </OrbitControls>
</T.PerspectiveCamera>
<T.AmbientLight intensity={0.5} />


