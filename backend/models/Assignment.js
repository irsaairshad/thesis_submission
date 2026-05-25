const mongoose = require('mongoose');

// ── Assignment schema (same as Python Assignment model) ───────
const AssignmentSchema = new mongoose.Schema({
  paper_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  reviewer_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  assigned_date: { type: Date, default: Date.now },
  status:        { type: String, enum: ['Assigned', 'Completed'], default: 'Assigned' }
}, { timestamps: true });

// ── Review schema (same as Python Review model) ───────────────
const ReviewSchema = new mongoose.Schema({
  paper_id:             { type: mongoose.Schema.Types.ObjectId, ref: 'Paper',      required: true },
  reviewer_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
  assignment_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  decision:             { type: String, enum: ['Accepted', 'Rejected', 'Accept with Revision'], required: true },
  report:               { type: String, required: true },
  rejection_reasons:    { type: String },
  report_submitted_date:{ type: Date, default: Date.now }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', AssignmentSchema);
const Review     = mongoose.model('Review',     ReviewSchema);

module.exports = { Assignment, Review };
