import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components';
import styles from './project.module.css';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa'; // Import up arrow icon

const Project = () => {
    const { name } = useParams(); // Get the project name from the route
    const [project, setProject] = useState(null); // State to store project details
    const [loading, setLoading] = useState(true); // State to track loading status
    const [discussions, setDiscussions] = useState([]); // State to store discussions
    const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' }); // State for new discussion
    const [interests, setInterests] = useState([]); // State to track user interests

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/projects/${name}`);
                setProject(response.data); // Set the fetched project details
            } catch (error) {
                console.error('Error fetching project details:', error);
                alert('Failed to fetch project details.');
            } finally {
                setLoading(false); // Stop loading after the fetch is complete
            }
        };

        const fetchDiscussions = async () => {
            try {
                const response = await axios.get(`/api/discussions/project`, {
                    params: { projectName: name },
                });
                setDiscussions(response.data); // Set the fetched discussions
            } catch (error) {
                console.error('Error fetching discussions:', error);
            }
        };

        const fetchInterests = async () => {
            try {
                const username = sessionStorage.getItem('username');
                const response = await axios.get(`/api/interests`, {
                    params: { username, projectName: name },
                });
                setInterests(response.data); // Set the fetched interests
            } catch (error) {
                console.error('Error fetching interests:', error);
            }
        };

        fetchProject();
        fetchDiscussions();
        fetchInterests();
    }, [name]);

    const handleSendInterest = async (skill) => {
        try {
            const username = sessionStorage.getItem('username');
            const response = await axios.post('/api/interests/send', {
                username,
                projectName: name,
                skill,
            });
            alert(response.data.message);
            setInterests([...interests, { skill, status: 'pending' }]); // Update the interests state
        } catch (error) {
            console.error('Error sending interest:', error);
            alert(error.response?.data?.error || 'Failed to send interest.');
        }
    };

    const handleCreateDiscussion = async () => {
        if (!newDiscussion.title || !newDiscussion.content) {
            alert('Title and content are required.');
            return;
        }

        try {
            const response = await axios.post('/api/discussions/create', {
                projectName: name,
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
                prev.map((d) =>
                    d.id === discussionId
                        ? {
                              ...d,
                              comments: d.comments.map((comment, index) =>
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
                        : d
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
            const username = sessionStorage.getItem('username'); // Get the username of the logged-in user
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

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!project) {
        return <div className={styles.error}>Project not found.</div>;
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                {/* Project Details Section */}
                <h1 className={styles.title}>Project {project.name}</h1>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.details}>
                    <p>
                        <span className={styles.label}>Expertise:</span>{' '}
                        <span className={styles.value}>{project.expertise}</span>
                    </p>
                    <p>
                        <span className={styles.label}>Status:</span>{' '}
                        <span className={styles.value}>{project.status}</span>
                    </p>
                    <p>
                        <span className={styles.label}>Deadline:</span>{' '}
                        <span className={styles.value}>{project.deadline}</span>
                    </p>
                </div>

                {/* Requirements Section */}
                <h2 className={styles.requirementsTitle}>Requirements</h2>
                <table className={styles.requirementsTable}>
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th>Available Positions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.requirements.map((req, index) => {
                            const availablePositions = req.totalPositions - req.currentlyFilled;
                            const userInterest = interests.find((interest) => interest.skill === req.skill);

                            return (
                                <tr key={index}>
                                    <td>{req.skill}</td>
                                    <td>{availablePositions > 0 ? availablePositions : '0'}</td>
                                    <td>
                                        {userInterest ? (
                                            <button className={styles.appliedButton} disabled>
                                                {userInterest.status}
                                            </button>
                                        ) : availablePositions > 0 ? (
                                            <button
                                                className={styles.interestButton}
                                                onClick={() => handleSendInterest(req.skill)}
                                            >
                                                Send Interest
                                            </button>
                                        ) : (
                                            <button className={styles.disabledButton} disabled>
                                                Not Available
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Discussion Section */}
                <h2 className={styles.requirementsTitle}>Discussions</h2>
                <div>
                    <h3>Start a New Discussion</h3>
                    <div className={styles.newDiscussionRow}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newDiscussion.title}
                            onChange={(e) =>
                                setNewDiscussion({ ...newDiscussion, title: e.target.value })
                            }
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.newDiscussionRow}>
                        <textarea
                            placeholder="Content"
                            value={newDiscussion.content}
                            onChange={(e) =>
                                setNewDiscussion({ ...newDiscussion, content: e.target.value })
                            }
                            className={styles.textArea}
                        />
                    </div>
                    <div className={styles.newDiscussionRow}>
                        <button onClick={handleCreateDiscussion} className={styles.startDiscussionButton}>
                            Start Discussion
                        </button>
                    </div>
                </div>
                {discussions.map((discussion) => (
                    <div key={discussion.id} className={styles.discussion}>
                        <h3>{discussion.title}</h3>
                        <p>{discussion.content}</p>
                        <button onClick={() => handleToggleUpvoteDiscussion(discussion.id)} className={styles.upvoteButton}>
                            <FaArrowUp /> Upvote ({discussion.upvotes})
                        </button>
                        <div>
                            <h4>Comments</h4>
                            {discussion.comments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                    <p>
                                        {comment.username}: {comment.comment} (
                                        {comment.upvotes} upvotes)
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleToggleUpvoteComment(discussion.id, index)
                                        }
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
        </>
    );
};

export default Project;