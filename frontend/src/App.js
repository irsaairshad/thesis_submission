import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import AdminPanel   from './pages/AdminPanel';
import AuthorPanel  from './pages/AuthorPanel';
import ReviewerPanel from './pages/ReviewerPanel';
import SubmitThesis from './pages/SubmitThesis';
import CheckStatus  from './pages/CheckStatus';
import CheckUsers   from './pages/CheckUsers';
import ViewPaper    from './pages/ViewPaper';

// Protected Route component
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          <Route path="/admin"   element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>} />
          <Route path="/author"  element={<PrivateRoute roles={['author']}><AuthorPanel /></PrivateRoute>} />
          <Route path="/reviewer" element={<PrivateRoute roles={['reviewer']}><ReviewerPanel /></PrivateRoute>} />

          <Route path="/submit-thesis" element={<PrivateRoute roles={['author']}><SubmitThesis /></PrivateRoute>} />
          <Route path="/check-status"  element={<PrivateRoute roles={['author']}><CheckStatus /></PrivateRoute>} />
          <Route path="/check-users"   element={<PrivateRoute roles={['admin']}><CheckUsers /></PrivateRoute>} />
          <Route path="/view-paper/:id" element={<PrivateRoute><ViewPaper /></PrivateRoute>} />

          <Route path="*" element={<div className="not-found"><h2>404 - Page Not Found</h2></div>} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
