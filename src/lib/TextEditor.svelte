<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import {
    matrix,
    multiply,
    parse,
    sqrt,
    complex,
    Matrix,
    type Complex,
  } from 'mathjs';
import {
  matrixToQubitVector,
  vectorToPolarArray,
  type QubitPolar,
} from '$lib/blochUtils.ts';
  
  export let paths: QubitPolar[][] = [];
  function show(...matrices: Matrix<Complex>[]) {
    const qubitVectors = matrices.map(matrix => matrixToQubitVector(matrix));
    paths = [...paths, vectorToPolarArray(...qubitVectors)];
    console.log("Updated paths:", paths);
  }

  function clear() {
    paths = [];
  }
  function M(input: string[][]) : Matrix<Complex> {
    return matrix(
      input.map(row => row.map(cell => complex(cell)))
    ) as Matrix<Complex>;
  }


  const i = complex(0, 1);
  let code = 
`clear(); //This clears all the qubits

const ket0 = M([
  ['1 + 0i'],
  ['0 + 0i']
]);

const H = multiply( // Hadamand Matrix
  M([
    ['1 + 0i', '1 + 0i'],
    ['1 + 0i', '-1 + 0i']
  ]),
  1 / sqrt(2)
);

const res1 = multiply(H, ket0);
const res2 = multiply(H, res1);

show(res1, res2); 

const Y = M([ // Pauli Y gate
  ['0 + 0i', '0 - 1i'],
  ['0 + 1i', '0 + 0i']
]);

const res3 = multiply(Y, ket0);
const res4 = multiply(Y, res3);

show(res3, res4);`

  let highlightedCode = '';
  let preElement: HTMLPreElement;
  let textareaElement: HTMLTextAreaElement;
  let logs: { message: string; class: string }[] = [];
  let logsContainer: HTMLDivElement;
  let editorContainer: HTMLDivElement;
  let isResizing = false;
  let startY: number;
  let initialEditorHeight: number;
  let initialLogsHeight: number;

  function updateHighlight() {
    highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
  }

  function log(status: string, message: string, className: string) {
    const currentdate = new Date().toLocaleString();
    const entry = {
      message: `[${currentdate} | ${status}] ${message}`,
      class: className
    };
    logs = [...logs, entry];
  }

  function runCode() {
    try {
      eval(code);
      log('Success', 'No errors', 'text-green-200');
    } catch (e: unknown) {
      if (e instanceof Error) {
        log('Error', e.message, 'text-red-200');
      } else {
        log('Error', `Unknown error! Don't give up 💪!`, 'text-red-200');
      }
    }
  }

  function syncScroll() {
    if (preElement && textareaElement) {
      preElement.scrollTop = textareaElement.scrollTop;
      preElement.scrollLeft = textareaElement.scrollLeft;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      runCode();
    }
  }

  function startResize(event: MouseEvent) {
    isResizing = true;
    startY = event.clientY;
    initialEditorHeight = editorContainer.offsetHeight;
    initialLogsHeight = logsContainer.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'row-resize'; // Change cursor
  }

  function resize(event: MouseEvent) {
    if (!isResizing) return;
    const deltaY = event.clientY - startY;
    editorContainer.style.height = `${initialEditorHeight + deltaY}px`;
    logsContainer.style.height = `${initialLogsHeight - deltaY}px`;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = 'default'; // Reset cursor
  }

  onMount(() => {
    updateHighlight();
    syncScroll();
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="flex flex-col h-screen border-r-2">
  <div bind:this={editorContainer} class="relative flex-1 p-4 bg-zinc-900 rounded-t-lg border-b-3 border-zinc-800">
    <pre
      bind:this={preElement}
      class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed text-white whitespace-pre-wrap overflow-auto rounded-t-lg"
      aria-hidden="true"
    >{@html highlightedCode}</pre>

    <textarea
      bind:this={textareaElement}
      bind:value={code}
      oninput={updateHighlight}
      onscroll={syncScroll}
      spellcheck={false}
      class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed bg-transparent text-transparent caret-white border-none outline-none resize-none whitespace-pre-wrap overflow-auto rounded-t-lg"
      aria-label="Code Editor"
    ></textarea>
    <div
      onmousedown={startResize}
      class="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-transparent"
    ></div>
  </div>

  <div bind:this={logsContainer} class="p-4 bg-zinc-900 text-base text-white font-mono overflow-auto h-40 resize-y rounded-b-gl">
    Log:
    {#each logs as log}
      <div class={`flex gap-4 items-baseline ${log.class} border-b border-zinc-800 pb-2 last:border-b-0`}>
        {log.message}
      </div>
    {/each}
  </div>
</div>

