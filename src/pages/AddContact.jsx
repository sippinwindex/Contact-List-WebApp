// src/pages/AddContact.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { addContactAPI } from '../lib/fetch'; 

const MALE_AVATAR = "https://avatar.iran.liara.run/public/boy";
const FEMALE_AVATAR = "https://avatar.iran.liara.run/public/girl";
const OTHER_AVATAR_BASE = "https://avatar.iran.liara.run/public/"; // Will append random number

export const AddContact = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState(''); // 'male', 'female', 'other', or ''
    // Initialize with a random "other" avatar
    const [currentImageUrl, setCurrentImageUrl] = useState(OTHER_AVATAR_BASE + Math.floor(Math.random() * 100 + 1));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleGenderChange = (e) => {
        const selectedGender = e.target.value;
        setGender(selectedGender);
        if (selectedGender === 'male') {
            setCurrentImageUrl(MALE_AVATAR);
        } else if (selectedGender === 'female') {
            setCurrentImageUrl(FEMALE_AVATAR);
        } else {
            setCurrentImageUrl(OTHER_AVATAR_BASE + Math.floor(Math.random() * 100 + 1));
        }
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

        const newContactData = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            // The API doesn't store gender but we need to load the image you know?
            image_url: currentImageUrl, 
        };

        try {
            const createdContactFromAPI = await addContactAPI(newContactData);
            // The createdContactFromAPI should have an ID from the server.
            // We also ensure it has the image_url we decided on so its good.
            dispatch({ type: 'ADD_CONTACT_SUCCESS', payload: { ...createdContactFromAPI, image_url: currentImageUrl } });
            navigate('/');
        } catch (err) {
            console.error("Failed to create contact:", err);
            setError(err.message || "Failed to submit. Check console for API error details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7">
                    <h1 className="text-center mb-4">Add New Contact</h1>
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
                                    <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
                                    <label htmlFor="male"><img src={MALE_AVATAR} alt="Male" /><span>Male</span></label>
                                </div>
                                <div>
                                    <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
                                    <label htmlFor="female"><img src={FEMALE_AVATAR} alt="Female" /><span>Female</span></label>
                                </div>
                                <div>
                                    <input type="radio" id="other" name="gender" value="other" checked={gender === 'other'} onChange={handleGenderChange} />
                                    <label htmlFor="other"><img src={OTHER_AVATAR_BASE + '0'} alt="Other" /><span>Other</span></label> 
                                    {/* Using .../public/0 or similar as a representative "other" icon, actual displayed icon updates on change */}
                                </div>
                                <div className="ms-auto d-flex flex-column align-items-center">
                                    <label className="form-label mb-1" style={{fontSize: "0.6rem"}}>Preview:</label>
                                    <img src={currentImageUrl} alt="Avatar Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--retro-border)' }}/>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Link to="/" className="btn btn-outline-secondary"><i className="fas fa-arrow-left"></i> Back</Link>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? <><span className="spinner-border spinner-border-sm"></span> Saving...</> : <><i className="fas fa-save"></i> Save</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};