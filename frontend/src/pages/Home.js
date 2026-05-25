import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const panelLink = user?.role === 'admin'    ? '/admin'
                  : user?.role === 'author'   ? '/author'
                  : user?.role === 'reviewer' ? '/reviewer'
                  : null;

  return (
    <>
      <div className="hero">
        <h1>📄 Thesis Submission System</h1>
        <p>A complete platform for submitting, reviewing, and managing academic papers</p>
        <div className="hero-btns">
          {user ? (
            <Link to={panelLink} className="btn btn-primary" style={{background:'#fff', color:'#1a237e'}}>
              Go to My Panel →
            </Link>
          ) : (
            <>
              <Link to="/login"    className="btn" style={{background:'#fff',color:'#1a237e'}}>Login</Link>
              <Link to="/register" className="btn" style={{background:'rgba(255,255,255,0.2)',color:'#fff',border:'2px solid rgba(255,255,255,0.6)'}}>Register</Link>
            </>
          )}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px,1fr))', gap:'1.5rem'}}>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:'2.5rem'}}>✍️</div>
          <h3 style={{marginTop:'0.5rem', color:'#1a237e'}}>Submit Thesis</h3>
          <p style={{color:'#666', marginTop:'0.5rem', fontSize:'0.9rem'}}>Authors can submit research papers in PDF or DOCX format</p>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:'2.5rem'}}>🔍</div>
          <h3 style={{marginTop:'0.5rem', color:'#1a237e'}}>Peer Review</h3>
          <p style={{color:'#666', marginTop:'0.5rem', fontSize:'0.9rem'}}>Expert reviewers evaluate submissions and provide detailed feedback</p>
        </div>
        <div className="card" style={{textAlign:'center'}}>
          <div style={{fontSize:'2.5rem'}}>📊</div>
          <h3 style={{marginTop:'0.5rem', color:'#1a237e'}}>Track Status</h3>
          <p style={{color:'#666', marginTop:'0.5rem', fontSize:'0.9rem'}}>Authors can track their paper status in real time</p>
        </div>
      </div>
    </>
  );
}
