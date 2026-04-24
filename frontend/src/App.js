import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Visas from './pages/Visas';
import Deadlines from './pages/Deadlines';
import Billing from './pages/Billing';
import Notes from './pages/Notes';
import Forms from './pages/Forms';
import Compliance from './pages/Compliance';
import StatusTracking from './pages/StatusTracking';
import AIFeatures from './pages/AIFeatures';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/visas" element={<Visas />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/status-tracking" element={<StatusTracking />} />
          <Route path="/ai" element={<AIFeatures />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
