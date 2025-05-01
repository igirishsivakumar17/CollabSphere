const { db } = require('../config/firebase');

exports.sendInterest = async (req, res) => {
    const { username, projectName, skill } = req.body;

    if (!username || !projectName || !skill) {
        return res.status(400).json({ error: 'Username, project name, and skill are required' });
    }

    try {
        // Check if the user has already sent interest for this skill in the project
        const interestSnapshot = await db
            .collection('interests')
            .where('username', '==', username)
            .where('projectName', '==', projectName)
            .where('skill', '==', skill)
            .get();

        if (!interestSnapshot.empty) {
            return res.status(400).json({ error: 'You have already applied for this skill.' });
        }

        // Save the interest in the database
        await db.collection('interests').add({
            username,
            projectName,
            skill,
            status: 'pending', // Default status
            createdAt: new Date().toISOString(),
        });

        res.status(200).json({ message: 'Interest sent successfully.' });
    } catch (error) {
        console.error('Error sending interest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInterests = async (req, res) => {
    const { username, projectName } = req.query;

    if (!username || !projectName) {
        return res.status(400).json({ error: 'Username and project name are required' });
    }

    try {
        const interestsSnapshot = await db
            .collection('interests')
            .where('username', '==', username)
            .where('projectName', '==', projectName)
            .get();

        const interests = interestsSnapshot.docs.map((doc) => doc.data());
        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInterestsByProject = async (req, res) => {
    const { projectName } = req.query;

    if (!projectName) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    try {
        const interestsSnapshot = await db
            .collection('interests')
            .where('projectName', '==', projectName)
            .get();

        const interests = interestsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateInterestStatus = async (req, res) => {
    const { interestId, status } = req.body;

    if (!interestId || !status) {
        return res.status(400).json({ error: 'Interest ID and status are required' });
    }

    try {
        const interestRef = db.collection('interests').doc(interestId);
        const interestDoc = await interestRef.get();

        if (!interestDoc.exists) {
            return res.status(404).json({ error: 'Interest not found' });
        }

        const interestData = interestDoc.data();
        const { projectName, skill } = interestData;

        if (status === 'accepted') {
            const projectSnapshot = await db
                .collection('projects')
                .where('name', '==', projectName)
                .get();

            if (projectSnapshot.empty) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const projectDoc = projectSnapshot.docs[0];
            const projectData = projectDoc.data();

            const updatedRequirements = projectData.requirements.map((requirement) => {
                if (requirement.skill === skill) {
                    return {
                        ...requirement,
                        currentlyFilled: requirement.currentlyFilled + 1,
                    };
                }
                return requirement;
            });

            await db.collection('projects').doc(projectDoc.id).update({
                requirements: updatedRequirements,
            });
        }

        await interestRef.update({ status });

        res.status(200).json({ message: 'Interest status updated successfully.' });
    } catch (error) {
        console.error('Error updating interest status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteInterest = async (req, res) => {
    const { interestId } = req.params;

    if (!interestId) {
        return res.status(400).json({ error: 'Interest ID is required' });
    }

    try {
        const interestRef = db.collection('interests').doc(interestId);
        const interestDoc = await interestRef.get();

        if (!interestDoc.exists) {
            return res.status(404).json({ error: 'Interest not found' });
        }

        await interestRef.delete();
        res.status(200).json({ message: 'Interest deleted successfully' });
    } catch (error) {
        console.error('Error deleting interest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInterestsByUsername = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const interestsSnapshot = await db
            .collection('interests')
            .where('username', '==', username)
            .get();

        const interests = interestsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching interests by username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};