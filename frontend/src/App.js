import React, { useState, useEffect } from 'react';
import DashboardNew from './components/DashboardNew';
import Signup from './components/Signup';

function Login({ onLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            const userData = { email: user.email, name: user.email.split('@')[0] };
            localStorage.setItem('user', JSON.stringify(userData));
            onLogin(userData);
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #1a2a3a 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74,144,226,0.2), transparent)',
                top: '-100px',
                left: '-100px',
                animation: 'float 20s ease-in-out infinite'
            }}></div>
            <div style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74,144,226,0.15), transparent)',
                bottom: '-50px',
                right: '-50px',
                animation: 'float 15s ease-in-out infinite reverse'
            }}></div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -20px) scale(1.1); }
                }
            `}</style>

            <div style={{
                width: '520px',
                height: '520px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #4a90e2, #1e3a8a, #0f2b5c)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
                textAlign: 'center',
                padding: '60px 50px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '52px', fontWeight: '800', color: 'white', marginBottom: '12px' }}>ProGit</div>
                <div style={{ fontSize: '28px', fontWeight: '500', color: 'white', marginBottom: '35px' }}>Sign in</div>

                {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={{ width: '100%', marginBottom: '22px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', textTransform: 'uppercase' }}>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                fontSize: '15px',
                                border: 'none',
                                borderRadius: '12px',
                                outline: 'none',
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                color: 'white',
                            }}
                            required
                        />
                    </div>

                    <div style={{ width: '100%', marginBottom: '22px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                fontSize: '15px',
                                border: 'none',
                                borderRadius: '12px',
                                outline: 'none',
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                color: 'white',
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'white',
                            color: '#1e3a8a',
                            fontSize: '16px',
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            marginTop: '15px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Sign in
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToSignup();
                        }} 
                        style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
                    >
                        Create Account
                    </a>
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
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    const handleNavigate = (page) => {
        console.log('Navigate to:', page);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0f1e, #0d1b2a)'
            }}>
                <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
            </div>
        );
    }

    if (!user) {
        if (showSignup) {
            return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
        }
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
    }
    
    return <DashboardNew user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;
