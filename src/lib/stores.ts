// stores.ts
import { writable } from 'svelte/store';
import type { QubitPolar } from './blochUtils';

export const paths = writable<QubitPolar[][]>([]);


export let exampleCode =
`const ket0 = M([
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
const res4 = multiply(Y, res1);

// show(res3, res4); // Uncomment to show this


const custom = M([
  [sqrt(3/4) + ' + 0i'],       // √(3/4)|0
  ['0 + ' + sqrt(1/4) + 'i']   // i*√(1/4)|1〉 (pure imaginary)
]);

show(custom);`


