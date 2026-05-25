import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '', gmail: '', password: '', confirmPassword: '', role: '',
    // Author fields
    address: '', phone_no: '', university_name: '', blood_group: '',
    // Reviewer fields
    qualification: '', specialization: '', max_papers: 5
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!form.role) return setError('Please select a role');

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data.user, res.data.token);

      const role = res.data.user.role;
      if      (role === 'author')   navigate('/author');
      else if (role === 'reviewer') navigate('/reviewer');
      else                          navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{maxWidth:'650px'}}>
      <div className="card">
        <h2>📝 Create Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* ── Basic Info ── */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="gmail" placeholder="email@example.com" value={form.gmail} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">-- Select Role --</option>
              <option value="author">Author</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          {/* ── Author Fields ── */}
          {form.role === 'author' && (
            <>
              <hr style={{margin:'1rem 0', borderColor:'#e0e0e0'}} />
              <p style={{color:'#1a237e', fontWeight:600, marginBottom:'1rem'}}>Author Information</p>
              <div className="form-group">
                <label>Address *</label>
                <input name="address" placeholder="Your address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone_no" placeholder="e.g. 0300-1234567" value={form.phone_no} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Blood Group *</label>
                  <select name="blood_group" value={form.blood_group} onChange={handleChange} required>
                    <option value="">-- Select --</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>University Name *</label>
                <input name="university_name" placeholder="e.g. COMSATS University Islamabad" value={form.university_name} onChange={handleChange} required />
              </div>
            </>
          )}

          {/* ── Reviewer Fields ── */}
          {form.role === 'reviewer' && (
            <>
              <hr style={{margin:'1rem 0', borderColor:'#e0e0e0'}} />
              <p style={{color:'#1a237e', fontWeight:600, marginBottom:'1rem'}}>Reviewer Information</p>
              <div className="form-group">
                <label>Address *</label>
                <input name="address" placeholder="Your address" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Qualification *</label>
                  <input name="qualification" placeholder="e.g. PhD Computer Science" value={form.qualification} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Specialization *</label>
                  <input name="specialization" placeholder="e.g. Machine Learning" value={form.specialization} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Max Papers (how many papers can you review at once?)</label>
                <input type="number" name="max_papers" min="1" max="20" value={form.max_papers} onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'0.5rem'}} disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
