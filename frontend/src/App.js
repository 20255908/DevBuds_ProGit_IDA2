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
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.fullName?.split(' ')[0] || user?.name || 'User'}!</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="dashboard-content">
                <p>Your dashboard content goes here.</p>
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
