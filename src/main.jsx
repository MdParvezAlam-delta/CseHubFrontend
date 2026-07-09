import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { NotesProvider } from './context/NotesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <NotesProvider>
        <App />
        </NotesProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);