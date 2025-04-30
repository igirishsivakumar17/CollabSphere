const express = require('express');
const { createOrUpdateProject, getProjectsByUsername, checkProjectName, searchProjects, getProjectByName } = require('../controllers/projectController');

const router = express.Router();

// Route to create or update a project
router.post('/create-or-update', createOrUpdateProject);

// Route to fetch projects by username
router.get('/user-projects', getProjectsByUsername);

// Route to check if a project name exists
router.get('/check-name', checkProjectName);

// Route to search projects
router.get('/search', searchProjects);

// Route to fetch project by name
router.get('/:name', getProjectByName);

module.exports = router;