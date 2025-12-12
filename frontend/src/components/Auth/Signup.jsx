import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import './Signup.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      // Create user in backend
      const { data } = await API.post('/auth/signup', {
        name,
        email,
        password,
        username: email,  // IMPORTANT 🔥 make email = username
        role: "user"      // new users are always normal users
      });

      // Auto-login user after signup
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Set token for all API requests
      API.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

      // Redirect to home
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <form onSubmit={submit} className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join us today</p>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-submit">Signup</button>

        <div className="extra-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}
