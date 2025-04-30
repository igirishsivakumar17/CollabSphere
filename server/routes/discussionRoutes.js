const express = require('express');
const {
    createDiscussion,
    getDiscussionsByProject,
    addComment,
    upvoteDiscussion,
    upvoteComment,
} = require('../controllers/discussionController');

const router = express.Router();

// Route to create a discussion
router.post('/create', createDiscussion);

// Route to fetch discussions for a project
router.get('/project', getDiscussionsByProject);

// Route to add a comment to a discussion
router.post('/comment', addComment);

// Route to upvote a discussion
router.post('/upvote', upvoteDiscussion);

// Route to upvote a comment
router.post('/comment/upvote', upvoteComment);

module.exports = router;