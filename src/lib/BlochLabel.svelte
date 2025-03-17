<!-- https://threlte.xyz/docs/examples/renderers/css2drenderer-overlay -->
<script lang="ts">
  import CssObject from '$lib/CssObject.svelte'
  import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
  import { useTask, useThrelte } from '@threlte/core'
  import type { Vector3Tuple } from 'three'

  const { position, text, element } = $props<{
    position: Vector3Tuple;
    text: string;
    element: HTMLElement;
  }>();
  const { autoRenderTask, camera, scene, size } = useThrelte()
  const cssRenderer = new CSS2DRenderer({ element })

  $effect(() => {
    cssRenderer.setSize($size.width, $size.height)
  })

  const last = scene.matrixWorldAutoUpdate
  scene.matrixWorldAutoUpdate = false
  $effect(() => {
    return () => {
      scene.matrixWorldAutoUpdate = last
    }
  })

  useTask(() => {
      scene.updateMatrixWorld()
    },{ before: autoRenderTask }
  )

  useTask(() => {
      cssRenderer.render(scene, camera.current)
    },{
      after: autoRenderTask,
      autoInvalidate: false
    }
  )
</script>

<CssObject {position} center={[0.5, 0.5]}>
  {#snippet content()}
    <div class="text-zinc-600 bg-transparent whitespace-nowrap font-mono text-md">
      {text}
    </div>
  {/snippet}
</CssObject>
