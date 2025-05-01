const { db } = require('../config/firebase');

exports.createProject = async (req, res) => {
    const {
        name, // New Name field
        description,
        expertise,
        status,
        deadline,
        maintainers,
        collaborators,
        requirements,
        username, // Retrieve username from the request body
    } = req.body;

    // Validate input fields
    if (!name || !description || !expertise || !status || !deadline || !maintainers || !collaborators || !username) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new project document in Firestore
        const projectDoc = db.collection('projects').doc(); // Auto-generate a unique ID
        await projectDoc.set({
            name, // Store the name in the database
            description,
            expertise,
            status,
            deadline,
            maintainers,
            collaborators,
            requirements: requirements || [], // Default to an empty array if not provided
            username, // Store the username in the database
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Project created successfully', projectId: projectDoc.id });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createOrUpdateProject = async (req, res) => {
    const {
        name, // Project name
        description,
        expertise,
        status,
        deadline,
        maintainers,
        collaborators,
        requirements,
        username, // Retrieve username from the request body
    } = req.body;

    // Validate input fields
    if (!name || !description || !expertise || !status || !deadline || !maintainers || !collaborators || !username) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if a project with the same name already exists
        const projectsSnapshot = await db.collection('projects').where('name', '==', name).get();

        if (!projectsSnapshot.empty) {
            // If a project with the same name exists, fetch the first matching project
            const projectDoc = projectsSnapshot.docs[0];
            const existingProject = projectDoc.data();

            // Compare the username
            if (existingProject.username === username) {
                // If the username matches, update the project
                await db.collection('projects').doc(projectDoc.id).update({
                    description,
                    expertise,
                    status,
                    deadline,
                    maintainers,
                    collaborators,
                    requirements: requirements || [], // Default to an empty array if not provided
                    updatedAt: new Date().toISOString(),
                });

                return res.status(200).json({ message: 'Project updated successfully', projectId: projectDoc.id });
            } else {
                // If the username is different, throw an error
                return res.status(400).json({
                    error: 'A project with the same name already exists. Please choose a different name.',
                });
            }
        }

        // If no project with the same name exists, create a new one
        const projectDoc = db.collection('projects').doc(); // Auto-generate a unique ID
        await projectDoc.set({
            name, // Store the name in the database
            description,
            expertise,
            status,
            deadline,
            maintainers,
            collaborators,
            requirements: requirements || [], // Default to an empty array if not provided
            username, // Store the username in the database
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Project created successfully', projectId: projectDoc.id });
    } catch (error) {
        console.error('Error creating or updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProjectsByUsername = async (req, res) => {
    const { username } = req.query; // Get username from query parameters

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const projectsSnapshot = await db
            .collection('projects')
            .where('username', '==', username)
            .get();

        const projects = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.checkProjectName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    try {
        const projectsSnapshot = await db.collection('projects').where('name', '==', name).get();

        if (!projectsSnapshot.empty) {
            return res.status(200).json({ exists: true });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Error checking project name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.searchProjects = async (req, res) => {
    const { keyword, username } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Search keyword is required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const projectsSnapshot = await db.collection('projects').get();
        const projects = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Normalize the search keyword
        const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Filter projects based on the normalized keyword and exclude projects with the same username
        const filteredProjects = projects.filter((project) => {
            const normalizedName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const normalizedExpertise = (project.expertise || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const normalizedDescription = (project.description || '').toLowerCase().replace(/[^a-z0-9]/g, '');

            // Normalize and check skills in the requirements array
            const requirementsSkills = (project.requirements || [])
                .map((req) => (req.skill || '').toLowerCase().replace(/[^a-z0-9]/g, ''))
                .join(' '); // Combine all skills into a single string for comparison

            return (
                project.username !== username && // Exclude projects with the same username
                (
                    normalizedName.includes(normalizedKeyword) ||
                    normalizedExpertise.includes(normalizedKeyword) ||
                    normalizedDescription.includes(normalizedKeyword) ||
                    requirementsSkills.includes(normalizedKeyword)
                )
            );
        });

        res.status(200).json(filteredProjects);
    } catch (error) {
        console.error('Error searching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProjectByName = async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    try {
        const projectsSnapshot = await db.collection('projects').where('name', '==', name).get();

        if (projectsSnapshot.empty) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = projectsSnapshot.docs[0].data();
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project by name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSuggestedProjects = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        // Fetch the user's skills
        const userSnapshot = await db.collection('users').where('username', '==', username).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.docs[0].data();
        const skills = userData.skills || '';

        if (!skills.trim()) {
            return res.status(400).json({ error: 'No skills found for the user' });
        }

        // Split the skills into an array
        const skillArray = skills.split(',').map((skill) => skill.trim().toLowerCase());

        // Fetch projects where the skills match the requirements
        const projectsSnapshot = await db.collection('projects').get();
        const projects = projectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Filter projects based on matching skills in the requirements
        const suggestedProjects = projects.filter((project) =>
            project.requirements.some((req) =>
                skillArray.includes(req.skill.toLowerCase())
            )
        );

        res.status(200).json(suggestedProjects);
    } catch (error) {
        console.error('Error fetching suggested projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};