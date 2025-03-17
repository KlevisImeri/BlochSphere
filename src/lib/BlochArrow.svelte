<script lang="ts">
  import { Vector3 as Vec, ArrowHelper, Euler, Group } from 'three';
  import { T } from '@threlte/core';

  export let dir = new Vec( 0, 1, 1 )
  export let length = 5;
  // export let origin = new Vec( 0, 0, 0 ) 
  export let color: string = 'white'
  // export let headLength = length * 0.2
  // export let headWidth = headLength * 0.2 
  
  let SHIFT = -0.1;

</script>

<T.Group  rotation={[1, 0, 0]}>
  <T.Mesh position.y={length / 2 + SHIFT}>
    <T.CylinderGeometry args={[0.05, 0.05, length + SHIFT * 2, 8]} />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>

  <T.Mesh position.y={length - 0.14}>
    <T.ConeGeometry args={[0.1, 0.3, 8]} />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>

</T.Group>
