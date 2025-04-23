import { abs, arg } from 'mathjs';
import {
  Matrix,
  type  Complex 
} from 'mathjs';

// The Qubit in polar cordinates
export type QubitPolar = {
  theta: number;
  phi: number;
};

// A 2-component state vector [α, β], each entry can be Complex or number
export type QubitVector = [Complex | number, Complex | number];

export function matrixToQubitVector(matrix: Matrix<Complex>): QubitVector {
  if (!matrix) {
    throw new Error("Matrix is undefined or null");
  }
  const size = matrix.size();
  if (!Array.isArray(size) || size.length !== 2 || size[0] !== 2 || size[1] !== 1) {
    throw new Error(`Invalid matrix dimensions for qubit: expected [2,1], got [${size}]`);
  }

  try {
    const alpha = matrix.get([0, 0]);
    const beta = matrix.get([1, 0]);

    if (typeof alpha.re !== 'number' || typeof alpha.im !== 'number' ||
        typeof beta.re !== 'number' || typeof beta.im !== 'number') {
      throw new Error("Matrix elements are not valid Complex numbers");
    }

    return [alpha, beta];
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to extract QubitVector from matrix: ${err.message}`);
    } else {
      throw new Error("Failed to extract QubitVector from matrix");
    }
  }
}

export function vectorToPolarArray( ...qubits: QubitVector[]): QubitPolar[] {
  const path: QubitPolar[] = [];
  for (const qubit of qubits) {
    path.push(vectorToPolar(qubit));
  }
  return path;
}

export function vectorToPolar(qubit: QubitVector): QubitPolar {
  const [alpha, beta] = qubit
  // magnitudes
  const rAlpha: number = abs(alpha) as number;
  const rBeta: number = abs(beta) as number;
  // arguments (phases)
  const phiAlpha: number = arg(alpha) as number;
  const phiBeta: number = arg(beta) as number;
  // polar angle θ = 2 * arccos(|α|)
  const theta = 2 * Math.acos(rAlpha);
  // azimuthal angle φ = φ_β - φ_α, normalized to [0, 2π)
  let phi = phiBeta - phiAlpha;
  phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  return { theta, phi };
}

