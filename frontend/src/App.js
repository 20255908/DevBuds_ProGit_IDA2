import React, { useState, useEffect } from 'react';
import './App.css';

function Login({ onLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userData = { 
                email: user.email, 
                name: user.fullName || user.email.split('@')[0],
                fullName: user.fullName 
            };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            onLogin(userData);
        } else {
            setError('Invalid credentials. Please create an account first.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>ProGit</h1>
                <h2>Sign In</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Create Account</a></p>
            </div>
        </div>
    );
}

function Signup({ onSwitchToLogin }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!fullName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            setError('User already exists. Please sign in.');
            return;
        }

        users.push({ fullName, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
            onSwitchToLogin();
        }, 2000);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>ProGit</h1>
                <h2>Create Account</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="submit">Create Account</button>
                </form>
                <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Sign In</a></p>
            </div>
        </div>
    );
}

function Dashboard({ user, onLogout }) {
    const getUserInitials = () => {
        if (user?.fullName) {
            const nameParts = user.fullName.split(' ');
            if (nameParts.length >= 2) {
                return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
            }
            return user.fullName.substring(0, 2).toUpperCase();
        }
        if (user?.name) {
            return user.name.substring(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'JD';
    };

    const getDisplayName = () => {
        if (user?.fullName) return user.fullName;
        if (user?.name) return user.name;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    const getFirstName = () => {
        if (user?.fullName) return user.fullName.split(' ')[0];
        if (user?.name) return user.name.split(' ')[0];
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    const initials = getUserInitials();
    const displayName = getDisplayName();
    const firstName = getFirstName();

    const projects = [
        { id: 1, name: 'Website Redesign', description: 'Redesign the landing page UI and UX flows for Q3 launch.' },
        { id: 2, name: 'API Integration', description: 'Connect payment gateway and third-party API services.' },
        { id: 3, name: 'Mobile App', description: 'React Native app — sprint 2 in progress.' },
        { id: 4, name: 'Data Pipeline', description: 'ETL pipeline for analytics dashboard ingestion.' }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="greeting">
                        <h1>Dashboard</h1>
                        <p>Welcome back, {firstName}. Here's what's happening with your projects.</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar">{initials}</div>
                        <div className="user-info">
                            <span>{displayName}</span>
                            <small>Product Studio</small>
                        </div>
                        <button className="logout-btn" onClick={onLogout}>Logout</button>
                    </div>
                </div>
                <div className="section-title">
                    <h2>My Projects</h2>
                </div>
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-title">
                                <h3>{project.name}</h3>
                                <span className="status-badge">Active</span>
                            </div>
                            <div className="project-description">
                                {project.description}
                            </div>
                            <div className="card-footer">
                                <span className="active-tag">● Active</span>
                                <a href="#" className="view-link">View →</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        if (showSignup) {
            return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
        }
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
    }
    
    return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
