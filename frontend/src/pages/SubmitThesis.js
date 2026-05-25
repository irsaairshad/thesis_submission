import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SubmitThesis() {
  const [form, setForm] = useState({
    title: '', abstract: '', keywords: '', paper_type: ''
  });
  const [file,    setFile]    = useState(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!file) return setError('Please select a PDF or DOCX file');

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) return setError('Only PDF and DOCX files are allowed');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      await axios.post('/api/papers/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Thesis submitted successfully!');
      setTimeout(() => navigate('/author'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="page-title">📤 Submit Thesis</h1>
      <div className="card" style={{maxWidth:'700px', margin:'0 auto'}}>
        {error   && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Paper Title *</label>
            <input name="title" placeholder="Enter the title of your paper" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Abstract *</label>
            <textarea name="abstract" placeholder="Write a brief abstract of your paper..." value={form.abstract} onChange={handleChange} required style={{minHeight:'130px'}} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Keywords * <span style={{fontWeight:'normal', color:'#888'}}>(comma separated, max 5)</span></label>
              <input name="keywords" placeholder="e.g. AI, Machine Learning, NLP" value={form.keywords} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Paper Type *</label>
              <select name="paper_type" value={form.paper_type} onChange={handleChange} required>
                <option value="">-- Select Type --</option>
                <option value="full">Full Paper</option>
                <option value="short">Short Paper</option>
                <option value="poster">Poster</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Upload File * <span style={{fontWeight:'normal', color:'#888'}}>(PDF or DOCX, max 16MB)</span></label>
            <input type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files[0])} required />
          </div>

          <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : '📤 Submit Thesis'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/author')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
