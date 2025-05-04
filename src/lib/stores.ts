// stores.ts
import { writable } from 'svelte/store';
import type { QubitPolar } from './blochUtils';

export const paths = writable<QubitPolar[][]>([]);
