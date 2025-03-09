import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data.token);
      navigate('/dashboard');
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>*</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            Hello<br />Recruiter! 👋
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
            Skip repetitive and manual recruitment tasks. Get highly productive through automation
            and save tons of time with that ATS system!
          </p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          © 2025 ATS System. All rights reserved. AI4Devs Team
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-logo">ATS System</div>
          <h2 className="login-welcome">Welcome Back!</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              fullWidth
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              variant="standard"
              sx={{
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#E5E7EB',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#4338CA',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#4338CA',
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              variant="standard"
              sx={{
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#E5E7EB',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#4338CA',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#4338CA',
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              className="login-button"
              sx={{
                backgroundColor: '#18181B',
                '&:hover': {
                  backgroundColor: '#27272A',
                },
                textTransform: 'none',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              Login Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;