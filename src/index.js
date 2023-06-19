import React from 'react';
import App from './App';
import { HashRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <HashRouter>
        <AuthProvider>
            <App></App>
        </AuthProvider>
    </HashRouter>
);
