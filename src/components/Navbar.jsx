// src/components/Navbar.jsx
import React from 'react';
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm">
            <div className="container">
                <Link to="/" className="navbar-brand"> {/* <-- Points to Home screen */}
                    C64 Contacts
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                        <li className="nav-item">
                            <Link to="/contacts" className="nav-link"> {/* <-- Points to "/contacts" */}
                                <i className="fas fa-address-book"></i> All Contacts
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex"> {/* Add New contact link still goes to /addcontact */}
                        <Link to="/addcontact" className="btn btn-success">
                            <i className="fas fa-plus-circle"></i> Add New
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};