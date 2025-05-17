// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; 
import { StoreProvider } from './hooks/useGlobalReducer'; 

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement._reactRootContainer) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </React.StrictMode>
  );
} else {

   console.warn("React root already exists. HMR might re-render.");
}

