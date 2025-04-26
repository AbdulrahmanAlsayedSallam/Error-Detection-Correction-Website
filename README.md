# Error Detection & Correction Web Tool

A simple, interactive web-based tool to demonstrate three error detection and correction techniques in digital communication:

- ✅ **Parity Check**
- 🛰️ **Hamming Code**
- 🧮 **CRC (Cyclic Redundancy Check)**
- ➕ **Checksum**
- 🛠️ **Two-Dimensional Parity**

This tool is built using **HTML**, **CSS**, and **JavaScript** with a clean and modern UI.

---

## 🔧 Features

### ✅ Parity Check
- Supports **even** and **odd** parity modes.
- Detects single-bit errors based on the sum of 1s in the data.

### 🛰️ Hamming Code
- **Encode:** Enter 4-bit binary input to generate a 7-bit Hamming codeword.
- **Decode:** Input a 7-bit Hamming codeword to detect and correct single-bit errors.

### 🧮 CRC (Cyclic Redundancy Check)
- **Generate:** Enter data and a generator polynomial to view step-by-step CRC computation and the transmitted codeword.
- **Check:** Validate a received codeword and detect any errors based on the generator polynomial.

### ➕ Checksum
- **Generate:** Enter data and compute the checksum value.
- **Check:** Validate a received data packet by comparing the checksum value.

### 🛠️ Two-Dimensional Parity
- Applies **row** and **column** parity checks to detect errors in 2D data arrays.
- Detects errors in both horizontal and vertical directions.

---

## 🗂️ Project Structure

```
📁 project/
├── index.html         # Main HTML structure
├── styles.css         # Responsive and modern styling
└── script.js          # JavaScript logic for all operations
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbdulrahmanAlsayedSallam/Error-Detection-Correction-Website.git
cd Error-Detection-Correction-Website
```

### 2. Open in your browser

Simply open the `index.html` file with any modern browser.

---

## 💻 Interface Preview

- 🎨 Clean layout and UI
- 🧭 Navigation bar to switch between techniques
- 🧾 Real-time feedback with detailed CRC steps and Hamming corrections
- 🧼 Styled textboxes and dropdowns for ease of use

---

## 📚 Educational Use

This tool is ideal for:
- Learning error detection and correction
- Demonstrating concepts in a classroom
- Practicing binary-based algorithms
- Projects in computer networks or digital communication

---

## 📄 License

MIT License

You are free to use, modify, and distribute this project for educational or personal purposes.

---
