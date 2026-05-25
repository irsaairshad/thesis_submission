const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// ── PUT /api/users/update-info ────────────────────────────────
// Update personal info (same as Flask update_personal_info route)
router.put('/update-info', protect, async (req, res) => {
  try {
    const { name, address, phone_no, university_name, blood_group, qualification, specialization } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;

    if (user.role === 'author' && user.author_profile) {
      if (address)         user.author_profile.address         = address;
      if (phone_no)        user.author_profile.phone_no        = phone_no;
      if (university_name) user.author_profile.university_name = university_name;
      if (blood_group)     user.author_profile.blood_group     = blood_group;
    }

    if (user.role === 'reviewer' && user.reviewer_profile) {
      if (address)        user.reviewer_profile.address        = address;
      if (qualification)  user.reviewer_profile.qualification  = qualification;
      if (specialization) user.reviewer_profile.specialization = specialization;
    }

    user.markModified('author_profile');
    user.markModified('reviewer_profile');
    await user.save();

    res.json({ message: 'Profile updated successfully!', user });
  } catch (err) {
    console.error('Update info error:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
