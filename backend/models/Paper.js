const mongoose = require('mongoose');

// ── Paper schema (same as Python Paper model) ─────────────────
const PaperSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  abstract:    { type: String, required: true },
  keywords:    { type: String, required: true },
  paper_type:  { type: String, enum: ['full', 'short', 'poster'], required: true },
  file_path:   { type: String, required: true },
  author_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      {
    type: String,
    enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Accepted with Revision'],
    default: 'Submitted'
  },
  upload_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Paper', PaperSchema);
