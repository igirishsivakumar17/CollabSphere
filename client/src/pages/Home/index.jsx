import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import { Navbar, Login, Register, Project, Leaderboard, Company } from '../../components';

const index = () => {
    const [showRegister, setShowRegister] = useState(false); // State to toggle between Login and Register
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    useEffect(() => {
        // Check session storage for username on component mount
        const username = sessionStorage.getItem('username');
        setIsLoggedIn(!!username); // Set isLoggedIn to true if username exists
    }, []);

    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight, // Scrolls down by one viewport height
            behavior: 'smooth', // Smooth scrolling effect
        });
    };

    const leaderboardData = [
        { rank: 1, username: 'Alice', points: 1500 },
        { rank: 2, username: 'Bob', points: 1200 },
        { rank: 3, username: 'Charlie', points: 900 },
    ];

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.textSection}>
                    <h1>Welcome to Collab Sphere</h1>
                    <p>
                        An open-source platform where developers, designers, and creators from around the world come together to build, share, and grow projects in a truly collaborative environment. Whether you're working on code, documentation, or design, Collab Sphere empowers you with the tools and community support to turn ideas into impact. Dive into open collaboration, explore inspiring work, and contribute to a sphere where innovation is shared.
                    </p>
                </div>
                {!isLoggedIn && (
                    <div className={styles.authSection}>
                        {showRegister ? (
                            <Register toggleView={() => setShowRegister(false)} />
                        ) : (
                            <Login toggleView={() => setShowRegister(true)} />
                        )}
                    </div>
                )}
            </div>
            <div className={styles.scrollIcon} onClick={handleScrollDown}>
                ↓
            </div>
            <div className={styles.trendingProjects}>
                <h2 className={styles.trendingHeader}>Trending Projects</h2>
                <div className={styles.projectsContainer}>
                    <Project projectName="CollabSphere" skills={['React', 'Node.js', 'CSS']} expertise="Easy" />
                    <Project projectName="OpenAI" skills={['Python', 'Machine Learning', 'API']} expertise="Advanced" />
                    <Project projectName="Portfolio" skills={['HTML', 'CSS', 'JavaScript']} expertise="Intermediate" />
                </div>
            </div>
            <div className={styles.leaderboardSection}>
                <h2 className={styles.trendingHeader}>Leaderboard</h2>
                <Leaderboard data={leaderboardData} />
            </div>
            <div className={styles.companySection}>
                <h2 className={styles.trendingHeader}>Trusted By</h2>
                <div className={styles.companyContainer}>
                    <Company name="Company XYZ" />
                    <Company name="Company ABC" />
                    <Company name="Company 123" />
                </div>
            </div>
        </>
    );
};

export default index;