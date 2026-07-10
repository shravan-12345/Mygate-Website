import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService.js';
import useToast from '../../hooks/useToast.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import '../Login/Login.css';

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Reset your password</h1>
        <p className="auth-card__subtitle">
          {isSent
            ? 'Check your email for a link to reset your password.'
            : "Enter your account email and we'll send you a reset link."}
        </p>

        {!isSent ? (
          <form className="auth-card__form" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Send Reset Link
            </Button>
          </form>
        ) : (
          <Button variant="outline" fullWidth onClick={() => setIsSent(false)}>
            Send another link
          </Button>
        )}

        <p className="auth-card__footer">
          Remembered your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
