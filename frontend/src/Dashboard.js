import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="greeting">
          <h1>Dashboard</h1>
          <p>Welcome back, john_doe. Here's what's happening.</p>
        </div>
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <span>john_doe</span>
            <small>Product Studio</small>
          </div>
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
            Renaming the landing page UI and UX flows for G3 launch.
          </div>
          <div className="card-footer">
            <span className="active-tag">● Active</span>
            <a href="#" className="view-link">View →</a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-title">
            <h3>API Integration</h3>
            <span className="status-badge">Active</span>
          </div>
          <div className="project-description">
            Connected payment gateway and third-party audit services.
          </div>
          <div className="card-footer">
            <span className="active-tag">● Active</span>
            <a href="#" className="view-link">View →</a>
          </div>
        </div>

        <div className="project-card">
          <div className="project-title">
            <h3>Mobile App</h3>
            <span className="status-badge">Active</span>
          </div>
          <div className="project-description">
            React Native app — sprint 2 in progress.
          </div>
          <div className="card-footer">
            <span className="active-tag">● Active</span>
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
            <span className="active-tag">● Active</span>
            <a href="#" className="view-link">View →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
