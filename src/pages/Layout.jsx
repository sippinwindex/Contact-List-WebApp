// src/pages/Layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom'; 
import { Navbar } from '../components/Navbar';

export const Layout = () => {
    const handleGitHubClick = () => {
        window.open("https://github.com/sippinwindex", "_blank", "noopener,noreferrer");
    };

    return (
        <div className="d-flex flex-column min-vh-100"> {/* Ensures footer sticks to bottom */}
            <Navbar />
            <main className="container-fluid flex-grow-1"> {/* flex-grow-1 makes main take available space */}
                <Outlet /> {/* Routed components will render here */}
            </main>
            <footer className="retro-footer">
                <div className="footer-content">
                    <span>
                        Made with <i className="fas fa-heart retro-heart"></i> by SippinWindex
                    </span>
                    <span className="github-link-container">
                        <a 
                            href="https://github.com/sippinwindex" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="SippinWindex GitHub Profile"
                            className="github-icon-link"
                            onClick={(e) => { 
                                e.preventDefault(); 
                                handleGitHubClick(); 
                            }}
                        >
                            <i className="fab fa-github"></i>
                        </a>
                    </span>
                </div>
{/* ... other footer content ... */}
                <div className="footer-c64-line">
                    **** COMMODORE 64 BASIC V2 **** <br />
                    64K RAM SYSTEM 38911 BASIC BYTES FREE <br />
                    READY.
                </div>
            </footer>
        </div>
    );
};