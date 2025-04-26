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
function calculateParityBits(dataLength) {
  let p = 0;
  while (Math.pow(2, p) < dataLength + p + 1) {
    p++;
  }
  return p;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

function hammingEncode(input) {
  const data = input.split('').map(Number);
  const dataLength = data.length;
  
  if (dataLength < 4) {
    throw new Error("Input must be at least 4 bits");
  }
  
  const parityCount = calculateParityBits(dataLength);
  const totalLength = dataLength + parityCount;
  
  const encoded = Array(totalLength).fill(0);
  let dataIndex = 0;
  
  const dataPositions = [];
  for (let i = 0; i < totalLength; i++) {
    if (!isPowerOfTwo(i + 1)) {
      dataPositions.push(i);
    }
  }
  
  for (let i = dataPositions.length - 1; i >= 0; i--) {
    encoded[dataPositions[i]] = data[dataPositions.length - 1 - i];
  }
  
  for (let p = 0; p < parityCount; p++) {
    const parityPos = Math.pow(2, p) - 1;
    let parity = 0;
    
    for (let i = 0; i < totalLength; i++) {
      if ((i + 1) & (1 << p)) {
        parity ^= encoded[i];
      }
    }
    
    encoded[parityPos] = parity;
  }
  
  return encoded.join('');
}

function hammingDecode(input) {
  const code = input.split('').map(Number);
  const n = code.length;
  const parityCount = Math.floor(Math.log2(n)) + 1;
  let errorPos = 0;
  
  for (let p = 0; p < parityCount; p++) {
    let syndromeBit = 0;
    
    for (let i = 0; i < n; i++) {
      if ((i + 1) & (1 << p)) {
        syndromeBit ^= code[i];
      }
    }
    
    if (syndromeBit) {
      errorPos += Math.pow(2, p);
    }
  }
  
  if (errorPos > 0 && errorPos <= n) {
    code[errorPos - 1] ^= 1;
  }
  
  const dataPositions = [];
  for (let i = 0; i < n; i++) {
    if (!isPowerOfTwo(i + 1)) {
      dataPositions.push(i);
    }
  }
  
  const originalData = [];
  for (let i = dataPositions.length - 1; i >= 0; i--) {
    originalData.push(code[dataPositions[i]]);
  }
  
  if (errorPos === 0) {
    return `Decoded output: ${originalData.join('')} (No errors detected)`;
  } else {
    return `Decoded output: ${originalData.join('')} (Error detected at position ${errorPos} and corrected)`;
  }
}

function hammingAction() {
  const option = document.getElementById('hammingOption').value;
  const input = document.getElementById('hammingInput').value;
  const resultEl = document.getElementById('hammingResult');

  if (!input || !/^[01]+$/.test(input)) {
    resultEl.textContent = 'Please enter valid binary data (0s and 1s only)';
    return;
  }

  try {
    if (option === 'encode' && input.length < 4) {
      resultEl.textContent = 'Input must be at least 4 bits for Hamming encoding';
      return;
    }
    
    if (option === 'encode') {
      const encoded = hammingEncode(input);
      const dataLength = input.length;
      const parityCount = calculateParityBits(dataLength);
      const totalLength = dataLength + parityCount;
      
      resultEl.innerHTML = `
        <div class="explanation">
          Added ${parityCount} parity bits<br>
          Encoded length: ${totalLength} bits
        </div>
        <div class="result">Encoded Hamming code: <strong>${encoded}</strong></div>
      `;
    } else {
      const decoded = hammingDecode(input);
      resultEl.innerHTML = `<div class="result">${decoded}</div>`;
    }
  } catch (e) {
    resultEl.textContent = `Error: ${e.message}`;
  }
}

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
    let log = 'CRC Error Check Process:\n';
    log += '------------------------\n';
    log += received + '\n';
    log += divisor + '\n';
    
    for (let i = divisor.length; i <= received.length; i++) {
      log += '----\n';
      const currentDiv = workingBits[0] === '1' ? divisor : '0'.repeat(divisor.length);
      const xor = xorStrings(workingBits, currentDiv);
      workingBits = xor.slice(1) + (received[i] || '');
      log += ' '.repeat(i - divisor.length + 1) + workingBits + '\n';
      log += ' '.repeat(i - divisor.length + 1) + currentDiv + '\n';
    }
    
    const remainder = workingBits;
    log += '----\n';
    log += ' '.repeat(received.length - divisor.length + 1) + remainder + '\n\n';
    
    const hasError = /1/.test(remainder);
    if (hasError) {
      log += '❌ Error detected! Remainder: ' + remainder;
    } else {
      log += '✅ No error detected. Remainder: ' + remainder;
    }
    
    return log;
  }
  
  // Handle the selected CRC operation
  function handleCRC() {
    const mode = document.getElementById('crcMode').value;
    const data = document.getElementById('crcData').value.trim();
    const divisor = document.getElementById('crcDivisor').value.trim();
    const resultEl = document.getElementById('crcResult');
  
    if (!/^[01]+$/.test(data)) {
      resultEl.innerHTML = '<div class="error">Invalid input: Data must be binary.</div>';
      return;
    }
    
    if (!/^[01]+$/.test(divisor)) {
      resultEl.innerHTML = '<div class="error">Invalid input: Divisor must be binary.</div>';
      return;
    }
    
    if (divisor.length >= data.length && mode === 'generate') {
      resultEl.innerHTML = '<div class="error">Divisor must be shorter than the data.</div>';
      return;
    }
    
    if (mode === 'generate') {
      const { log } = computeCRC(data, divisor);
      resultEl.innerHTML = `<div class="crc-generate">${log.replace(/\n/g, '<br>')}</div>`;
    } else if (mode === 'check') {
      resultEl.innerHTML = checkCRC(data, divisor);
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

// ======================= Checksum =======================

function hexToBinary(hex) {
  // Convert hex string to binary string (padded to 8 bits)
  const decimal = parseInt(hex, 16);
  if (isNaN(decimal)) throw new Error(`Invalid hex value: ${hex}`);
  return decimal.toString(2).padStart(8, '0');
}

function generateChecksum() {
  const input = document.getElementById('checksumInput').value.trim().toUpperCase();
  const hexBytes = input.split(' ').filter(byte => byte.length > 0);
  const resultEl = document.getElementById('checksumResult');

  try {
    // Validate input
    if (!hexBytes.every(byte => /^[0-9A-F]{1,2}$/.test(byte))) {
      throw new Error('Each byte must be 1-2 hex digits (0-9, A-F)');
    }

    // Calculate sum
    let sum = 0;
    let calculationSteps = "Calculation Steps:\n";
    calculationSteps += "--------------------\n";
    
    for (const hexByte of hexBytes) {
      const decimalValue = parseInt(hexByte, 16);
      const binaryValue = hexToBinary(hexByte);
      calculationSteps += `${hexByte} → ${binaryValue} (${decimalValue})\n`;
      sum += decimalValue;
    }

    calculationSteps += "--------------------\n";
    calculationSteps += `Total sum: ${sum} (0x${sum.toString(16).toUpperCase()})\n`;

    const checksum = (256 - (sum % 256)) % 256;
    const checksumHex = checksum.toString(16).padStart(2, '0').toUpperCase();
    const checksumBinary = checksum.toString(2).padStart(8, '0');
    
    resultEl.innerHTML = `
      ${calculationSteps.replace(/\n/g, '<br>')}
      <div class="highlight">Checksum: 0x${checksumHex} (${checksumBinary})</div>
      <div class="highlight">Final Codeword: ${hexBytes.join(' ')} ${checksumHex}</div>
    `;
  } catch (e) {
    resultEl.innerHTML = `<span class="error">❌ Error: ${e.message}</span>`;
  }
}

function verifyChecksum() {
  const input = document.getElementById('checksumInput').value.trim().toUpperCase();
  const hexBytes = input.split(' ').filter(byte => byte.length > 0);
  const resultEl = document.getElementById('checksumResult');

  try {
    // Validate input
    if (hexBytes.length < 2 || !hexBytes.every(byte => /^[0-9A-F]{1,2}$/.test(byte))) {
      throw new Error('Enter at least 2 hex bytes including the checksum');
    }

    // Separate data and checksum
    const dataBytes = hexBytes.slice(0, -1);
    const givenChecksumHex = hexBytes[hexBytes.length - 1];
    
    // Calculate sum of data bytes
    let sum = 0;
    let calculationSteps = "Verification Steps:\n";
    calculationSteps += "--------------------\n";
    
    for (const hexByte of dataBytes) {
      const decimalValue = parseInt(hexByte, 16);
      const binaryValue = hexToBinary(hexByte);
      calculationSteps += `${hexByte} → ${binaryValue} (${decimalValue})\n`;
      sum += decimalValue;
    }

    // Add the checksum
    const checksumValue = parseInt(givenChecksumHex, 16);
    sum += checksumValue;
    
    calculationSteps += "--------------------\n";
    calculationSteps += `Checksum: ${givenChecksumHex} (${checksumValue})\n`;
    calculationSteps += `Total sum: ${sum} (0x${sum.toString(16).toUpperCase()})\n`;

    const remainder = sum % 256;
    
    if (remainder === 0) {
      resultEl.innerHTML = `
        ${calculationSteps.replace(/\n/g, '<br>')}
        <div class="success">✅ Checksum is valid! (Sum is divisible by 256)</div>
      `;
    } else {
      const correctChecksum = (256 - (sum - checksumValue) % 256) % 256;
      const correctChecksumHex = correctChecksum.toString(16).padStart(2, '0').toUpperCase();
      
      resultEl.innerHTML = `
        ${calculationSteps.replace(/\n/g, '<br>')}
        <div class="error">❌ Error detected! Remainder: ${remainder}</div>
        <div class="highlight">Expected checksum: 0x${correctChecksumHex}</div>
      `;
    }
  } catch (e) {
    resultEl.innerHTML = `<span class="error">❌ Error: ${e.message}</span>`;
  }
}

// ======================= Two-Dimensional Parity =======================

// Generate 2D Parity and format output as table
function generate2DParity() {
  const input = document.getElementById('twodInput').value.trim();
  const rows = input.split('\n').map(row => row.trim());

  if (!rows.every(r => /^[01]+$/.test(r))) {
    document.getElementById('twodResult').innerHTML = '<p class="error">Invalid input. Each row must be binary.</p>';
    return;
  }

  let resultHTML = '<div class="grid">';
  const data = [];
  
  rows.forEach(row => {
    const ones = [...row].filter(b => b === '1').length;
    const parityBit = (ones % 2 === 0) ? '0' : '1';
    const newRow = row + parityBit;
    data.push(newRow);
  });

  // Column parity
  const colParity = [];
  for (let i = 0; i < data[0].length; i++) {
    let ones = 0;
    for (let j = 0; j < data.length; j++) {
      if (data[j][i] === '1') ones++;
    }
    colParity.push((ones % 2 === 0) ? '0' : '1');
  }
  data.push(colParity.join(''));

  // Build output
  data.forEach((row, rowIndex) => {
    resultHTML += '<div class="row">';
    [...row].forEach((bit, colIndex) => {
      const isParity = (rowIndex === data.length - 1 || colIndex === data[0].length - 1);
      resultHTML += `<div class="cell ${isParity ? 'parity' : ''}">${bit}</div>`;
    });
    resultHTML += '</div>';
  });

  resultHTML += '</div>';
  document.getElementById('twodResult').innerHTML = resultHTML;
}

function verify2DParity() {
  const input = document.getElementById('twodInput').value.trim();
  const lines = input.split('\n').map(row => row.trim());

  if (!lines.every(r => /^[01]+$/.test(r))) {
    document.getElementById('twodResult').innerHTML = '<p class="error">Invalid input. Each row must be binary.</p>';
    return;
  }

  const data = lines.map(r => [...r]);
  const rows = data.length;
  const cols = data[0].length;

  let rowErrors = [];
  let colErrors = [];

  // Check row parity
  for (let i = 0; i < rows; i++) {
    const ones = data[i].filter(b => b === '1').length;
    if (ones % 2 !== 0) rowErrors.push(i);
  }

  // Check column parity
  for (let j = 0; j < cols; j++) {
    let ones = 0;
    for (let i = 0; i < rows; i++) {
      if (data[i][j] === '1') ones++;
    }
    if (ones % 2 !== 0) colErrors.push(j);
  }

  let resultHTML = '<div class="grid">';

  for (let i = 0; i < rows; i++) {
    resultHTML += `<div class="row">`;
    for (let j = 0; j < cols; j++) {
      let extraClass = "";
      if (rowErrors.includes(i)) extraClass += " row-error";
      if (colErrors.includes(j)) extraClass += " col-error";
      resultHTML += `<div class="cell${extraClass}">${data[i][j]}</div>`;
    }
    resultHTML += '</div>';
  }
  resultHTML += '</div>';

  if (rowErrors.length === 1 && colErrors.length === 1) {
    const r = rowErrors[0];
    const c = colErrors[0];
    data[r][c] = data[r][c] === '1' ? '0' : '1'; // Correct it!

    resultHTML += `<p class="correct">✅ Corrected error at Row ${r+1}, Column ${c+1}!</p>`;

    resultHTML += '<h3>Corrected Grid:</h3><div class="grid">';
    for (let i = 0; i < rows; i++) {
      resultHTML += `<div class="row">`;
      for (let j = 0; j < cols; j++) {
        const isCorrected = (i === r && j === c);
        resultHTML += `<div class="cell ${isCorrected ? 'corrected' : ''}">${data[i][j]}</div>`;
      }
      resultHTML += '</div>';
    }
    resultHTML += '</div>';

  } else if (rowErrors.length > 0 || colErrors.length > 0) {
    resultHTML += `<p class="error">❌ Cannot correct! Errors detected in:</p>`;
    if (rowErrors.length > 0) resultHTML += `<p class="error">Rows: ${rowErrors.map(r => r+1).join(', ')}</p>`;
    if (colErrors.length > 0) resultHTML += `<p class="error">Columns: ${colErrors.map(c => c+1).join(', ')}</p>`;
  } else {
    resultHTML += `<p class="success">✅ No errors detected!</p>`;
  }

  document.getElementById('twodResult').innerHTML = resultHTML;
}


