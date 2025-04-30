const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // Replace with your Firebase service account file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://collab-sphere-54ffe.firebaseio.com', // Replace with your Firebase database URL
});

const db = admin.firestore(); // Firestore database instance
const auth = admin.auth(); // Firebase authentication instance

// Test Firestore connection
(async () => {
    try {
        const testDoc = db.collection('test').doc('connection-test');
        await testDoc.set({ connected: true, timestamp: new Date() });
        console.log('Firestore is connected and test document written successfully.');
    } catch (error) {
        console.error('Error connecting to Firestore:', error);
    }
})();

module.exports = { db, auth };