import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import styles from './login.module.css';

const index = ({ toggleView }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!username || !password) {
            setError('All fields are required');
            return;
        }

        try {
            // Send POST request to the login route
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            });

            // Handle successful login
            sessionStorage.setItem('username', response.data.user.username); // Store username in session storage
            setError('');
            navigate('/dashboard'); // Redirect to the dashboard route
        } catch (err) {
            // Handle errors
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className={styles.loginBox}>
            <form onSubmit={handleSubmit}>
                <h2 className={styles.title}>Login</h2>
                <div className={styles.field}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitButton}>
                    LOGIN
                </button>
                <a
                    href="#"
                    className={styles.registerLink}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleView(); // Call the toggleView function to switch to Register
                    }}
                >
                    Click here to Register
                </a>
            </form>
        </div>
    );
};

export default index;