import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { ReactFlowProvider } from 'reactflow';

// Suppress the ResizeObserver loop completed with undelivered notifications error
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
    return;
  }
  originalWarn.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
