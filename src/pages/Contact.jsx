// src/pages/Contact.jsx
import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import { Link, useNavigate } from "react-router-dom";
import { ContactCard } from "../components/ContactCard";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchAllContactsAPI, deleteContactAPI, createAgendaIfNotExist } from '../lib/fetch'; 

export const Contact = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agendaExists, setAgendaExists] = useState(null); // null, true, or false

    const attemptCreateAgenda = async () => {
        setError(null);
        setLoading(true);
        try {
            await createAgendaIfNotExist();
            setAgendaExists(true);
            console.log("Agenda creation/verification successful. Now attempting to load contacts.");
            await loadContacts(true); // 
        } catch (err) {
            console.error("Failed to create agenda:", err);
            setError(`Failed to create agenda '${'jandryf'}': ${err.message}. Please try again or contact support if the issue persists.`);
            setAgendaExists(false);
            setLoading(false);
        }
    };

    // useCallback for loadContacts to prevent re-creation on every render unless dependencies change
    const loadContacts = useCallback(async (agendaJustCreated = false) => {
        setLoading(true);
        if (!agendaJustCreated) setError(null); // Clear previous errors unless it's a follow-up load

        try {
            const contactsFromApi = await fetchAllContactsAPI();
            dispatch({ type: 'fetchedContacts', payload: contactsFromApi });
            setAgendaExists(true); // If fetchAllContactsAPI succeeds, agenda exists
        } catch (err) {
            console.error("Error loading contacts:", err);
            const errMsg = err.message || "Failed to load contacts.";
            if (errMsg.toLowerCase().includes("doesn't exist") || errMsg.toLowerCase().includes("not found")) {
                setError(`Agenda '${'jandryf'}' not found or is empty. You can try creating it or adding the first contact.`);
                setAgendaExists(false); // Mark as not existing
            } else {
                setError(errMsg);
            }
            dispatch({ type: 'fetchedContacts', payload: [] });
        } finally {
            setLoading(false);
        }
    }, [dispatch]); 
    useEffect(() => {
        loadContacts();
    }, [loadContacts]); // useEffect dependency on loadContacts (which is memoized by useCallback)

    const handleEdit = (contactToEdit) => {
        navigate(`/edit-contact/${contactToEdit.id}`, { state: { contact: contactToEdit } });
    };

    const handleDelete = async (contactId) => {
        const confirmed = window.prompt(`TYPE "DELETE" TO CONFIRM DELETION OF CONTACT ID ${contactId}:`);
        if (confirmed && confirmed.toUpperCase() === "DELETE") {
            setError(null); // Clear previous errors
            try {
                await deleteContactAPI(contactId);
                dispatch({ type: 'DELETE_CONTACT_SUCCESS', payload: contactId });
            } catch (err) {
                console.error("Error deleting contact:", err);
                setError(err.message || "Failed to delete contact.");
            }
        } else if (confirmed !== null) {
            alert("DELETION CANCELLED. INPUT DID NOT MATCH 'DELETE'.");
        }
    };

    if (loading) {
        return <div className="container text-center mt-5"><h1>LOADING DATA... PLEASE WAIT.</h1><div className="spinner-border mt-3"></div></div>;
    }

    return (
        <div className="container mt-4 py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Contact Directory</h1>
                <Link to="/addcontact" className="btn btn-success">
                    <i className="fas fa-user-plus"></i> Add New Contact
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger my-3">
                    <p><strong>SYSTEM ERROR:</strong> {error}</p>
                    {agendaExists === false && (
                        <button onClick={attemptCreateAgenda} className="btn btn-sm btn-warning mt-2">
                            <i className="fas fa-database"></i> Try to Create/Verify Agenda
                        </button>
                    )}
                     <button onClick={() => loadContacts()} className="btn btn-sm btn-info mt-2 ms-2">
                        <i className="fas fa-sync-alt"></i> Retry Load Contacts
                    </button>
                </div>
            )}

            {!loading && !error && store.contacts.length === 0 && agendaExists === true && (
                <div className="text-center alert alert-info p-5 mt-4">
                    <h2>NO CONTACTS FOUND.</h2>
                    <p>YOUR AGENDA IS EMPTY. TRY ADDING A NEW CONTACT.</p>
                </div>
            )}
            
            {!loading && !error && agendaExists === null && store.contacts.length === 0 && (
                 <div className="text-center alert alert-warning p-5 mt-4">
                    <h2>INITIALIZING...</h2>
                    <p>Checking agenda status.</p>
                </div>
            )}


            {store.contacts.length > 0 && (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {store.contacts.map(contact => (
                        <div key={contact.id} className="col">
                            <ContactCard
                                contact={contact}
                                onEdit={() => handleEdit(contact)}
                                onDelete={() => handleDelete(contact.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};