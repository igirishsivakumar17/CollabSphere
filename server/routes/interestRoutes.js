const express = require('express');
const { sendInterest, getInterests, getInterestsByProject, updateInterestStatus, deleteInterest, getInterestsByUsername } = require('../controllers/interestController');

const router = express.Router();

// Route to send interest
router.post('/send', sendInterest);

router.get('/', getInterests);

// Route to fetch interests for a project
router.get('/project', getInterestsByProject);

// Route to update interest status
router.post('/update-status', updateInterestStatus);

// Route to delete an interest
router.delete('/:interestId', deleteInterest);

// Route to fetch interests by username
router.get('/user', getInterestsByUsername);

module.exports = router;