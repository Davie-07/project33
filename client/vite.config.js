const path = require('path');
const react = require('@vitejs/plugin-react');

module.exports = {
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  }
};




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   root: path.resolve(__dirname, 'src'),
//   build: {
//     outDir: '../dist',
//     emptyOutDir: true,
//     rollupOptions: {
//       input: path.resolve(__dirname, 'src/index.html')
//     }
//   }
// })