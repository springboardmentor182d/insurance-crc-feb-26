import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Performance Monitoring
 * To start measuring performance, pass a function (e.g., reportWebVitals(console.log))
 * or send to an analytics endpoint. 
 */
reportWebVitals();