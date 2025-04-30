require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const interestRoutes = require('./routes/interestRoutes'); // Import interest routes
const discussionRoutes = require('./routes/discussionRoutes'); // Import discussion routes

const app = express();

// Middleware
const corsOptions = {
    origin: '*', // Allow requests from this origin
    credentials: false, // Allow cookies if needed
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes); // Register user routes
app.use('/api/interests', interestRoutes); // Register interest routes
app.use('/api/discussions', discussionRoutes); // Register discussion routes

// Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});