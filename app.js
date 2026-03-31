const express = require('express');
const mongoose = require('mongoose');
const messageRoutes = require('./routes/messageRoutes');
const fs = require('fs');

const app = express();

// Ensure upload directory exists
if (!fs.existsSync('./uploads/messages')) {
  fs.mkdirSync('./uploads/messages', { recursive: true });
}

app.use(express.json());

/**
 * Mock Auth Middleware
 * In a real app, this would be your 'protect' middleware
 */
app.use((req, res, next) => {
  // Simulate logged in user
  req.user = {
    _id: new mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
    userName: 'currentUser',
  };
  next();
});

// Register messaging routes
app.use('/api/messages', messageRoutes);

// Example to start the server
/*
mongoose.connect('your_mongodb_uri').then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});
*/

module.exports = app;
