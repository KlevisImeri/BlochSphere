<script lang="ts">
import { Canvas } from '@threlte/core';
import Sphere from '$lib/BlochSphere.svelte';
import TextEditor from '$lib/TextEditor.svelte';
import { onMount } from 'svelte';

let element: HTMLElement | undefined = $state();

let textEditorElement: HTMLElement;
let mainContainerElement: HTMLElement;

let isDragging = $state(false);
let textEditorWidth = $state('40%');
let startX = 0;
let startWidth = 0;
let containerWidth = 0;

onMount(() => {
  if (mainContainerElement) {
    containerWidth = mainContainerElement.offsetWidth;
  }
});

function handleMouseDown(event: MouseEvent) {
  isDragging = true;
  startX = event.clientX;
  startWidth = textEditorElement.offsetWidth;
  if (mainContainerElement) {
    containerWidth = mainContainerElement.offsetWidth;
  }  
  event.preventDefault();
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging) return;
  const deltaX = event.clientX - startX;
  const minWidth = 200;
  const maxWidth = containerWidth * 0.8;
  const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX)); 
  textEditorWidth = `${newWidth}px`;
}

function handleMouseUp() {
  isDragging = false;
}

$effect(() => {
  if (isDragging) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  } else {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }
});
</script>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<div bind:this={mainContainerElement} class="main-container bg-zinc-900 h-screen w-screen flex select-none">
  <div bind:this={textEditorElement} class="text-editor-container h-full border-r border-zinc-700 overflow-hidden" style:width={textEditorWidth}>
    <TextEditor />
  </div>
  <div 
    class="drag-handle w-1 h-full bg-zinc-700 hover:bg-blue-300 active:bg-red-300 cursor-col-resize transition-colors duration-200 ease-in-out"
    on:mousedown={handleMouseDown} >
  </div>
  
  <div class="flex-1 relative min-w-0">
    <div
      id="css-renderer-target"
      bind:this={element}
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-10 transform-gpu"
    ></div>
    
    <Canvas>
      <Sphere {element}/>
    </Canvas>
  </div>
</div>

<style>
  :global(.main-container > div) {
    min-width: 0;
  }
</style>
