import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Users, Shield, Eye, EyeOff, LogIn, Loader2, Fingerprint, Delete, User, Lock } from 'lucide-react';
import { StaffMember } from '../types';
import { fetchStaffMembers } from '../services/supabaseDB';

type LoginScreen = 'role-select' | 'staff-select' | 'staff-pin' | 'admin-login';

const LoginPage: React.FC = () => {
    const { loginAsStaff, loginAsAdmin } = useAuth();
    const [screen, setScreen] = useState<LoginScreen>('role-select');
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [pin, setPin] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch staff members from Supabase when entering staff select
    useEffect(() => {
        if (screen === 'staff-select' && staffMembers.length === 0) {
            fetchStaffMembers()
                .then(members => setStaffMembers(members))
                .catch(() => setError('Could not load staff list.'));
        }
    }, [screen]);

    const handleBack = () => {
        setError('');
        if (screen === 'staff-pin') { setScreen('staff-select'); setPin(''); }
        else if (screen === 'staff-select' || screen === 'admin-login') { setScreen('role-select'); setPin(''); setUsername(''); setPassword(''); }
    };

    const handleStaffSelect = (staff: StaffMember) => {
        setSelectedStaff(staff);
        setPin('');
        setError('');
        setScreen('staff-pin');
    };

    const handlePinPress = (digit: string) => {
        if (pin.length >= 4) return;
        const newPin = pin + digit;
        setPin(newPin);
        setError('');

        if (newPin.length === 4 && selectedStaff) {
            handleStaffLogin(newPin);
        }
    };

    const handlePinDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError('');
    };

    const handleStaffLogin = async (enteredPin: string) => {
        if (!selectedStaff) return;
        setLoading(true);
        const { error: err } = await loginAsStaff(selectedStaff.id, selectedStaff.name, enteredPin);
        if (err) {
            setError(err);
            setPin('');
        }
        setLoading(false);
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;
        setError('');
        setLoading(true);

        const { error: err } = await loginAsAdmin(username, password);
        if (err) {
            setError(err);
        }
        setLoading(false);
    };

    // ===== ROLE SELECT SCREEN =====
    if (screen === 'role-select') {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-brand animate-in">
                        <div className="login-logo">
                            <span className="login-logo-icon">🏢</span>
                        </div>
                        <h1 className="login-title">SocietyClean</h1>
                        <p className="login-subtitle">Management Portal</p>
                    </div>

                    <div className="animate-in animate-in-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button
                            className="login-role-card"
                            onClick={() => setScreen('staff-select')}
                        >
                            <div className="login-role-icon" style={{ background: 'var(--green-light)' }}>
                                <Users size={28} color="#059669" />
                            </div>
                            <div>
                                <div className="login-role-title">Staff Login</div>
                                <div className="login-role-desc">Select your profile & enter PIN</div>
                            </div>
                        </button>

                        <button
                            className="login-role-card"
                            onClick={() => setScreen('admin-login')}
                        >
                            <div className="login-role-icon" style={{ background: 'var(--blue-light)' }}>
                                <Shield size={28} color="#2563eb" />
                            </div>
                            <div>
                                <div className="login-role-title">Admin Login</div>
                                <div className="login-role-desc">Sign in to manage housekeeping</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ===== STAFF SELECT SCREEN =====
    if (screen === 'staff-select') {
        return (
            <div className="login-page">
                <div className="login-container" style={{ maxWidth: 420 }}>
                    <div className="login-header animate-in">
                        <button className="login-back-btn" onClick={handleBack}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="login-header-title">Staff Login</span>
                        <div style={{ width: 42 }} />
                    </div>

                    <div className="animate-in animate-in-delay-1" style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div className="login-hero-icon" style={{ background: 'var(--green-light)' }}>
                            <Users size={32} color="#059669" />
                        </div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                            Select Your Profile
                        </h2>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
                            Tap on your name to continue
                        </p>
                    </div>

                    {error && (
                        <div className="login-error" style={{ marginBottom: 16, textAlign: 'center' }}>{error}</div>
                    )}

                    <div className="staff-grid animate-in animate-in-delay-2">
                        {staffMembers.map(staff => (
                            <button
                                key={staff.id}
                                className="staff-card"
                                onClick={() => handleStaffSelect(staff)}
                            >
                                <div className="staff-avatar-ring">
                                    <img src={staff.avatar} alt={staff.name} className="staff-avatar-img" />
                                </div>
                                <div className="staff-card-name">{staff.name}</div>
                                <div className="staff-card-info">{staff.blockAssignment}</div>
                            </button>
                        ))}
                    </div>

                    {staffMembers.length === 0 && !error && (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Loader2 size={28} className="spin" style={{ color: 'var(--blue)' }} />
                            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>Loading staff...</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ===== STAFF PIN SCREEN =====
    if (screen === 'staff-pin') {
        return (
            <div className="login-page">
                <div className="login-container" style={{ maxWidth: 380 }}>
                    <div className="login-header animate-in">
                        <button className="login-back-btn" onClick={handleBack}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="login-header-title">Staff Login</span>
                        <div style={{ width: 42 }} />
                    </div>

                    <div className="animate-in animate-in-delay-1" style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div className="pin-avatar-ring">
                            <img src={selectedStaff?.avatar} alt={selectedStaff?.name} className="pin-avatar-img" />
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {selectedStaff?.name}
                        </h2>
                        <button className="pin-change-profile" onClick={handleBack}>
                            Tap to change profile
                        </button>
                    </div>

                    <div className="animate-in animate-in-delay-2" style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                            <Fingerprint size={18} color="var(--text-muted)" />
                            <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)' }}>
                                Enter PIN
                            </span>
                        </div>

                        <div className="pin-dots">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
                            ))}
                        </div>

                        {error && (
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--coral)', marginTop: 8 }}>{error}</div>
                        )}

                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginTop: 8 }}>
                            Default PIN: 1234
                        </div>
                    </div>

                    <div className="pin-keypad animate-in animate-in-delay-3">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, idx) => {
                            if (key === '') return <div key={idx} className="pin-key-spacer" />;
                            if (key === 'del') {
                                return (
                                    <button key={idx} className="pin-key pin-key-del" onClick={handlePinDelete}>
                                        <Delete size={22} />
                                    </button>
                                );
                            }
                            return (
                                <button key={idx} className="pin-key" onClick={() => handlePinPress(key)}>
                                    {key}
                                </button>
                            );
                        })}
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Loader2 size={28} className="spin" style={{ color: 'var(--blue)' }} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ===== ADMIN LOGIN SCREEN =====
    return (
        <div className="login-page">
            <div className="login-container" style={{ maxWidth: 380 }}>
                <div className="login-header animate-in">
                    <button className="login-back-btn" onClick={handleBack}>
                        <ArrowLeft size={20} />
                    </button>
                    <span className="login-header-title">Admin Login</span>
                    <div style={{ width: 42 }} />
                </div>

                <div className="animate-in animate-in-delay-1" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div className="login-hero-icon login-hero-icon-lg" style={{ background: 'var(--blue-light)' }}>
                        <Shield size={36} color="#2563eb" />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                        Admin Access
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
                        Sign in to manage your society housekeeping
                    </p>
                </div>

                <form onSubmit={handleAdminLogin} className="animate-in animate-in-delay-2">
                    <div className="neu-input-group" style={{ marginBottom: 16 }}>
                        <label className="neu-label">Username</label>
                        <div className="neu-input-wrapper">
                            <User size={18} style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', zIndex: 1 }} />
                            <input
                                type="text"
                                className="neu-input"
                                style={{ paddingLeft: 42 }}
                                placeholder="Enter username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="neu-input-group" style={{ marginBottom: 12 }}>
                        <label className="neu-label">Password</label>
                        <div className="neu-input-wrapper">
                            <Lock size={18} style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', zIndex: 1 }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="neu-input"
                                style={{ paddingLeft: 42 }}
                                placeholder="Enter password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="neu-input-action"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
                            Default: admin / admin123
                        </span>
                    </div>

                    {error && (
                        <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>
                    )}

                    <button type="submit" className="neu-btn-login" disabled={loading}>
                        {loading ? (
                            <Loader2 size={20} className="spin" />
                        ) : (
                            <><LogIn size={20} /> Sign In</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
