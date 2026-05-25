const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────
// Same logic as Flask register route
router.post('/register', async (req, res) => {
  try {
    const { name, gmail, password, role,
            address, phone_no, university_name, blood_group,
            qualification, specialization, max_papers } = req.body;

    // Check required fields
    if (!name || !gmail || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    // Check if email already exists
    const existing = await User.findOne({ gmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Build user object
    const userData = { name, gmail, password_hash: password, role };

    // Add role-specific profile
    if (role === 'author') {
      if (!address || !university_name || !blood_group) {
        return res.status(400).json({ message: 'Address, university name and blood group are required for authors' });
      }
      userData.author_profile = { address, phone_no, university_name, blood_group };
    }

    if (role === 'reviewer') {
      if (!address || !qualification || !specialization) {
        return res.status(400).json({ message: 'Address, qualification and specialization are required for reviewers' });
      }
      userData.reviewer_profile = {
        address,
        qualification,
        specialization,
        max_papers: max_papers || 5
      };
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: 'Registration successful!',
      token: generateToken(user._id),
      user: {
        _id:  user._id,
        name: user.name,
        gmail: user.gmail,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
// Same logic as Flask login route
router.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ gmail });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: {
        _id:  user._id,
        name: user.name,
        gmail: user.gmail,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
