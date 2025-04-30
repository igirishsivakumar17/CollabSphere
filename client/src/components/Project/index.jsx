import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './project.module.css';

const Project = ({ projectName, skills, expertise }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleViewMore = () => {
        navigate(`/project/${projectName}`); // Navigate to the project page with the project name
    };

    return (
        <div className={styles.projectCard}>
            <h2 className={styles.projectTitle}>Project {projectName}</h2>
            <p className={styles.projectSkills}>Skills: {skills.join(', ')}</p>
            <p className={styles.projectExpertise}>Expertise: {expertise}</p>
            <button onClick={handleViewMore} className={styles.projectLink}>
                Click here to view more
            </button>
        </div>
    );
};

export default Project;