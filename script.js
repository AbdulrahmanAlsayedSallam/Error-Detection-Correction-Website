// script.js

// Function to show the relevant section based on the button click
function showSection(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

// ======================= Parity Check =======================
function checkParity() {
  const input = document.getElementById('parityInput').value;
  const parityType = document.getElementById('parityType').value;

  // Validate input (binary digits only)
  if (!/^[01]+$/.test(input)) {
    document.getElementById('parityResult').textContent = 'Invalid input. Please enter binary data only.';
    return;
  }

  const bitCount = [...input].reduce((sum, bit) => sum + parseInt(bit), 0);  // Sum of 1s in input

  // Check parity
  const isEven = bitCount % 2 === 0;
  let result = '';

  if (parityType === 'even') {
    result = isEven ? 'Even parity (No Errors Detected)' : 'Odd parity (Error Detected)';
  } else {
    result = isEven ? 'Even parity (Error Detected)' : 'Odd parity (No Errors Detected)';
  }

  document.getElementById('parityResult').textContent = `Sum of 1s: ${bitCount} → ${result}`;
}

// ======================= Hamming Code =======================
function hammingEncode(input) {
  if (!/^[01]{4}$/.test(input)) {
    return 'Please enter exactly 4 binary digits (e.g., 1011)';
  }

  const d = input.split('').map(Number);
  const hamming = Array(7).fill(0); // Initialize a 7-bit array with 0s

  // Assign data bits to the correct positions (3, 5, 6, 7)
  hamming[2] = d[0]; // d1 → pos 3
  hamming[4] = d[1]; // d2 → pos 5
  hamming[5] = d[2]; // d3 → pos 6
  hamming[6] = d[3]; // d4 → pos 7

  // Calculate parity bits
  // p1 checks bits 3, 5, 7 (positions 1, 3, 5, 7) -> hamming[2], hamming[4], hamming[6]
  hamming[0] = hamming[2] ^ hamming[4] ^ hamming[6]; // p1 → pos 1
  // p2 checks bits 3, 6, 7 (positions 2, 3, 6, 7) -> hamming[2], hamming[5], hamming[6]
  hamming[1] = hamming[2] ^ hamming[5] ^ hamming[6]; // p2 → pos 2
  // p3 checks bits 5, 6, 7 (positions 4, 5, 6, 7) -> hamming[4], hamming[5], hamming[6]
  hamming[3] = hamming[4] ^ hamming[5] ^ hamming[6]; // p3 → pos 4

  // Join the array to form the 7-bit encoded message
  return hamming.join('');
}



function hammingDecode(input) {
  if (!/^[01]{7}$/.test(input)) {
    return 'Please enter a 7-bit binary codeword (e.g., 0110011).';
  }

  const code = input.split('').map(Number);
  const n = code.length;
  let errorPos = 0;

  // Error detection
  for (let i = 0; Math.pow(2, i) <= n; i++) {
    const pos = Math.pow(2, i);
    let parity = 0;
    for (let k = 1; k <= n; k++) {
      if ((k & pos) !== 0) {
        parity ^= code[k - 1];
      }
    }
    if (parity !== 0) {
      errorPos += pos;
    }
  }

  // Correct the bit if there's an error
  if (errorPos !== 0 && errorPos <= 7) {
    code[errorPos - 1] ^= 1;
  }

  // Extract the original 4 data bits (d1, d2, d3, d4)
  const originalData = [code[2], code[4], code[5], code[6]].join('');
  const correctedCodeword = code.join('');

  if (errorPos === 0) {
    return `Decoded output: ${originalData} (No errors detected)`;
  } else if (errorPos <= 7) {
    return `Decoded output: ${originalData} (Error detected at position ${errorPos} and corrected)`;
  } else {
    return 'Error position out of bounds.';
  }
}

// Function to handle Hamming Code actions based on selected option
function hammingAction() {
  const option = document.getElementById('hammingOption').value;
  const input = document.getElementById('hammingInput').value;
  const resultEl = document.getElementById('hammingResult');

  if (option === 'encode') {
    const encoded = hammingEncode(input);
    resultEl.textContent = `Hamming encoded output: ${encoded}`;
  } else if (option === 'decode') {
    const output = hammingDecode(input); // <- Just get the string
    resultEl.textContent = output;       // <- Display it directly
  }
}


// Function to update the input placeholder based on the selected option
function updateHammingPlaceholder() {
  const option = document.getElementById('hammingOption').value;
  const inputField = document.getElementById('hammingInput');
  
  if (option === 'encode') {
    inputField.placeholder = 'Enter 4-bit binary data';
    if (!/^[01]{4}$/.test(input)) {
      resultEl.textContent = 'Please enter exactly 4 binary digits (e.g., 1011).';
      return;
  }
  } else if (option === 'decode') {
    inputField.placeholder = 'Enter 7-bit binary data';
    if (!/^[01]{7}$/.test(input)) {
      resultEl.textContent = 'Please enter exactly 7 binary digits (e.g., 0110011).';
      return;
  }
  }
}

// Add event listener to update the input placeholder dynamically
document.getElementById('hammingOption').addEventListener('change', updateHammingPlaceholder);

// Initialize placeholder when page loads
updateHammingPlaceholder();

// ======================= CRC (Cyclic Redundancy Check) =======================
// Utility function for XOR between binary strings
function xorStrings(a, b) {
return a.split('').map((bit, i) => bit ^ b[i]).join('');
}

// Core CRC generation logic
function computeCRC(data, divisor) {
const paddedData = data + '0'.repeat(divisor.length - 1);
let workingBits = paddedData.slice(0, divisor.length);
let log = '----------\n' + paddedData + '\n' + divisor + '\n';

for (let i = divisor.length; i <= paddedData.length; i++) {
  log += '----\n';
  const currentDiv = workingBits[0] === '1' ? divisor : '0'.repeat(divisor.length);
  const xor = xorStrings(workingBits, currentDiv);
  workingBits = xor.slice(1) + (paddedData[i] || '');
  log += ' '.repeat(i - divisor.length + 1) + workingBits + '\n';
  log += ' '.repeat(i - divisor.length + 1) + currentDiv + '\n';
}

const remainder = workingBits;
const codeword = data + remainder;
log += '----\n';
log += ' '.repeat(data.length) + remainder + '\n\n';
log += `Transmitted value is:\t${codeword}`;
return { log, codeword, remainder };
}

// Error-checking logic for received codeword
function checkCRC(received, divisor) {
let workingBits = received.slice(0, divisor.length);
for (let i = divisor.length; i <= received.length; i++) {
  const currentDiv = workingBits[0] === '1' ? divisor : '0'.repeat(divisor.length);
  const xor = xorStrings(workingBits, currentDiv);
  workingBits = xor.slice(1) + (received[i] || '');
}
const remainder = workingBits;
const hasError = /1/.test(remainder);
return hasError ? `Error detected! Remainder: ${remainder}` : `No error detected. Remainder: ${remainder}`;
}

// Handle the selected CRC operation
function handleCRC() {
const mode = document.getElementById('crcMode').value;
const data = document.getElementById('crcData').value.trim();
const divisor = document.getElementById('crcDivisor').value.trim();
const resultEl = document.getElementById('crcResult');

if (!/^[01]+$/.test(data)) {
  resultEl.textContent = 'Invalid input: Data must be binary.';
  return;
}

if (!/^[01]+$/.test(divisor)) {
  resultEl.textContent = 'Invalid input: Divisor must be binary.';
  return;
}

if (divisor.length >= data.length && mode === 'generate') {
  resultEl.textContent = 'Divisor must be shorter than the data.';
  return;
}

if (mode === 'generate') {
  const { log } = computeCRC(data, divisor);
  resultEl.textContent = log;
} else if (mode === 'check') {
  const message = checkCRC(data, divisor);
  resultEl.textContent = message;
}
}

// Update placeholder based on CRC mode
function updateCRCPlaceholder() {
const mode = document.getElementById('crcMode').value;
const inputField = document.getElementById('crcData');

inputField.placeholder = mode === 'generate'
  ? 'Enter original data (e.g., 10011000)'
  : 'Enter received codeword (e.g., 1001100001)';
}