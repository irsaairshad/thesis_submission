const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const Paper      = require('../models/Paper');
const { Assignment } = require('../models/Assignment');
const { protect, requireRole } = require('../middleware/auth');

// ── GET /api/admin/reviewers ─────────────────────────────────
// Get all reviewers (used in admin panel dropdown)
router.get('/reviewers', protect, requireRole('admin'), async (req, res) => {
  try {
    const reviewers = await User.find({ role: 'reviewer' }, 'name gmail reviewer_profile');
    res.json(reviewers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviewers' });
  }
});

// ── POST /api/admin/assign ───────────────────────────────────
// Assign a reviewer to a paper (same as Flask assign_reviewer route)
router.post('/assign', protect, requireRole('admin'), async (req, res) => {
  try {
    const { paper_id, reviewer_id } = req.body;

    if (!paper_id || !reviewer_id) {
      return res.status(400).json({ message: 'Paper ID and Reviewer ID are required' });
    }

    const paper    = await Paper.findById(paper_id);
    const reviewer = await User.findOne({ _id: reviewer_id, role: 'reviewer' });

    if (!paper)    return res.status(404).json({ message: 'Paper not found' });
    if (!reviewer) return res.status(404).json({ message: 'Reviewer not found' });

    // Check max papers limit (same as Flask logic)
    const activeCount = await Assignment.countDocuments({ reviewer_id, status: 'Assigned' });
    const maxPapers   = reviewer.reviewer_profile?.max_papers || 5;
    if (activeCount >= maxPapers) {
      return res.status(400).json({
        message: `Reviewer ${reviewer.name} has reached the maximum number of active assignments (${maxPapers})`
      });
    }

    // Check if already assigned (same as Flask logic)
    const existing = await Assignment.findOne({ paper_id, reviewer_id });
    if (existing) {
      return res.status(400).json({ message: 'This paper is already assigned to this reviewer' });
    }

    const assignment = await Assignment.create({
      paper_id,
      reviewer_id,
      assigned_date: new Date(),
      status: 'Assigned'
    });

    // Update paper status to Under Review
    await Paper.findByIdAndUpdate(paper_id, { status: 'Under Review' });

    res.status(201).json({ message: 'Reviewer assigned successfully!', assignment });
  } catch (err) {
    console.error('Assign error:', err);
    res.status(500).json({ message: 'Error assigning reviewer' });
  }
});

// ── GET /api/admin/users ─────────────────────────────────────
// List all users with search (same as Flask check_users route)
router.get('/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const search = req.query.search || '';
    const query  = search
      ? { $or: [
          { name:  { $regex: search, $options: 'i' } },
          { gmail: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const users = await User.find(query)
      .select('-password_hash')
      .sort({ registration_date: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
