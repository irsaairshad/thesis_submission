import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusBadge = s => {
  const map = { 'Submitted':'badge-submitted','Under Review':'badge-review',
    'Accepted':'badge-accepted','Rejected':'badge-rejected','Accepted with Revision':'badge-revision' };
  return <span className={`badge ${map[s]||''}`} style={{fontSize:'1rem',padding:'5px 14px'}}>{s}</span>;
};

export default function ViewPaper() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [paper,   setPaper]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/papers/${id}`)
      .then(res => setPaper(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading paper details...</div>;
  if (!paper)  return <div className="not-found"><h2>Paper not found</h2></div>;

  return (
    <>
      <h1 className="page-title">📄 Paper Details</h1>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem'}}>
          <div>
            <h2 style={{color:'#1a237e', marginBottom:'0.5rem'}}>{paper.title}</h2>
            <p style={{color:'#666', fontSize:'0.9rem'}}>
              Submitted by: <strong>{paper.author_id?.name || 'N/A'}</strong>
            </p>
          </div>
          <div>{statusBadge(paper.status)}</div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>
          <div>
            <p><strong>Paper Type:</strong> <span style={{textTransform:'capitalize'}}>{paper.paper_type}</span></p>
            <p style={{marginTop:'0.5rem'}}><strong>Keywords:</strong> {paper.keywords}</p>
          </div>
          <div>
            <p><strong>Submitted On:</strong> {new Date(paper.upload_date).toLocaleString()}</p>
          </div>
        </div>

        <div style={{background:'#f8f9ff', borderRadius:'8px', padding:'1.2rem', marginBottom:'1.5rem'}}>
          <h4 style={{color:'#1a237e', marginBottom:'0.8rem'}}>Abstract</h4>
          <p style={{lineHeight:'1.8', color:'#444'}}>{paper.abstract}</p>
        </div>

        <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
          <a href={`/api/papers/download/${paper._id}`} className="btn btn-primary" download>
            ⬇️ Download Paper
          </a>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">← Go Back</button>
        </div>
      </div>
    </>
  );
}
