import React, { useState } from 'react';
import axios from 'axios';
import styles from './register.module.css';

const index = ({ toggleView }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!email || !username || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                email,
                username,
                password,
                confirmPassword,
            });
            alert(response.data.message);
            toggleView(); // Switch to Login after successful registration
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className={styles.registerBox}>
            <form onSubmit={handleSubmit}>
                <h2 className={styles.title}>Register</h2>
                <div className={styles.field}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
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
                <div className={styles.field}>
                    <label>Retype Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitButton}>
                    REGISTER
                </button>
                <a
                    href="#"
                    className={styles.loginLink}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleView(); // Call the toggleView function to switch to Login
                    }}
                >
                    Click here to Login
                </a>
            </form>
        </div>
    );
};

export default index;