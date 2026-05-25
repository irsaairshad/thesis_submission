import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusBadge = s => {
  const map = {
    'Submitted':'badge-submitted','Under Review':'badge-review',
    'Accepted':'badge-accepted','Rejected':'badge-rejected','Accepted with Revision':'badge-revision'
  };
  return <span className={`badge ${map[s]||''}`}>{s}</span>;
};

export default function AdminPanel() {
  const [papers,    setPapers]    = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selected,  setSelected]  = useState({});   // { paperId: reviewerId }
  const [msg,       setMsg]       = useState({ type:'', text:'' });
  const [loading,   setLoading]   = useState(true);

  const fetchData = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        axios.get('/api/papers/all'),
        axios.get('/api/admin/reviewers')
      ]);
      setPapers(pRes.data);
      setReviewers(rRes.data);
    } catch { setMsg({ type:'danger', text:'Failed to load data' }); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (paperId) => {
    const reviewerId = selected[paperId];
    if (!reviewerId) return setMsg({ type:'warning', text:'Please select a reviewer first' });

    try {
      const res = await axios.post('/api/admin/assign', { paper_id: paperId, reviewer_id: reviewerId });
      setMsg({ type:'success', text: res.data.message });
      fetchData();
    } catch (err) {
      setMsg({ type:'danger', text: err.response?.data?.message || 'Assignment failed' });
    }
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <>
      <h1 className="page-title">🛠️ Admin Panel</h1>
      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div style={{display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap'}}>
        <div className="card" style={{flex:1, minWidth:'150px', textAlign:'center'}}>
          <div style={{fontSize:'2rem', color:'#1a237e'}}>{papers.length}</div>
          <div style={{color:'#666'}}>Total Papers</div>
        </div>
        <div className="card" style={{flex:1, minWidth:'150px', textAlign:'center'}}>
          <div style={{fontSize:'2rem', color:'#2e7d32'}}>{papers.filter(p=>p.status==='Accepted').length}</div>
          <div style={{color:'#666'}}>Accepted</div>
        </div>
        <div className="card" style={{flex:1, minWidth:'150px', textAlign:'center'}}>
          <div style={{fontSize:'2rem', color:'#e65100'}}>{papers.filter(p=>p.status==='Submitted').length}</div>
          <div style={{color:'#666'}}>Pending Review</div>
        </div>
        <div className="card" style={{flex:1, minWidth:'150px', textAlign:'center'}}>
          <div style={{fontSize:'2rem', color:'#6a1b9a'}}>{reviewers.length}</div>
          <div style={{color:'#666'}}>Reviewers</div>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
          <h2 style={{color:'#1a237e'}}>All Submissions</h2>
          <Link to="/check-users" className="btn btn-secondary btn-sm">View All Users</Link>
        </div>
        {papers.length === 0 ? (
          <p style={{textAlign:'center', color:'#666', padding:'2rem'}}>No papers submitted yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Author</th><th>Type</th>
                  <th>Status</th><th>Date</th><th>Assign Reviewer</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i+1}</td>
                    <td style={{maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.title}</td>
                    <td>{p.author_id?.name || 'N/A'}</td>
                    <td style={{textTransform:'capitalize'}}>{p.paper_type}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>{new Date(p.upload_date).toLocaleDateString()}</td>
                    <td>
                      <div style={{display:'flex', gap:'6px'}}>
                        <select
                          style={{padding:'5px', borderRadius:'4px', border:'1px solid #ccc', fontSize:'0.85rem'}}
                          value={selected[p._id] || ''}
                          onChange={e => setSelected({...selected, [p._id]: e.target.value})}>
                          <option value="">-- Reviewer --</option>
                          {reviewers.map(r => (
                            <option key={r._id} value={r._id}>
                              {r.name} ({r.reviewer_profile?.specialization})
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-success btn-sm" onClick={() => handleAssign(p._id)}>Assign</button>
                      </div>
                    </td>
                    <td>
                      <Link to={`/view-paper/${p._id}`} className="btn btn-secondary btn-sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
