import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    // Get logged in user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    
    setUser(currentUser);
    
    // Generate initials from full name or email
    let initials = '';
    if (currentUser.fullName) {
      const nameParts = currentUser.fullName.split(' ');
      if (nameParts.length >= 2) {
        initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
      } else {
        initials = currentUser.fullName.substring(0, 2).toUpperCase();
      }
    } else if (currentUser.email) {
      initials = currentUser.email.substring(0, 2).toUpperCase();
    } else {
      initials = 'JD';
    }
    setUserInitials(initials.toUpperCase());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  // Get display name (full name or email username)
  const displayName = user.fullName || user.email?.split('@')[0] || 'User';
  
  // Get first name for greeting
  const firstName = user.fullName ? user.fullName.split(' ')[0] : displayName;

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="greeting">
            <h1>Dashboard</h1>
            <p>Welcome back, {firstName}. Here's what's happening with your projects.</p>
          </div>
          <div className="user-profile">
            <div className="avatar">{userInitials}</div>
            <div className="user-info">
              <span>{displayName}</span>
              <small>Product Studio</small>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="section-title">
          <h2>My Projects</h2>
          <a href="#">View all →</a>
        </div>

        <div className="projects-grid">
          <div className="project-card">
            <div className="project-title">
              <h3>Website Redesign</h3>
              <span className="status-badge">Active</span>
            </div>
            <div className="project-description">
              Redesign the landing page UI and UX flows for Q3 launch.
            </div>
            <div className="card-footer">
              <span className="active-tag">● In Progress</span>
              <a href="#" className="view-link">View →</a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-title">
              <h3>API Integration</h3>
              <span className="status-badge">Active</span>
            </div>
            <div className="project-description">
              Connect payment gateway and third-party API services.
            </div>
            <div className="card-footer">
              <span className="active-tag">● In Progress</span>
              <a href="#" className="view-link">View →</a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-title">
              <h3>Mobile App</h3>
              <span className="status-badge">Active</span>
            </div>
            <div className="project-description">
              React Native mobile app — sprint 2 in progress.
            </div>
            <div className="card-footer">
              <span className="active-tag">● In Progress</span>
              <a href="#" className="view-link">View →</a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-title">
              <h3>Data Pipeline</h3>
              <span className="status-badge">Active</span>
            </div>
            <div className="project-description">
              ETL pipeline for analytics dashboard ingestion.
            </div>
            <div className="card-footer">
              <span className="active-tag">● In Progress</span>
              <a href="#" className="view-link">View →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
