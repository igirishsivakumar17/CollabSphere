import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components';
import styles from './interest.module.css';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const Interest = () => {
    const [interests, setInterests] = useState([]); // State to store interests
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const username = sessionStorage.getItem('username'); // Get the logged-in username
                const response = await axios.get('/api/interests/user', { params: { username } });
                setInterests(response.data); // Set the fetched interests
            } catch (error) {
                console.error('Error fetching interests:', error);
                alert('Failed to fetch interests.');
            } finally {
                setLoading(false); // Stop loading after the fetch is complete
            }
        };

        fetchInterests();
    }, []);

    const handleDeleteInterest = async (interestId) => {
        try {
            await axios.delete(`/api/interests/${interestId}`);
            setInterests((prev) => prev.filter((interest) => interest.id !== interestId)); // Remove the deleted interest from the state
            alert('Interest deleted successfully.');
        } catch (error) {
            console.error('Error deleting interest:', error);
            alert('Failed to delete interest.');
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>My Interests</h1>
                {loading ? (
                    <div className={styles.loading}>Loading interests...</div>
                ) : interests.length === 0 ? (
                    <div className={styles.noInterests}>No interests found.</div>
                ) : (
                    <table className={styles.interestsTable}>
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Skill</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interests.map((interest, index) => (
                                <tr
                                    key={interest.id}
                                    className={
                                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                                    }
                                >
                                    <td>{interest.projectName}</td>
                                    <td>{interest.skill}</td>
                                    <td>{interest.status}</td>
                                    <td>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteInterest(interest.id)}
                                            disabled={interest.status !== 'pending'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Interest;