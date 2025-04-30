import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './navbar.module.css';

const index = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    // Check session storage for username on component mount
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        setIsLoggedIn(!!username); // Set isLoggedIn to true if username exists
    }, []);

    const handleLogout = () => {
        // Clear session storage and update login state
        sessionStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/'); // Redirect to the home route
        window.location.reload(); // Reload the page to re-render the Login/Register component
    };

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles['navbar-title']}>
                    Collab Sphere
                </div>
                <div className={styles['navbar-links']}>
                    {isLoggedIn && (
                        <>
                            <a
                                className={styles['navbar-link']}
                                onClick={() => navigate('/')} // Redirect to home route
                            >
                                Home
                            </a>
                            <a
                                className={styles['navbar-link']}
                                onClick={() => navigate('/dashboard')} // Redirect to dashboard route
                            >
                                Dashboard
                            </a>
                            <a
                                className={styles['navbar-link']}
                                onClick={handleLogout} // Handle logout and reload the page
                            >
                                Logout
                            </a>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default index;