const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
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