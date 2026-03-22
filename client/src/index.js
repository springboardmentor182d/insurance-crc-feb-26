import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

<<<<<<< HEAD
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unexpected runtime error',
    };
  }

  componentDidCatch(error, info) {
    console.error('App runtime error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f3f4f6' }}>
          <div style={{ width: '100%', maxWidth: '760px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '12px', padding: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>UI Runtime Error</h1>
            <p style={{ color: '#4b5563', marginTop: '8px' }}>
              Admin page crashed while rendering. Please share this message so we can fix it quickly.
            </p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', color: '#111827' }}>
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the root element
=======
>>>>>>> origin/main-group-A
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
reportWebVitals();
