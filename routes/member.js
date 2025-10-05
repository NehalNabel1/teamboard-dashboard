// Import required modules
const express = require('express');
const router = express.Router();
const memberCtlr = require('../controllers/memberController'); // Import member controller functions

const multer = require('multer'); // Middleware for handling file uploads

// Optional basic upload config
// const upload = multer({ dest: '/public/profile_pics' });

// Configure custom storage for uploaded profile images
const storage = multer.diskStorage({
    destination: 'public/profile_pics', // Folder to store uploaded images
    filename: (req, file, cb) => {
        // Rename file with timestamp to avoid conflicts
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with custom storage
const upload = multer({ storage });

/* ---------- GET Routes ---------- */

// Render home page
router.get('/members', memberCtlr.member_home_get);

// Render add member form
router.get('/add', memberCtlr.member_add_get);

// Render search page
router.get('/search', memberCtlr.member_search_get);

// Display all members
router.get('/display', memberCtlr.member_display_get);

// View a specific member profile
router.get('/view/:id', memberCtlr.member_view_get);

// Render edit form for a specific member
router.get('/edit/:id', memberCtlr.member_edit_get);

/* ---------- POST Routes ---------- */

// Handle new member submission with image upload
router.post('/add', upload.single('img'), memberCtlr.member_add_post);

// Handle search form submission
router.post('/search', memberCtlr.member_search_post);

// Handle member edit form submission with optional image upload
router.post('/edit/:id', upload.single('img'), memberCtlr.member_edit_post);

// Handle member deletion
router.post('/display/delete/:id', memberCtlr.member_delete_post);

// Export the router to be used in the main app
module.exports = router;
