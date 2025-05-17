// src/components/ContactCard.jsx
import React from 'react';

export const ContactCard = ({ contact, onEdit, onDelete }) => {
    if (!contact) return null;

    const placeholderImage = "https://avatar.iran.liara.run/public/27"; // Placeholder

    return (
        <div className="card h-100 shadow-sm">
            <img
                src={contact.image_url || placeholderImage} 
                className="card-img-top"
                alt={contact.name}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{contact.name}</h5>
                {contact.address && <p className="card-text mb-1"><i className="fas fa-map-marker-alt me-2"></i>{contact.address}</p>}
                {contact.phone && <p className="card-text mb-1"><i className="fas fa-phone me-2"></i>{contact.phone}</p>}
                {contact.email && <p className="card-text mb-1"><i className="fas fa-envelope me-2"></i>{contact.email}</p>}

                <div className="mt-auto pt-2 d-flex justify-content-end"> {/* Buttons at the bottom right */}
                    <button onClick={onEdit} className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-pencil-alt"></i> Edit
                    </button>
                    <button onClick={onDelete} className="btn btn-outline-danger btn-sm">
                        <i className="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};