<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import {
    matrix,
    complex,
    Matrix,
    create,
    all,
    type Complex,
  } from 'mathjs';
  import {
    matrixToQubitVector,
    vectorToPolarArray,
    assertUnitary,
 } from '$lib/blochUtils'; 
  import { paths } from '$lib/stores';
  import { tick } from 'svelte';
  import { tutorialScript } from '$lib/tutorial';

  let code = tutorialScript;

  function show(...matrices: Matrix<Complex>[]) {
    const qubitVectors = matrices.map(matrix => matrixToQubitVector(matrix));
    paths.update(current => [...current, vectorToPolarArray(...qubitVectors)]);
  }

  function clear() {
    paths.set([]);
  }

  function M(input: string[][]) : Matrix<Complex> {
    const mat = matrix(
      input.map(row => row.map(cell => complex(cell)))
    ) as Matrix<Complex>;
    return mat;
  }

  function log(status: string, message: string, className: string = 'text-gray-300') {
    const currentdate = new Date().toLocaleString();
    const entry = {
      message: `[${currentdate} | ${status}] ${message}`,
      class: className
    };
    logs = [entry, ...logs];
  }

  function createEvalContext() {
    const math = create(all, {});

    return {
      // Core math.js functions
      matrix: math.matrix,
      multiply: math.multiply,
      sqrt: math.sqrt,
      complex: math.complex,
      add: math.add,
      subtract: math.subtract,
      divide: math.divide,
      pow: math.pow,
      exp: math.exp,
      log: math.log,
      sin: math.sin,
      cos: math.cos,
      tan: math.tan,
      pi: math.pi,
      e: math.e,
      abs: math.abs,
      conj: math.conj,
      re: math.re,
      im: math.im,
      arg: math.arg,
      norm: math.norm,

      // Matrix-specific functions
      ctranspose: math.ctranspose,
      transpose: math.transpose,
      det: math.det,
      inv: math.inv,
      print: log,

      // Our custom functions
      show,
      clear,
      M,
      assertUnitary,

      // Constants
      i: math.complex(0, 1),
      π: math.pi,

      // Namespace fallback (just in case)
      math
    };
  }

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
  let containerHeight: number;

  function updateHighlight() {
    highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
  }

  async function runCode() {
    try {
      clear();
      await tick();
      const context = createEvalContext();
      const codeWithNewLine = `${code}\n`;
      const evalFunc = Function('context', `
        return (async function() {
          with(context) {
            ${codeWithNewLine}
          }
        })();
      `);
      await evalFunc(context);
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
    containerHeight = editorContainer.offsetHeight + logsContainer.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'row-resize';
    event.preventDefault();
  }

  function resize(event: MouseEvent) {
    if (!isResizing) return;
    const deltaY = event.clientY - startY;
    
    const minEditorHeight = 100;
    const minLogsHeight = 60;
    
    let newEditorHeight = initialEditorHeight + deltaY;
    let newLogsHeight = containerHeight - newEditorHeight;
    
    if (newEditorHeight < minEditorHeight) {
      newEditorHeight = minEditorHeight;
      newLogsHeight = containerHeight - newEditorHeight;
    } else if (newLogsHeight < minLogsHeight) {
      newLogsHeight = minLogsHeight;
      newEditorHeight = containerHeight - newLogsHeight;
    }
    
    editorContainer.style.height = `${newEditorHeight}px`;
    logsContainer.style.height = `${newLogsHeight}px`;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = 'default';
  }

  onMount(() => {
    updateHighlight();
    syncScroll();
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="flex flex-col h-screen">
  <div bind:this={editorContainer} class="relative flex-1 p-4 bg-zinc-900 rounded-t-lg border-b-3 border-zinc-800">
    <div class="absolute inset-0 overflow-hidden">
      <pre
        bind:this={preElement}
        class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed text-white whitespace-pre overflow-auto rounded-t-lg"
        aria-hidden="true"
      >{@html highlightedCode}</pre>

      <textarea
        bind:this={textareaElement}
        bind:value={code}
        oninput={updateHighlight}
        onscroll={syncScroll}
        spellcheck={false}
        class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed bg-transparent text-transparent caret-white border-none outline-none resize-none whitespace-pre overflow-auto rounded-t-lg"
        aria-label="Code Editor"
      ></textarea>
    </div>
  </div>

  <div 
    class="h-0.5 bg-zinc-800 hover:bg-blue-300 cursor-row-resize flex items-center transition-colors relative"
    onmousedown={startResize}
  >
  </div>

  <div bind:this={logsContainer} class="p-4 bg-zinc-900 text-base text-white font-mono overflow-auto h-40 rounded-b-lg">
    [BlochSphere]$
    {#each logs as log}
      <div class={`flex gap-4 items-baseline ${log.class} border-b border-zinc-800 pb-2 last:border-b-0`}>
        {log.message}
      </div>
    {/each}
  </div>
</div>
