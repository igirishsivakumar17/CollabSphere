const { db } = require('../config/firebase');

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    const { projectName, title, content } = req.body;

    if (!projectName || !title || !content) {
        return res.status(400).json({ error: 'Project name, title, and content are required' });
    }

    try {
        const discussionDoc = db.collection('discussions').doc(); // Auto-generate a unique ID
        await discussionDoc.set({
            projectName,
            title,
            content,
            comments: [], // Initialize with an empty array
            upvotes: 0, // Initialize upvotes to 0
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Discussion created successfully', discussionId: discussionDoc.id });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch discussions for a project
exports.getDiscussionsByProject = async (req, res) => {
    const { projectName } = req.query;

    if (!projectName) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    try {
        const discussionsSnapshot = await db
            .collection('discussions')
            .where('projectName', '==', projectName)
            .get();

        const discussions = discussionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add a comment to a discussion
exports.addComment = async (req, res) => {
    const { discussionId, username, comment } = req.body;

    if (!discussionId || !username || !comment) {
        return res.status(400).json({ error: 'Discussion ID, username, and comment are required' });
    }

    try {
        const discussionRef = db.collection('discussions').doc(discussionId);
        const discussionDoc = await discussionRef.get();

        if (!discussionDoc.exists) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const discussionData = discussionDoc.data();
        const updatedComments = [
            ...discussionData.comments,
            { username, comment, upvotes: 0, createdAt: new Date().toISOString() },
        ];

        await discussionRef.update({ comments: updatedComments });

        res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Toggle upvote for a discussion
exports.upvoteDiscussion = async (req, res) => {
    const { discussionId, username } = req.body;

    if (!discussionId || !username) {
        return res.status(400).json({ error: 'Discussion ID and username are required' });
    }

    try {
        const discussionRef = db.collection('discussions').doc(discussionId);
        const discussionDoc = await discussionRef.get();

        if (!discussionDoc.exists) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const discussionData = discussionDoc.data();
        if (!discussionData.upvotedBy) {
            discussionData.upvotedBy = []; // Initialize upvotedBy array if it doesn't exist
        }

        if (discussionData.upvotedBy.includes(username)) {
            // If the user has already upvoted, remove the upvote
            discussionData.upvotedBy = discussionData.upvotedBy.filter((user) => user !== username);
            discussionData.upvotes -= 1;
        } else {
            // Otherwise, add the upvote
            discussionData.upvotedBy.push(username);
            discussionData.upvotes += 1;
        }

        await discussionRef.update({
            upvotes: discussionData.upvotes,
            upvotedBy: discussionData.upvotedBy,
        });

        res.status(200).json({ message: 'Discussion upvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling discussion upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Toggle upvote for a comment
exports.upvoteComment = async (req, res) => {
    const { discussionId, commentIndex, username } = req.body;

    if (!discussionId || commentIndex === undefined || !username) {
        return res.status(400).json({ error: 'Discussion ID, comment index, and username are required' });
    }

    try {
        const discussionRef = db.collection('discussions').doc(discussionId);
        const discussionDoc = await discussionRef.get();

        if (!discussionDoc.exists) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const discussionData = discussionDoc.data();
        const updatedComments = [...discussionData.comments];

        const comment = updatedComments[commentIndex];
        if (!comment.upvotedBy) {
            comment.upvotedBy = []; // Initialize upvotedBy array if it doesn't exist
        }

        if (comment.upvotedBy.includes(username)) {
            // If the user has already upvoted, remove the upvote
            comment.upvotedBy = comment.upvotedBy.filter((user) => user !== username);
            comment.upvotes -= 1;
        } else {
            // Otherwise, add the upvote
            comment.upvotedBy.push(username);
            comment.upvotes += 1;
        }

        updatedComments[commentIndex] = comment;

        await discussionRef.update({ comments: updatedComments });

        res.status(200).json({ message: 'Comment upvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling comment upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};