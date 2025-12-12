import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api/api';

export default function Settings() {
    const { user, login } = useAuth();
    const [username, setUsername] = useState(user?.name || '');
    const [password, setPassword] = useState('');

    const updateProfile = async () => {
        try {
            await API.put('/admin/profile', { username, password });
            login(user.role, username); // update context
            alert('Profile updated!');
        } catch (err) { alert(err.message); }
    };

    return (
        <div>
            <h2>Settings</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={updateProfile}>Update Profile</button>
        </div>
    );
}
