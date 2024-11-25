const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Make sure this path is correct

// Registration route
// Registration route
router.post("/register", async (req, res) => {
    const { userId, name, email, password, nickname, gender, birthday, profileImage } = req.body;
    const newUser = new User({ userId, name, email, password, nickname, gender, birthday, profileImage });

    try {
        await newUser.save();
        res.send('User registered successfully');
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

// In your routes file (e.g., userRoutes.js)
router.get('/checkuser/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userExists = await User.findOne({ userId });
        res.json({ exists: !!userExists });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check user ID' });
    }
});

// Get user details by ID
router.get('/getuserbyid/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId); // Find user by ID
        if (user) {
            res.json(user); // Send the user data back to the client
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error fetching user details' });
    }
});

// DELETE user by ID
router.delete('/deleteuser/:id', (req, res) => {
    const { id } = req.params;
    
    User.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete user' });
        });
});

router.put("/update", async (req, res) => {
    const { userId, name, email, password, nickname, gender, birthday, profileImage } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, password, nickname, gender, birthday, profileImage },  // Add profileImage here
            { new: true }
        );

        if (updatedUser) {
            res.json({ message: 'Profile updated successfully', user: updatedUser });
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating profile' });
    }
});

// Login route
router.post("/login", async (req, res) => {
    console.log("Request body:", req.body); // Log the request body
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user.id,
            };

            res.send(user);
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get all users route
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users); // Send the list of users as the response
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch users' });
    }
});

// Update user profile route
router.put("/update", async (req, res) => {
    const { userId, name, email, password, nickname, gender, birthday } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, password, nickname, gender, birthday },
            { new: true }
        );

        if (updatedUser) {
            res.json({ message: 'Profile updated successfully', user: updatedUser });
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating profile' });
    }
});

module.exports = router;
