import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api/api';

export default function Settings() {
    const { user, login } = useAuth();
    const [username, setUsername] = useState(user?.name || '');
    const [password, setPassword] = useState('');

    const updateProfile = async () => {
        if (!username) return alert('Enter username');
        try {
            await API.put(`/admin/profile`, { username, password }); // backend endpoint
            login(user.role, username); // update auth context
            alert('Profile updated!');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Settings</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" type="password" />
            <button onClick={updateProfile}>Update Profile</button>
        </div>
    );
}
