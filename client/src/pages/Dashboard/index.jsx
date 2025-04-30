import React, { useState } from 'react';
import styles from './dashboard.module.css';
import { Navbar, Project } from '../../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const index = () => {
    const username = sessionStorage.getItem('username'); // Fetch username from session storage
    const navigate = useNavigate(); // Initialize useNavigate
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [loading, setLoading] = useState(false); // State to track loading status
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const resultsPerPage = 6; // Number of results per page

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('Please enter a search term.');
            return;
        }

        try {
            setLoading(true); // Set loading to true while fetching
            const username = sessionStorage.getItem('username'); // Get the logged-in user's username
            const response = await axios.get('/api/projects/search', {
                params: { keyword: searchTerm, username }, // Send the username as a query parameter
            });
            setSearchResults(response.data); // Set the fetched search results
            setCurrentPage(1); // Reset to the first page after a new search
        } catch (error) {
            console.error('Error searching projects:', error);
            alert('Failed to fetch search results.');
        } finally {
            setLoading(false); // Stop loading after the fetch is complete
        }
    };

    // Pagination logic
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.welcomeMessage}>
                Welcome <span className={styles.username}>{username}</span>
            </div>
            <div className={styles.searchContainer}>
                <label htmlFor="search" className={styles.searchLabel}>
                    Search Projects:
                </label>
                <input
                    type="text"
                    id="search"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter project name, skills, or expertise"
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                    🔍
                </button>
            </div>
            <div className={styles.boxContainer}>
                <div
                    className={styles.box}
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer' }}
                >
                    My Profile
                </div>
                <div
                    className={styles.box}
                    onClick={() => navigate('/project-dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    My Project
                </div>
                <div
                    className={styles.box}
                    onClick={() => navigate('/interest')} // Navigate to the interest route
                    style={{ cursor: 'pointer' }}
                >
                    My Interest
                </div>
            </div>
            <div className={styles.searchResults}>
                {loading ? (
                    <div className={styles.loading}>Searching projects...</div>
                ) : currentResults.length > 0 ? (
                    <>
                        <div className={styles.resultsGrid}>
                            {currentResults.map((project) => (
                                <Project
                                    key={project.id}
                                    projectName={project.name}
                                    skills={(project.requirements || []).map((req) => req.skill)}
                                    expertise={project.expertise}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    className={styles.paginationButton}
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className={styles.pageInfo}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className={styles.paginationButton}
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.noResults}>No projects found.</div>
                )}
            </div>
        </>
    );
};

export default index;