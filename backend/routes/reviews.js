const express  = require('express');
const router   = express.Router();
const Paper    = require('../models/Paper');
const { Assignment, Review } = require('../models/Assignment');
const { protect, requireRole } = require('../middleware/auth');

// ── GET /api/reviews/my-assignments ──────────────────────────
// Reviewer sees their assigned papers (same as Flask reviewer_panel)
router.get('/my-assignments', protect, requireRole('reviewer'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ reviewer_id: req.user._id })
      .populate('paper_id', 'title abstract keywords paper_type status upload_date')
      .sort({ assigned_date: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// ── POST /api/reviews/submit/:assignment_id ───────────────────
// Reviewer submits a review (same as Flask submit_review route)
router.post('/submit/:assignment_id', protect, requireRole('reviewer'), async (req, res) => {
  try {
    const { decision, report, rejection_reasons } = req.body;
    const assignment = await Assignment.findById(req.params.assignment_id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Only the assigned reviewer can submit (same as Flask check)
    if (assignment.reviewer_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to review this paper' });
    }

    // Already completed check (same as Flask check)
    if (assignment.status !== 'Assigned') {
      return res.status(400).json({ message: 'This assignment has already been completed' });
    }

    if (!decision || !report) {
      return res.status(400).json({ message: 'Decision and report are required' });
    }

    // Create review
    const review = await Review.create({
      paper_id:             assignment.paper_id,
      reviewer_id:          req.user._id,
      assignment_id:        assignment._id,
      decision,
      report,
      rejection_reasons:    ['Rejected', 'Accept with Revision'].includes(decision) ? rejection_reasons : null,
      report_submitted_date: new Date()
    });

    // Update assignment status
    assignment.status = 'Completed';
    await assignment.save();

    // Update paper status (same as Flask logic)
    let newStatus;
    if (decision === 'Accepted')               newStatus = 'Accepted';
    else if (decision === 'Rejected')          newStatus = 'Rejected';
    else if (decision === 'Accept with Revision') newStatus = 'Accepted with Revision';

    await Paper.findByIdAndUpdate(assignment.paper_id, { status: newStatus });

    res.status(201).json({ message: 'Review submitted successfully!', review });
  } catch (err) {
    console.error('Review submit error:', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router;
