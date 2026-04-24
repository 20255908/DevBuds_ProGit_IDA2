import React, { useState } from 'react';

function Signup({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
        
        const userExists = demoUsers.find(u => u.email === email);
        if (userExists) {
            setError('User already exists');
            return;
        }

        demoUsers.push({ email, password });
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => {
            onSwitchToLogin();
        }, 2000);
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
                height: 'auto',
                minHeight: '550px',
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
                <div style={{ fontSize: '28px', fontWeight: '500', color: 'white', marginBottom: '35px' }}>Create Account</div>

                {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
                {success && <div style={{ color: '#6bff6b', marginBottom: '15px', fontSize: '14px' }}>{success}</div>}

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
                            placeholder="Create a password (min 6 characters)"
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

                    <div style={{ width: '100%', marginBottom: '22px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', textTransform: 'uppercase' }}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Create Account
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            onSwitchToLogin();
                        }}
                        style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
                    >
                        Back to Sign In
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Signup;