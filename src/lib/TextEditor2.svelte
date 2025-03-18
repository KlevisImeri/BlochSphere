<script lang='ts'>
import { 
  matrix, 
  multiply, 
  parse 
} from 'mathjs'
import type { Vector3Tuple } from 'three';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

let { paths = $bindable() } = $props<{paths: Vector3Tuple[][]}>()
const i = parse('i').evaluate();

let code = $state(`const M = matrix([
  [1 + 2 * i, 3 - i],
  [i, 4 + 2 * i]
]);

const v = matrix([
  [2 - 3 * i],
  [1 + 4 * i]
]);

const res = multiply(M, v);

show(res);
`);

hljs.registerLanguage('javascript', javascript);
let codeElement: HTMLPreElement;

function updateHighlight() {
  if (codeElement) {
    codeElement.innerHTML = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    hljs.highlightElement(codeElement);
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLPreElement;
  code = target.innerText;
  updateHighlight();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    document.execCommand('insertText', false, '  ');
  }
}

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

function runCode() {
  try {
    paths = [];
    eval(code);
  } catch (error) {
    console.error("Error:", error);
  }
}


</script>

<!-- <div class="flex flex-col w-full h-screen p-4"> -->
<!--   <textarea -->
<!--     bind:value={code} -->
<!--     class="w-full h-full p-4 font-mono text-sm bg-zinc-900 text-white outline-none border-none" -->
<!--     onkeydown={handleKeyDown} -->
<!--   ></textarea> -->
<!-- </div> -->

<div class="flex flex-col w-full h-screen p-4">
  <div class="relative w-full h-full">
    <pre 
      bind:this={codeElement}
      contenteditable="true"
      oninput={handleInput}
      onkeydown={handleKeyDown}
      class="w-full h-full p-4 font-mono text-sm bg-white overflow-auto whitespace-pre"
    >{code}</pre>
  </div>
</div>

<style>
[contenteditable="true"] {
  caret-color: black; /* Customize cursor color */
  outline: none;
}

.hljs {
  background: transparent !important;
  padding: 0 !important;
}
</style>
