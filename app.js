
// MongoDB connection string 
const dbUrl = "mongodb+srv://nehal64_db_user:nodejs1234@learn-mongo-db.mni8wuc.mongodb.net/Courses?retryWrites=true&w=majority&appName=learn-mongo-db";

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect(dbUrl)
  .then(() => console.log('connected to the db')) // Success message
  .catch(err => console.error('Error connected to db:', err)); // Error handling

// Import member-related routes
const memberRoutes = require('./routes/member');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Parse URL-encoded data from HTML forms
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON requests
app.use(express.json());

// Mount member routes under "/team" path
app.use('/team', memberRoutes);

// Handle 404 errors for unmatched routes
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Start the server on port 4000
app.listen(4000, () => {
  console.log('server is listening on port 4000');
});
