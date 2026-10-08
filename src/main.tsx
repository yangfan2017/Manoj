import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for Android PWA / APK offline install
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('ServiceWorker registration failed: ', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
