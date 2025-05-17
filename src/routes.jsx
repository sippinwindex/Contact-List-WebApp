// src/routes.jsx
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Link as RouterLink } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home"; 
import { Contact } from "./pages/Contact";
import { AddContact } from "./pages/AddContact";
import { EditContact } from "./pages/EditContact";


const RetroErrorElement = ({ message, details }) => (

    <div style={{
        fontFamily: "'Press Start 2P', cursive", color: '#FF3333', textAlign: 'center',
        marginTop: '15vh', padding: '20px', border: '3px dashed #FF3333',
        backgroundColor: 'rgba(50,0,0,0.2)', textShadow: '1px 1px #000'
    }}>
        <h1 style={{ color: '#FF3333', fontSize: '2.5rem' }}>SYSTEM HALTED!</h1>
        <p style={{ fontSize: '1.2rem', color: '#FF9999' }}>{message || "An unexpected error occurred."}</p>
        {details && <p style={{ fontSize: '0.9rem', color: '#FFCCCC', whiteSpace: 'pre-wrap' }}>{details}</p>}
        <p style={{marginTop: '30px'}}>
            <RouterLink to="/" style={{
                color: '#00FF41', textDecoration: 'none', padding: '10px 20px',
                border: '2px solid #00FF41', background: 'rgba(0,50,0,0.3)'
            }}>
                [REBOOT SYSTEM] {/* Changed from RETURN TO MAIN PROGRAM */}
            </RouterLink>
        </p>
    </div>
);


export const router = createBrowserRouter(
  createRoutesFromElements(
      <Route
        path="/"
        element={<Layout />}
        errorElement={<RetroErrorElement message="CRITICAL ERROR - PATH CORRUPTION!" details="The system could not locate the specified program path. Check disk and try again." />}
      >
          <Route index element={<Home />} /> {/* <-- Home is now the default for "/" */}
          <Route path="contacts" element={<Contact />} /> {/* <-- Contacts list is now at "/contacts" */}
          <Route path="addcontact" element={<AddContact />} />
          <Route path="edit-contact/:contactId" element={<EditContact />} />
          export const router = createBrowserRouter(
          createRoutesFromElements(
          <Route path="/" element={<Layout />} /* ... */>
              <Route index element={<Home />} /> {/* This should render your C64 Home.jsx */}
              <Route path="contacts" element={<Contact />} />
          </Route>
          <Route path="*" element={<RetroErrorElement message="404 - PROGRAM NOT FOUND" details="The file you requested does not exist on this system." />} />
      </Route>
  )
);