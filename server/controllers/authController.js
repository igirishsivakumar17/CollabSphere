const { db } = require('../config/firebase');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

exports.registerUser = async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    // Validate input fields
    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Check if email already exists
        const emailQuery = await db.collection('users').where('email', '==', email).get();
        if (!emailQuery.empty) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if username already exists
        const usernameQuery = await db.collection('users').where('username', '==', username).get();
        if (!usernameQuery.empty) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user data in Firestore
        const userDoc = db.collection('users').doc(); // Auto-generate a unique ID
        await userDoc.set({
            username,
            email,
            password: hashedPassword, // Store the hashed password
            createdAt: new Date().toISOString(),
        });

        console.log('User data written to Firestore:', {
            username,
            email,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if the username exists
        const userQuery = await db.collection('users').where('username', '==', username).get();
        if (userQuery.empty) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Get the user document
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Login successful
        res.status(200).json({ message: 'Login successful', user: { username: userData.username, email: userData.email } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};