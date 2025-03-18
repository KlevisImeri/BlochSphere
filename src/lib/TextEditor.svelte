<script lang="ts">
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { 
    matrix, 
    multiply, 
    parse 
  } from 'mathjs'

  const i = parse('i').evaluate();
  let code = `/* Work in progress, dummy data! */
const M = matrix([
  [1 + 2 * i, 3 - i],
  [i, 4 + 2 * i]
]);

const v = matrix([
  [2 - 3 * i],
  [1 + 4 * i]
]);

const res = multiply(M, v);

show(res);`;

  let highlightedCode = '';
  let preElement: HTMLPreElement;
  let textareaElement: HTMLTextAreaElement;

  function updateHighlight() {
    highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;
  }

  function syncScroll() {
    if (preElement && textareaElement) {
      preElement.scrollTop = textareaElement.scrollTop;
      preElement.scrollLeft = textareaElement.scrollLeft;
    }
  }

  onMount(() => {
    updateHighlight();
    syncScroll();
  });
</script>

<div class="relative w-full h-full p-4">
  <pre 
    bind:this={preElement}
    class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed bg-zinc-900 text-white whitespace-pre-wrap overflow-auto rounded-lg"
    aria-hidden="true"
  >{@html highlightedCode}</pre>

  <textarea 
    bind:this={textareaElement}
    bind:value={code} 
    oninput={updateHighlight}
    onscroll={syncScroll}
    spellcheck={false}
    class="absolute inset-0 p-4 m-0 font-mono text-lg leading-relaxed bg-transparent text-transparent caret-white border-none outline-none resize-none whitespace-pre-wrap overflow-auto rounded-lg"
    aria-label="Code Editor"
  ></textarea>
</div>
