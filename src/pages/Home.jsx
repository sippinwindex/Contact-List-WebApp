// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

export const Home = () => {
    const navigate = useNavigate();
    const [showPrompt, setShowPrompt] = useState(false);
    const [typedCommand, setTypedCommand] = useState('');
    const startCommand = "LOAD \"CONTACTS-START\",8,1";

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 1500); 
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < startCommand.length) {
                setTypedCommand(prev => prev + startCommand[i]);
                i++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    navigate('/contacts');
                }, 700);
            }
        }, 100); 
    };

    return (
        <div className="home-container"> {/* Removed c64-monitor-effect here, it's not needed on the container if c64-screen handles the look */}
            <div className="c64-screen"> {/* This div gets all the monitor styling from Home.css */}
                <div className="c64-text-output">
                    <p>**** COMMODORE 64 BASIC V2 ****</p>
                    <p> 64K RAM SYSTEM 38911 BASIC BYTES FREE</p>
                    <br />
                    {showPrompt && (
                        <>
                            <p className="c64-prompt">
                                READY.
                                <span className="typed-command">{typedCommand}</span>
                                <span className="blinking-cursor">█</span>
                            </p>
                            {!typedCommand && ( 
                                <button 
                                    onClick={handleStart} 
                                    className="c64-start-button btn" 
                                >
                                    {startCommand}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};