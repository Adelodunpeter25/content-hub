import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/pwa'
import { setupAutoSync } from './utils/syncManager'
import { initDB } from './utils/db'

// Initialize IndexedDB
initDB().catch(console.error);

// Register service worker for PWA
if (import.meta.env.PROD) {
  registerServiceWorker();
}

// Setup automatic background sync
setupAutoSync();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
