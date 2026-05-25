import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CheckUsers() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = (q = '') => {
    setLoading(true);
    axios.get(`/api/admin/users?search=${q}`)
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchUsers(search);
  };

  const roleBadge = role => {
    const map = { admin:'#1a237e', author:'#2e7d32', reviewer:'#e65100' };
    return <span className="badge" style={{background: map[role]+'22', color: map[role]}}>{role}</span>;
  };

  return (
    <>
      <h1 className="page-title">👥 Registered Users</h1>
      <div className="card">
        <form onSubmit={handleSearch} style={{display:'flex', gap:'1rem', marginBottom:'1.5rem'}}>
          <input placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{flex:1, padding:'10px 14px', border:'1px solid #cdd5e0', borderRadius:'6px'}} />
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); fetchUsers(''); }}>Clear</button>
        </form>

        {loading ? <div className="loading">Loading users...</div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Registered On</th></tr>
              </thead>
              <tbody>
                {users.length === 0
                  ? <tr><td colSpan="5" style={{textAlign:'center',color:'#666',padding:'2rem'}}>No users found.</td></tr>
                  : users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i+1}</td>
                      <td>{u.name}</td>
                      <td>{u.gmail}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td>{new Date(u.registration_date).toLocaleDateString()}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
