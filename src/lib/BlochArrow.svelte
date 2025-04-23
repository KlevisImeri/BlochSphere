<script lang="ts">
  import { Vector3, Quaternion, Euler} from 'three';
  import { T } from '@threlte/core';

  let radius: number = 5;                // r (magnitude)
  export let theta: number = 0;          // θ [0, π] polar angle from y-axis
  export let phi: number = 0;            // φ [0, 2π] azimuthal angle around y-axis
  export let color: string = 'white';
  let shaftRadius: number = 0.05;
  let headRadius: number = 0.1;
  let headLength = 0.3;
  let SHIFT = -0.1;
  const shaftLength = radius + SHIFT*2;

  // Convert spherical to cartesian coordinates
  const direction = new Vector3();
  direction.setFromSphericalCoords(
    radius,
    theta,    // θ - polar angle from positive y-axis
    phi       // φ - azimuthal angle around y-axis
  );

  // Calculate rotation using quaternion
  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0), // Default up direction
    direction.clone().normalize()
  );
  
  // Convert to Euler angles tuple for Threlte
  const euler = new Euler().setFromQuaternion(quaternion);
  const rotation: [number, number, number] = [euler.x, euler.y, euler.z];
</script>

<T.Group {rotation}>
  <!-- Arrow Shaft -->
  <T.Mesh position.y={shaftLength / 2 + SHIFT}>
    <T.CylinderGeometry
      args={[shaftRadius, shaftRadius, shaftLength, 8]}
    />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>

  <!-- Arrow Head -->
  <T.Mesh position.y={shaftLength}>
    <T.ConeGeometry
      args={[headRadius, headLength, 8]}
    />
    <T.MeshStandardMaterial {color} />
  </T.Mesh>
</T.Group>
