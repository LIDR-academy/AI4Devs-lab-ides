import React, { useState } from 'react';
import { Dialog, TextField, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface ReAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const ReAuthModal: React.FC<ReAuthModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      updateToken(response.data.data.token);
      onClose();
      toast.success('Session renewed');
    } catch (error) {
      console.error('Re-authentication failed:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Session Expired</h2>
        <p className="mb-4">Please login again to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <TextField
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            className="bg-primary"
          >
            Login
          </Button>
        </form>
      </div>
    </Dialog>
  );
};