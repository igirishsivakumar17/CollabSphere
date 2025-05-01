import React, { useState, useEffect } from 'react';
import styles from './projectForm.module.css';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';

const ProjectForm = ({ projectData = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        expertise: 'novice',
        status: 'in-progress',
        deadline: '',
        maintainers: '',
        collaborators: '',
    });

    const [requirements, setRequirements] = useState([]);
    const [interests, setInterests] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });

    useEffect(() => {
        if (projectData) {
            setFormData({
                name: projectData.name || '',
                description: projectData.description || '',
                expertise: projectData.expertise || 'novice',
                status: projectData.status || 'in-progress',
                deadline: projectData.deadline || '',
                maintainers: projectData.maintainers || '',
                collaborators: projectData.collaborators || '',
            });
            setRequirements(projectData.requirements || []);
            fetchInterests(projectData.name);
            fetchDiscussions(projectData.name);
        } else {
            setFormData({
                name: '',
                description: '',
                expertise: 'novice',
                status: 'in-progress',
                deadline: '',
                maintainers: '',
                collaborators: '',
            });
            setRequirements([]);
        }
    }, [projectData]);

    const fetchInterests = async (projectName) => {
        try {
            const response = await axios.get('/api/interests/project', { params: { projectName } });
            setInterests(response.data);
        } catch (error) {
            console.error('Error fetching interests:', error);
        }
    };

    const fetchDiscussions = async (projectName) => {
        try {
            const response = await axios.get('/api/discussions/project', { params: { projectName } });
            setDiscussions(response.data);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleCreateDiscussion = async () => {
        if (!newDiscussion.title || !newDiscussion.content) {
            alert('Title and content are required.');
            return;
        }

        try {
            const response = await axios.post('/api/discussions/create', {
                projectName: projectData.name,
                title: newDiscussion.title,
                content: newDiscussion.content,
            });
            alert(response.data.message);
            setDiscussions([...discussions, { ...newDiscussion, upvotes: 0, comments: [], upvotedBy: [] }]);
            setNewDiscussion({ title: '', content: '' });
        } catch (error) {
            console.error('Error creating discussion:', error);
            alert('Failed to create discussion.');
        }
    };

    const handleToggleUpvoteDiscussion = async (discussionId) => {
        try {
            const username = sessionStorage.getItem('username');
            await axios.post('/api/discussions/upvote', { discussionId, username });
            setDiscussions((prev) =>
                prev.map((d) =>
                    d.id === discussionId
                        ? {
                              ...d,
                              upvotes: d.upvotedBy?.includes(username)
                                  ? d.upvotes - 1
                                  : d.upvotes + 1,
                              upvotedBy: d.upvotedBy?.includes(username)
                                  ? d.upvotedBy.filter((user) => user !== username)
                                  : [...(d.upvotedBy || []), username],
                          }
                        : d
                )
            );
        } catch (error) {
            console.error('Error toggling discussion upvote:', error);
        }
    };

    const handleToggleUpvoteComment = async (discussionId, commentIndex) => {
        try {
            const username = sessionStorage.getItem('username');
            await axios.post('/api/discussions/comment/upvote', { discussionId, commentIndex, username });

            setDiscussions((prev) =>
                prev.map((discussion) =>
                    discussion.id === discussionId
                        ? {
                              ...discussion,
                              comments: discussion.comments.map((comment, index) =>
                                  index === commentIndex
                                      ? {
                                            ...comment,
                                            upvotes: comment.upvotedBy?.includes(username)
                                                ? comment.upvotes - 1
                                                : comment.upvotes + 1,
                                            upvotedBy: comment.upvotedBy?.includes(username)
                                                ? comment.upvotedBy.filter((user) => user !== username)
                                                : [...(comment.upvotedBy || []), username],
                                        }
                                      : comment
                              ),
                          }
                        : discussion
                )
            );
        } catch (error) {
            console.error('Error toggling comment upvote:', error);
        }
    };

    const handleAddComment = async (discussionId, comment) => {
        if (!comment.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const username = sessionStorage.getItem('username');
            await axios.post('/api/discussions/comment', { discussionId, username, comment });
            setDiscussions((prev) =>
                prev.map((d) =>
                    d.id === discussionId
                        ? {
                              ...d,
                              comments: [
                                  ...d.comments,
                                  { username, comment, upvotes: 0, upvotedBy: [] },
                              ],
                          }
                        : d
                )
            );
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddRow = () => {
        setRequirements((prevRequirements) => [
            ...prevRequirements,
            { skill: '', totalPositions: 0, currentlyFilled: 0 },
        ]);
    };

    const handleRowChange = (index, field, value) => {
        const updatedRequirements = [...requirements];
        if (field === 'totalPositions' && value < 0) {
            value = 0; // Ensure totalPositions is non-negative
        }
        updatedRequirements[index][field] = value;
        setRequirements(updatedRequirements);
    };

    const handleDeleteRow = (index) => {
        const updatedRequirements = requirements.filter((_, i) => i !== index);
        setRequirements(updatedRequirements);
    };

    const handleUpdateStatus = async (interestId, status) => {
        try {
            await axios.post('/api/interests/update-status', { interestId, status });
            setInterests((prevInterests) =>
                prevInterests.map((interest) =>
                    interest.id === interestId ? { ...interest, status } : interest
                )
            );
        } catch (error) {
            console.error('Error updating interest status:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!formData.name || !formData.description || !formData.deadline || !formData.maintainers || !formData.collaborators) {
            alert('All fields are required.');
            return;
        }

        try {
            const username = sessionStorage.getItem('username'); // Retrieve username from session storage

            const response = await axios.post('/api/projects/create-or-update', {
                ...formData,
                requirements,
                username, // Include username in the payload
            });

            alert(response.data.message); // Show success message
            onSubmit(response.data.project); // Pass the updated project to the parent
        } catch (error) {
            console.error('Error creating or updating project:', error);
            alert(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <form className={styles.projectForm} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                    disabled={!!projectData} // Disable the name field if updating a project
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Enter project description"
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="expertise">Expertise</label>
                <select
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                >
                    <option value="novice">Novice</option>
                    <option value="competent">Competent</option>
                    <option value="expert">Expert</option>
                </select>
            </div>
            <div className={styles.field}>
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="in-progress">In-Progress</option>
                    <option value="planned">Planned</option>
                    <option value="archived">Archived</option>
                    <option value="done">Done</option>
                </select>
            </div>
            <div className={styles.field}>
                <label htmlFor="deadline">Deadline</label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="maintainers">Maintainers</label>
                <input
                    type="text"
                    id="maintainers"
                    name="maintainers"
                    value={formData.maintainers}
                    onChange={handleChange}
                    placeholder="Enter maintainers"
                    required
                />
            </div>
            <div className={styles.field}>
                <label htmlFor="collaborators">Collaborators</label>
                <input
                    type="text"
                    id="collaborators"
                    name="collaborators"
                    value={formData.collaborators}
                    onChange={handleChange}
                    placeholder="Collaborators will be updated automatically"
                    disabled // Disable the field
                />
            </div>

            {/* Requirements Section */}
            <div className={styles.requirementsSection}>
                <div className={styles.requirementsHeader}>
                    <h3>Requirements</h3>
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={handleAddRow}
                    >
                        Add
                    </button>
                </div>
                <table className={styles.requirementsTable}>
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th>Total Positions</th>
                            <th>Currently Filled</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map((row, index) => (
                            <tr
                                key={index}
                                className={
                                    index % 2 === 0
                                        ? styles.evenRow
                                        : styles.oddRow
                                }
                            >
                                <td>
                                    <input
                                        type="text"
                                        value={row.skill}
                                        onChange={(e) =>
                                            handleRowChange(
                                                index,
                                                'skill',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter skill"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.totalPositions}
                                        onChange={(e) =>
                                            handleRowChange(
                                                index,
                                                'totalPositions',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter total positions"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.currentlyFilled}
                                        disabled
                                        placeholder="0"
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteRow(index)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button type="submit" className={styles.submitButton}>
                Submit
            </button>

            {/* Interests Section */}
            {projectData && (
                <div className={styles.interestsSection}>
                    <h3 className={styles.requirementsTitle}>Interests</h3>
                    {interests.length === 0 ? (
                        <p>No records found.</p>
                    ) : (
                        <table className={styles.requirementsTable}>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Skill</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interests.map((interest) => (
                                    <tr key={interest.id}>
                                        <td>{interest.username}</td>
                                        <td>{interest.skill}</td>
                                        <td>{interest.status}</td>
                                        <td>
                                            <button
                                                className={styles.acceptButton}
                                                onClick={() => handleUpdateStatus(interest.id, 'accepted')}
                                                disabled={interest.status === 'accepted' || interest.status === 'rejected'}
                                            >
                                                ✅
                                            </button>
                                            <button
                                                className={styles.rejectButton}
                                                onClick={() => handleUpdateStatus(interest.id, 'rejected')}
                                                disabled={interest.status === 'accepted' || interest.status === 'rejected'}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Discussions Section */}
            {projectData && (
                <div className={styles.discussionsSection}>
                    <h3 className={styles.requirementsTitle}>Discussions</h3>
                    <div>
                        <h4>Start a New Discussion</h4>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newDiscussion.title}
                            onChange={(e) =>
                                setNewDiscussion({ ...newDiscussion, title: e.target.value })
                            }
                            className={styles.inputField}
                        />
                        <textarea
                            placeholder="Content"
                            value={newDiscussion.content}
                            onChange={(e) =>
                                setNewDiscussion({ ...newDiscussion, content: e.target.value })
                            }
                            className={styles.textArea}
                        />
                        <button onClick={handleCreateDiscussion} className={styles.startDiscussionButton}>
                            Start Discussion
                        </button>
                    </div>
                    {discussions.map((discussion) => (
                        <div key={discussion.id} className={styles.discussion}>
                            <h4>{discussion.title}</h4>
                            <p>{discussion.content}</p>
                            <button
                                onClick={() => handleToggleUpvoteDiscussion(discussion.id)}
                                className={styles.upvoteButton}
                            >
                                <FaArrowUp /> Upvote ({discussion.upvotes})
                            </button>
                            <div>
                                <h5>Comments</h5>
                                {discussion.comments.map((comment, index) => (
                                    <div key={index} className={styles.comment}>
                                        <p>
                                            {comment.username}: {comment.comment} ({comment.upvotes} upvotes)
                                        </p>
                                        <button
                                            onClick={() => handleToggleUpvoteComment(discussion.id, index)}
                                            className={styles.upvoteButton}
                                        >
                                            <FaArrowUp /> Upvote
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddComment(discussion.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
};

export default ProjectForm;