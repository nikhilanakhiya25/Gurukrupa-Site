import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api/api';
import { User, Lock, Save } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const { user, login } = useAuth();
    const [username, setUsername] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const updateProfile = async () => {
        if (!username.trim()) {
            setAlert({ type: 'error', message: 'Username cannot be empty' });
            return;
        }

        setLoading(true);
        setAlert(null);

        try {
            await API.put('/admin/profile', { username, password });
            login(user.role, username); // update context
            setAlert({ type: 'success', message: 'Profile updated successfully!' });
            setPassword(''); // Clear password field
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-wrapper">
            <div className="settings-card">
                <div className="settings-header">
                    <User />
                    <h2>Admin Settings</h2>
                    <p>Update your profile information</p>
                </div>

                {alert && (
                    <div className={`alert ${alert.type}`}>
                        {alert.message}
                    </div>
                )}

                <div className="input-group">
                    <label>Username</label>
                    <div className="input-icon">
                        <User size={16} />
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>New Password (optional)</label>
                    <div className="input-icon">
                        <Lock size={16} />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="save-btn"
                    onClick={updateProfile}
                    disabled={loading}
                >
                    <Save size={16} />
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </div>
    );
}
