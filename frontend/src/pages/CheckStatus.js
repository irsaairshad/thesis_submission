// ── CheckStatus.js ────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusBadge = s => {
  const map = { 'Submitted':'badge-submitted','Under Review':'badge-review',
    'Accepted':'badge-accepted','Rejected':'badge-rejected','Accepted with Revision':'badge-revision' };
  return <span className={`badge ${map[s]||''}`}>{s}</span>;
};

export function CheckStatus() {
  const [papers,  setPapers]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/papers/status')
      .then(res => setPapers(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="page-title">📊 Check Paper Status</h1>
      <div className="card">
        {loading ? <div className="loading">Loading...</div> :
         papers.length === 0 ? <p style={{textAlign:'center',color:'#666',padding:'2rem'}}>You haven't submitted any papers yet.</p> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>#</th><th>Title</th><th>Type</th><th>Status</th><th>Submitted On</th><th>Action</th></tr></thead>
              <tbody>
                {papers.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i+1}</td>
                    <td>{p.title}</td>
                    <td style={{textTransform:'capitalize'}}>{p.paper_type}</td>
                    <td>{statusBadge(p.status)}</td>
                    <td>{new Date(p.upload_date).toLocaleDateString()}</td>
                    <td><Link to={`/view-paper/${p._id}`} className="btn btn-secondary btn-sm">View</Link></td>
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

export default CheckStatus;
