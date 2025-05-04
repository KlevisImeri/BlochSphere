export const tutorialScript =
`// ═══════════════════════════════════════════════ //
//  ⚛️ TUTORIAL: QUANTUM STATES VISUALIZED ON      //
//                 BLOCH SPHERE                    //
// ═══════════════════════════════════════════════ //

// 🔍 Pro tips: 
//  - Uncomment show() to render states
//  - You can comment show() if want states not to 
//    be rendered anymore
//  - For better experience we suggest chromium browser.
//  - Have fun 🙂!
// 🚀 Press [Ctrl+Enter] to run the magic!
const ket0 = M([ // |0⟩  θ=0 ϕ=0
  ['1'],
  ['0']
]);
// show(ket0);

const ket1 = M([ // |1⟩  θ=π ϕ=0
  ['0'],
  ['1']
]);
// show(ket1)

const custom = M([
  [sqrt(3/4) + ' + 0i'],       // √(3/4)|0〉
  ['0 + ' + sqrt(1/4) + 'i']   // i*√(1/4)|1〉
]);
// show(custom)

const X = M([ // Pauli X Gate
  ['0', '1'],
  ['1', '0']
]);
assertUnitary(X) // A check if the user needs it

const P = (θ) => { //Phase gate P(θ)
  return M([
    ['1', '0'],
    ['0', ''+exp(multiply(i, θ))]
  ])
}

const Z = P(π); assertUnitary(Z)
const S = P(π/2); assertUnitary(S)
const T = P(π/4); assertUnitary(T)

const Y = multiply(i, multiply(X,Z)); // Pauli Y Gate = iXZ
assertUnitary(Y)
// print('Info', 'Y='+Y); // You can also print the matrices

const H = multiply(M([ // Hadamard Matrix
    ['1', '1'],
    ['1', '-1']
  ]),
  1 / sqrt(2)
);
assertUnitary(H)

// Now lets calculate some qubits simple:
const ketp = multiply(H, ket0); // |+⟩  θ=π/2 ϕ=0
const ketm = multiply(H, ket1); // |-⟩  θ=π/2 ϕ=π
// show(ketp, ketm);
const ketpi = multiply(S, ketp); // |+i⟩  θ=π/2 ϕ=π/2
const ketmi = multiply(S, ketm); // |-i⟩  θ=π/2 ϕ=3π/2=-π/2
// show(ketpi, ketmi);

//Now lets rotate the |+⟩ in the XY plane by -π/4 and |-⟩ by π/4
const t1 = multiply(ctranspose(T), ketp); // θ=π/2 ϕ=-π/4
const t2 = multiply(T, ketm); // θ=π/2 ϕ=π/2+π/4=3π/4
// show(t1, t2);
// ⟹ you can see how the local phaze rotates in the XY plane

//Lets try the global phaze
const pi3 = polarToQubit(π/3, π/3); // You can find this function below
const v2 = multiply(exp(multiply(i, π/3)), pi3);
// show(pi3)
// show(v2)
// You can see that the colors overlap each other as they should


// Now lets see the effects of XYZ pauli gates
// Lets take a custom vector
// show(pi3);
// show(multiply(X, pi3)) // Axes is the |+⟩
// show(multiply(Y, pi3)) // Axes is the |+i⟩
// show(multiply(Z, pi3)) // Axes is the |0⟩

// ═══════════════════════════════════════════════ //
//  ⏰ FETCHING TIME FROM API & DISPLAYING CLOCK   //
//               🎯 ON BLOCH SPHERE                //
// ═══════════════════════════════════════════════ //
//∣ψ⟩=cos(θ/2)∣0⟩+sin(θ/2)e^{iϕ}∣1⟩ the typical Bloach sphere equation
function polarToQubit(theta, phi) {
  const alphaReal = cos(theta / 2);
  const betaReal = sin(theta / 2) * math.cos(phi);
  const betaImag = sin(theta / 2) * math.sin(phi);
  const alpha = complex(alphaReal, 0);
  const beta = complex(betaReal, betaImag);
  return M([
    [alpha],
    [beta]
  ]);
}
async function fetchCurrentTime() {
  const timeZone = 'Europe/Budapest';
  const response = await fetch(
    \`https://timeapi.io/api/time/current/zone?timeZone=\${encodeURIComponent(timeZone)}\`
  );
  if (!response.ok) throw new Error('API request failed');
  const data = await response.json();

  const hours = data.hour % 12;
  const minutes = data.minute;

  print('Time fetched', \`\${hours}:\${minutes}\`, 'text-green-200');

  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;

  const hourRadians = (hourAngle * Math.PI) / 180;
  const minuteRadians = (minuteAngle * Math.PI) / 180;

  const hourHand = polarToQubit(hourRadians, 0);
  const minuteHand = polarToQubit(minuteRadians, 0);

  show(hourHand, minuteHand);

  print('Success', 'Clock vectors created', 'text-green-200');
}
// await fetchCurrentTime(); //Uncoment to show the time on the sphere
// NOTE: You may have to wait a bit depending on how busy the API is.
// Also the func is async because of the API.

// ═══════════════════════════════════════════════ //
//            ❌ EDGE CASES AND ERRORS             //
// ═══════════════════════════════════════════════ //
// 🚨 Non-Unitary Matrices (Gates)
const G1 = M([  // Not square (rectangular)
  ['1', '0', '1'],
  ['0', '1', '0']
]);
const G2 = M([  // Square but non-unitary
  ['2', '0'],  // Determinant ≠ 1
  ['0', '0.5']
]);
const G3 = M([  // Doesn't preserve norm
  ['0.5', '0.5'],
  ['0.5', '0.5']
]);
// 🚫 These should all fail assertUnitary()
// assertUnitary(G1)
// assertUnitary(G2)
// assertUnitary(G3)


// 💥 Non-Unit Vectors (States)
const unnormalizedState = M([  // Norm ≠ 1
  ['2'],  // √(2² + 3²) = √13 ≠ 1
  ['3']
]);
const zeroState = M([  // Zero vector
  ['0'],
  ['0']
]);
const nonVectorMatrix = M([  // Not a state vector
  ['1', '0'],
  ['0', '1']
]);
// 🚫 These should fail state validation
// show(unnormalizedState)
// show(zeroState) 
// show(nonVectorMatrix)

// ⚠️ API Edge Cases
// await fetch('https://non-existent-time-api.example.com')

// 🛡️ Type Safety Checks
// const invalidMatrix2 = M([['1+2j'], ['not a number']]); // Malformed complex number`
