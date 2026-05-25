const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const Paper    = require('../models/Paper');
const { protect, requireRole } = require('../middleware/auth');

// ── Multer Setup (same as Flask UPLOAD_FOLDER) ────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF and DOCX files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 16 * 1024 * 1024 } }); // 16MB

// ── POST /api/papers/submit ───────────────────────────────────
// Author submits a thesis (same as Flask submit_thesis route)
router.post('/submit', protect, requireRole('author'), upload.single('file'), async (req, res) => {
  try {
    const { title, abstract, keywords, paper_type } = req.body;

    if (!req.file) return res.status(400).json({ message: 'File is required (PDF or DOCX)' });
    if (!title || !abstract || !keywords || !paper_type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Max 5 keywords (same as Flask logic)
    const keywordList = keywords.split(',').slice(0, 5).map(k => k.trim()).join(', ');

    const paper = await Paper.create({
      title,
      abstract,
      keywords: keywordList,
      paper_type,
      file_path: req.file.filename,
      author_id: req.user._id,
      status: 'Submitted',
      upload_date: new Date()
    });

    res.status(201).json({ message: 'Thesis submitted successfully!', paper });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ message: err.message || 'Error submitting thesis' });
  }
});

// ── GET /api/papers/my ───────────────────────────────────────
// Author views their own papers (same as Flask author_panel route)
router.get('/my', protect, requireRole('author'), async (req, res) => {
  try {
    const papers = await Paper.find({ author_id: req.user._id }).sort({ upload_date: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching papers' });
  }
});

// ── GET /api/papers/status ────────────────────────────────────
// Author checks status (same as Flask check_status route)
router.get('/status', protect, requireRole('author'), async (req, res) => {
  try {
    const papers = await Paper.find({ author_id: req.user._id }).sort({ upload_date: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching status' });
  }
});

// ── GET /api/papers/all ───────────────────────────────────────
// Admin views all papers (same as Flask admin_panel route)
router.get('/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate('author_id', 'name gmail author_profile')
      .sort({ upload_date: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all papers' });
  }
});

// ── GET /api/papers/:id ───────────────────────────────────────
// View single paper details (same as Flask view_paper route)
router.get('/:id', protect, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('author_id', 'name gmail');
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json(paper);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching paper' });
  }
});

// ── GET /api/papers/download/:id ─────────────────────────────
// Download paper file (same as Flask download_paper route)
router.get('/download/:id', protect, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    const filePath = path.join(__dirname, '../uploads', paper.file_path);
    res.download(filePath, paper.file_path);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading file' });
  }
});

module.exports = router;
