import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewerPanel() {
  const { user }  = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeForm,  setActiveForm]  = useState(null); // assignment._id
  const [review,      setReview]      = useState({ decision:'', report:'', rejection_reasons:'' });
  const [msg,         setMsg]         = useState({ type:'', text:'' });

  const fetchAssignments = () => {
    axios.get('/api/reviews/my-assignments')
      .then(res => setAssignments(res.data))
      .catch(() => setMsg({ type:'danger', text:'Failed to load assignments' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmitReview = async (assignmentId) => {
    if (!review.decision || !review.report) {
      return setMsg({ type:'warning', text:'Please fill in decision and report' });
    }
    try {
      const res = await axios.post(`/api/reviews/submit/${assignmentId}`, review);
      setMsg({ type:'success', text: res.data.message });
      setActiveForm(null);
      setReview({ decision:'', report:'', rejection_reasons:'' });
      fetchAssignments();
    } catch (err) {
      setMsg({ type:'danger', text: err.response?.data?.message || 'Review submission failed' });
    }
  };

  if (loading) return <div className="loading">Loading assignments...</div>;

  return (
    <>
      <h1 className="page-title">🔍 Reviewer Panel</h1>
      <div className="card">
        <p><strong>Welcome, {user?.name}!</strong></p>
        <p style={{color:'#666', fontSize:'0.9rem'}}>
          Specialization: {user?.reviewer_profile?.specialization} &nbsp;|&nbsp;
          Max Papers: {user?.reviewer_profile?.max_papers}
        </p>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <h2 style={{color:'#1a237e', marginBottom:'1rem'}}>My Assigned Papers</h2>

      {assignments.length === 0 ? (
        <div className="card" style={{textAlign:'center', padding:'3rem', color:'#666'}}>
          <p>No papers assigned to you yet. Please wait for the admin to assign papers.</p>
        </div>
      ) : (
        assignments.map(a => (
          <div key={a._id} className="card" style={{marginBottom:'1rem'}}>
            <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
              <div>
                <h3 style={{color:'#1a237e', marginBottom:'0.3rem'}}>{a.paper_id?.title}</h3>
                <p style={{color:'#666', fontSize:'0.85rem'}}>
                  Type: <strong style={{textTransform:'capitalize'}}>{a.paper_id?.paper_type}</strong> &nbsp;|&nbsp;
                  Assigned: <strong>{new Date(a.assigned_date).toLocaleDateString()}</strong> &nbsp;|&nbsp;
                  Status: <span className={`badge ${a.status==='Completed'?'badge-accepted':'badge-review'}`}>{a.status}</span>
                </p>
                <p style={{color:'#555', fontSize:'0.88rem', marginTop:'0.4rem'}}><strong>Keywords:</strong> {a.paper_id?.keywords}</p>
              </div>
            </div>

            {/* Abstract preview */}
            <details style={{marginTop:'0.8rem'}}>
              <summary style={{cursor:'pointer', color:'#3949ab', fontSize:'0.9rem'}}>View Abstract</summary>
              <p style={{marginTop:'0.5rem', color:'#555', fontSize:'0.9rem', lineHeight:'1.6'}}>{a.paper_id?.abstract}</p>
            </details>

            {/* Review form */}
            {a.status === 'Assigned' && (
              <div style={{marginTop:'1rem'}}>
                {activeForm === a._id ? (
                  <div style={{background:'#f8f9ff', borderRadius:'8px', padding:'1.2rem', border:'1px solid #e8eaf6'}}>
                    <h4 style={{color:'#1a237e', marginBottom:'1rem'}}>Submit Review</h4>
                    <div className="form-group">
                      <label>Decision *</label>
                      <select value={review.decision} onChange={e => setReview({...review, decision:e.target.value})}>
                        <option value="">-- Select Decision --</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Accept with Revision">Accept with Revision</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Review Report *</label>
                      <textarea placeholder="Write your detailed review report here..."
                        value={review.report} onChange={e => setReview({...review, report:e.target.value})}
                        style={{minHeight:'120px'}} />
                    </div>
                    {['Rejected','Accept with Revision'].includes(review.decision) && (
                      <div className="form-group">
                        <label>Rejection / Revision Reasons</label>
                        <textarea placeholder="Explain the specific reasons..."
                          value={review.rejection_reasons}
                          onChange={e => setReview({...review, rejection_reasons:e.target.value})} />
                      </div>
                    )}
                    <div style={{display:'flex', gap:'1rem'}}>
                      <button className="btn btn-success" onClick={() => handleSubmitReview(a._id)}>Submit Review</button>
                      <button className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => { setActiveForm(a._id); setMsg({type:'',text:''}); }}>
                    ✍️ Submit Review
                  </button>
                )}
              </div>
            )}

            {a.status === 'Completed' && (
              <div className="alert alert-success" style={{marginTop:'0.8rem', marginBottom:0}}>
                ✅ Review submitted successfully
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
