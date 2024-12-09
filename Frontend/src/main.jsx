import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async'; // Corrected the import
import { StoreProvider } from './Store.jsx';

const root = createRoot(document.getElementById('root')); // Ensure the root element is properly selected

root.render(
  <StrictMode>
    <StoreProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
    </StoreProvider>
  
  </StrictMode>
);
