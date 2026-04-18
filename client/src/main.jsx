import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { StudioProvider } from './context/StudioContext.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StudioProvider>
      <App />
    </StudioProvider>
  </React.StrictMode>
);
