const { db } = require('../config/firebase');

exports.getUserProfile = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.docs[0].data();

        // Ensure badges are included in the response, defaulting to an empty array if not present
        const response = {
            ...userData,
            badges: userData.badges || [], // Include badges in the response
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userDoc = userSnapshot.docs[0];
        const updates = {};

        // Update fields if they are provided
        if (req.body.name) updates.name = req.body.name;
        if (req.body.skills) updates.skills = req.body.skills;
        if (req.body.linkedinUrl) updates.linkedinUrl = req.body.linkedinUrl;
        if (req.body.githubUrl) updates.githubUrl = req.body.githubUrl;

        // Handle resume file upload
        if (req.file) {
            updates.resumeUrl = req.file.path; // Assuming you're using a file upload middleware
        }

        // Update password if provided
        if (req.body.password) {
            const bcrypt = require('bcrypt');
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        await db.collection('users').doc(userDoc.id).update(updates);

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};