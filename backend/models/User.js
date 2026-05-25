const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Author sub-schema (same as Python Author model) ──────────
const AuthorSchema = new mongoose.Schema({
  address:         { type: String, required: true },
  phone_no:        { type: String },
  university_name: { type: String, required: true },
  blood_group:     { type: String, required: true }
});

// ── Reviewer sub-schema (same as Python Reviewer model) ──────
const ReviewerSchema = new mongoose.Schema({
  address:        { type: String, required: true },
  qualification:  { type: String, required: true },
  specialization: { type: String, required: true },
  max_papers:     { type: Number, default: 5 }
});

// ── Main User schema (same as Python User model) ─────────────
const UserSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  gmail:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash:     { type: String, required: true },
  role:              { type: String, enum: ['admin', 'author', 'reviewer'], required: true },
  registration_date: { type: Date, default: Date.now },

  // Embedded profile based on role
  author_profile:   AuthorSchema,
  reviewer_profile: ReviewerSchema
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// Method to check password
UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);
