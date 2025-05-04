import { abs, arg, identity } from 'mathjs';
import {
  Matrix,
  multiply,
  ctranspose,
  deepEqual,
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

  const alpha = matrix.get([0, 0]);
  const beta = matrix.get([1, 0]);

  if (typeof alpha.re !== 'number' || typeof alpha.im !== 'number' ||
      typeof beta.re !== 'number' || typeof beta.im !== 'number') {
    throw new Error("Matrix elements are not valid Complex numbers");
  }

  const normSquared = alpha.re * alpha.re + alpha.im * alpha.im 
                    + beta.re * beta.re + beta.im * beta.im;
  const tolerance = 1e-10;
  if (Math.abs(normSquared - 1) > tolerance) {
    throw new Error(`Qubit vector is not normalized: norm squared is ${normSquared}`);
  }

  return [alpha, beta];
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


export function isUnitary(mat: Matrix<Complex>): boolean {
    const [rows, cols] = mat.size();
    if (rows !== cols) {
        throw new Error("Matrix must be square to be unitary.");
    }
    // Compute U†U
    const I = multiply(ctranspose(mat), mat);
    return deepEqual(I, identity(rows, cols)) ? true : false;
}

export function assertUnitary(mat: Matrix<Complex>): Matrix {
    if (!isUnitary(mat)) {
        throw new Error("Matrix is not unitary");
    }
    return mat;
}

