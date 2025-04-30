import React, { useState, useEffect } from 'react';
import styles from './projectDashboard.module.css';
import { Navbar } from '../../components';
import ProjectForm from '../../components/ProjectForm';
import axios from 'axios';

const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]); // State to store fetched projects
    const [selectedProject, setSelectedProject] = useState(null); // State to track the selected project
    const [showForm, setShowForm] = useState(false); // State to toggle the ProjectForm
    const [loading, setLoading] = useState(true); // State to track loading status

    const fetchProjects = async () => {
        try {
            const username = sessionStorage.getItem('username'); // Get username from session storage
            if (!username) {
                alert('No username found in session storage.');
                setLoading(false); // Stop loading if username is not found
                return;
            }

            const response = await axios.get('/api/projects/user-projects', {
                params: { username },
            });

            setProjects(response.data); // Set the fetched projects
        } catch (error) {
            console.error('Error fetching projects:', error);
            alert('Failed to fetch projects.');
        } finally {
            setLoading(false); // Stop loading after the fetch is complete
        }
    };

    useEffect(() => {
        fetchProjects(); // Fetch projects on component mount
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project); // Set the clicked project as the selected project
        setShowForm(true); // Show the ProjectForm
    };

    const handleCreateNewClick = () => {
        setSelectedProject(null); // Clear the selected project for a new project
        setShowForm(true); // Show the ProjectForm
    };

    const handleFormSubmit = () => {
        setShowForm(false); // Close the form
        fetchProjects(); // Reload the project list
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loading}>Loading projects...</div> // Display loading indicator
                ) : (
                    <>
                        <div className={styles.projectsList}>
                            <div className={styles.heading}>My Projects</div>
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className={styles.projectItem}
                                    onClick={() => handleProjectClick(project)} // Handle project click
                                >
                                    <div className={styles.projectName}>{project.name}</div>
                                </div>
                            ))}
                        </div>
                        <div
                            className={styles.createContainer}
                            onClick={handleCreateNewClick} // Handle create new click
                        >
                            + Create New
                        </div>
                        {showForm && (
                            <div className={styles.projectFormContainer}>
                                <ProjectForm
                                    projectData={selectedProject} // Pass the selected project or null
                                    onSubmit={handleFormSubmit} // Reload the project list after submission
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default ProjectDashboard;