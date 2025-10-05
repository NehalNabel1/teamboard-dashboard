
// Import Member model and mongoose for database operations
const Member = require('../model/memberSchema');
const mongoose = require('mongoose');

// Render home page
const member_home_get = (req, res) => {
    res.render('home', { title: 'home' });
};

// Render add member form with empty input
const member_add_get = (req, res) => {
    res.render('add', { title: 'add', oldInput: {} });
};

// Render edit form for a specific member by ID
const member_edit_get = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        res.render('edit', { title: 'edit', member, oldInput: {} });
    } catch {
        res.status(400).send('Error in update member');
    }
};

// Display all members
const member_display_get = async (req, res) => {
    try {
        const members = await Member.find({});
        res.render('display', { title: 'display', members });
    } catch (err) {
        res.status(400).send('Error in display members');
    }
};

// Delete a member by ID
const member_delete_post = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.redirect('/team/display');
    } catch {
        res.status(500).send('Error in Delete member');
    }
};

// View a single member's profile
const member_view_get = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        res.render('view', { title: 'view', member });
    } catch {
        res.status(500).send('Error in view member');
    }
};

// Render search page with empty results
const member_search_get = async (req, res) => {
    res.render('search', { title: 'search', members: [] });
};

// Handle search form submission and return matching members
const member_search_post = async (req, res) => {
    try {
        const search = req.body.name?.trim();
        const members = await Member.find({ name: { $regex: search, $options: 'i' } });
        res.render('search', { title: 'search', members });
    } catch {
        res.status(400).send('Error in searching');
    }
};

// Handle member edit form submission
const member_edit_post = async (req, res) => {
    try {
        const { name, age, uni, email, phone, tech, img } = req.body;
        const updateData = {};

        // Find current member to compare old data
        const currentMember = await Member.findById(req.params.id);
        if (!currentMember) {
            return res.status(404).send('Member not found');
        }

        // Update only changed fields
        if (name && name !== currentMember.name) updateData.name = name;
        if (age && age !== currentMember.age) updateData.age = age;
        if (uni && uni !== currentMember.uni) updateData.uni = uni;
        if (phone && phone !== currentMember.phone) updateData.phone = phone;
        if (tech && tech !== currentMember.tech) updateData.tech = tech;

        // Check for email uniqueness
        if (email && email !== currentMember.email) {
            const exitEmail = await Member.findOne({ email: email, _id: { $ne: req.params.id } });
            if (exitEmail) {
                return res.render('edit', {
                    title: 'Edit',
                    error: 'Email already exist',
                    oldInput: req.body,
                    member: currentMember
                });
            }
            updateData.email = email;
        }

        // Handle image upload
        if (req.file) {
            updateData.img = '/profile_pics/' + req.file.filename;
        }

        // If no changes, redirect
        if (Object.keys(updateData).length === 0) {
            return res.redirect('/team/display');
        }

        // Apply updates
        await Member.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/team/display');
    } catch {
        res.status(400).send('Error in update member');
    }
};

// Handle new member form submission
const member_add_post = async (req, res) => {
    try {
        console.log('Form Data:', req.body);
        console.log('Img info:', req.file);

        // Check for duplicate email
        const exitEmail = await Member.findOne({ email: req.body.email });
        if (exitEmail) {
            return res.render('add', {
                title: 'add',
                error: 'Email already exist',
                oldInput: req.body
            });
        }

        // Build member data object
        const memberData = {
            name: req.body.name,
            age: req.body.age,
            uni: req.body.uni,
            email: req.body.email,
            phone: req.body.phone,
            tech: req.body.tech,
            img: req.file ? '/profile_pics/' + req.file.filename : null
        };

        // Save new member
        const member = new Member(memberData);
        await member.save();
        console.log('Member added successfully');

        res.render('add', {
            title: 'add',
            success: 'Member added successfully',
            oldInput: {}
        });
    } catch (err) {
        console.error('Error in create new member', err.message);
        res.status(400).send('Error in create new member');
    }
};

// Export all controller functions
module.exports = {
    member_home_get,
    member_add_post,
    member_add_get,
    member_display_get,
    member_delete_post,
    member_view_get,
    member_edit_get,
    member_edit_post,
    member_search_get,
    member_search_post
};
