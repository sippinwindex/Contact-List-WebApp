// src/pages/EditContact.jsx
// LOT OF BLOAT HERE but it works, its hard to comprenhend some logic maybe but it should be clean and concise//
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { updateContactAPI, fetchAllContactsAPI } from '../lib/fetch'; 

const MALE_AVATAR = "https://avatar.iran.liara.run/public/boy";
const FEMALE_AVATAR = "https://avatar.iran.liara.run/public/girl";
const OTHER_AVATAR_BASE = "https://avatar.iran.liara.run/public/";

export const EditContact = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { store, dispatch } = useGlobalReducer();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let contactToEdit = location.state?.contact;

        if (!contactToEdit) {
            contactToEdit = store.contacts.find(c => String(c.id) === contactId);
        }
        
        const initializeForm = (contact) => {
            setName(contact.name || '');
            setAddress(contact.address || '');
            setPhone(contact.phone || '');
            setEmail(contact.email || '');
            
            const imgUrl = contact.image_url || (OTHER_AVATAR_BASE + (contact.id % 100 || Math.floor(Math.random()*100)+1));
            setCurrentImageUrl(imgUrl);

            if (imgUrl === MALE_AVATAR) setGender('male');
            else if (imgUrl === FEMALE_AVATAR) setGender('female');
            else setGender('other'); // Default to 'other' if not male/female and now other specific
            
            setIsLoading(false);
        };

        if (contactToEdit) {
            initializeForm(contactToEdit);
        } else {
            console.warn("Contact not in state/store for edit, fetching all...");
            setIsLoading(true);
            fetchAllContactsAPI().then(allContacts => {
                const found = allContacts.find(c => String(c.id) === contactId);
                if (found) {
                    // Optional: dispatch to update store if it was stale, though reducer should handle this better
                    // dispatch({ type: 'fetchedContacts', payload: allContacts }); BUT SO FAR THIS WORKS OKAY?? WHY COMPLICATE LIFE
                    initializeForm(found);
                } else {
                    setError("Contact not found after fetching.");
                    setIsLoading(false);
                }
            }).catch(err => {
                setError("Failed to load contact details: " + err.message);
                setIsLoading(false);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId, location.state]); 

    const handleGenderChange = (e) => {
        const selectedGender = e.target.value;
        setGender(selectedGender);
        if (selectedGender === 'male') setCurrentImageUrl(MALE_AVATAR);
        else if (selectedGender === 'female') setCurrentImageUrl(FEMALE_AVATAR);
        else setCurrentImageUrl(OTHER_AVATAR_BASE + (parseInt(contactId || "0") % 100 || Math.floor(Math.random()*100)+1));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!name || !email || !phone || !address) {
            setError("Name, Email, Phone, and Address are required.");
            setIsSubmitting(false);
            return;
        }

        const updatedContactData = {
            name, email, phone, address,
            image_url: currentImageUrl,
        };

        try {
            const apiResponse = await updateContactAPI(contactId, updatedContactData);
            dispatch({ type: 'UPDATE_CONTACT_SUCCESS', payload: { ...apiResponse, id: parseInt(contactId), image_url: currentImageUrl } });
            navigate('/');
        } catch (err) {
            console.error("Failed to update contact:", err);
            setError(err.message || "Failed to submit update. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="container text-center mt-5"><h1>Loading Editor...</h1><div className="spinner-border"></div></div>;
    if (error && !name) return <div className="container mt-5"><div className="alert alert-danger">Error: {error} <Link to="/" className="btn btn-sm btn-primary ms-2">Back</Link></div></div>;
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <h1 className="text-center mb-4">Edit Contact</h1>
                    <form onSubmit={handleSubmit} noValidate className="card p-4">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <div className="mb-3">
                            <label htmlFor="contactNameInput" className="form-label">Full Name:</label>
                            <input type="text" className="form-control" id="contactNameInput" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contactEmailInput" className="form-label">Email:</label>
                            <input type="email" className="form-control" id="contactEmailInput" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                         <div className="mb-3">
                            <label htmlFor="contactPhoneInput" className="form-label">Phone:</label>
                            <input type="tel" className="form-control" id="contactPhoneInput" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contactAddressInput" className="form-label">Address:</label>
                            <textarea className="form-control" id="contactAddressInput" rows="3" value={address} onChange={e => setAddress(e.target.value)} required></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="form-label d-block mb-2">Avatar Selection (Local):</label>
                            <div className="gender-selector">
                                <div>
                                    <input type="radio" id="edit_male" name="gender_edit" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
                                    <label htmlFor="edit_male"><img src={MALE_AVATAR} alt="Male" /><span>Male</span></label>
                                </div>
                                <div>
                                    <input type="radio" id="edit_female" name="gender_edit" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
                                    <label htmlFor="edit_female"><img src={FEMALE_AVATAR} alt="Female" /><span>Female</span></label>
                                </div>
                                <div>
                                    <input type="radio" id="edit_other" name="gender_edit" value="other" checked={gender === 'other'} onChange={handleGenderChange} />
                                    <label htmlFor="edit_other"><img src={OTHER_AVATAR_BASE + '0'} alt="Other" /><span>Other</span></label>
                                </div>
                                <div className="ms-auto d-flex flex-column align-items-center">
                                    <label className="form-label mb-1" style={{fontSize: "0.6rem"}}>Preview:</label>
                                    <img src={currentImageUrl} alt="Avatar Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--retro-border)' }}/>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Link to="/" className="btn btn-outline-secondary"><i className="fas fa-times"></i> Cancel</Link>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? <><span className="spinner-border spinner-border-sm"></span> Saving...</> : <><i className="fas fa-save"></i> Update</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};