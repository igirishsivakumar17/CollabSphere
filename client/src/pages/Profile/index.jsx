import React, { useState, useEffect } from 'react';
import styles from './profile.module.css';
import { Navbar } from '../../components';
import axios from 'axios';

const index = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        skills: '',
        points: 0,
        resume: null,
        linkedinUrl: '',
        githubUrl: '',
    });

    const [badges, setBadges] = useState([]); // State to store badges
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = sessionStorage.getItem('username'); // Get username from session storage
                if (!username) {
                    alert('No username found in session storage.');
                    return;
                }

                const response = await axios.get('/api/users/profile', {
                    params: { username },
                });

                const userData = response.data;
                setFormData({
                    name: userData.name || '',
                    username: userData.username || '',
                    email: userData.email || '',
                    password: '',
                    confirmPassword: '',
                    skills: userData.skills || '',
                    points: userData.points || 0,
                    resume: null,
                    linkedinUrl: userData.linkedinUrl || '',
                    githubUrl: userData.githubUrl || '',
                });

                // Set badges
                setBadges(userData.badges || []);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const username = sessionStorage.getItem('username'); // Retrieve username from session storage

            if (!username) {
                alert('No username found in session storage.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('username', username); // Include username in the payload
            formDataToSend.append('name', formData.name);
            formDataToSend.append('skills', formData.skills);
            formDataToSend.append('linkedinUrl', formData.linkedinUrl);
            formDataToSend.append('githubUrl', formData.githubUrl);
            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }
            if (formData.password) {
                formDataToSend.append('password', formData.password);
            }

            await axios.post('/api/users/update-profile', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.welcomeMessage}>
                    Welcome <span className={styles.username}>{formData.username}</span>
                </h1>
                <form className={styles.profileForm} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            disabled
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="skills">Skills</label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Enter your skills"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="points">Points</label>
                        <input
                            type="number"
                            id="points"
                            name="points"
                            value={formData.points}
                            disabled
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="resume">Resume</label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="linkedinUrl">LinkedIn URL</label>
                        <input
                            type="url"
                            id="linkedinUrl"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="Enter your LinkedIn URL"
                        />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="githubUrl">GitHub URL</label>
                        <input
                            type="url"
                            id="githubUrl"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            placeholder="Enter your GitHub URL"
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Update Profile
                    </button>
                </form>

                {/* Badges Section */}
                <div className={styles.badgesContainer}>
                    <h2 className={styles.badgesHeader}>Your Badges</h2>
                    <div className={styles.badgesGrid}>
                        {badges.length > 0 ? (
                            badges.map((badge, index) => (
                                <div key={index} className={styles.badge}>
                                    {badge}
                                </div>
                            ))
                        ) : (
                            <p>No badges earned yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default index;