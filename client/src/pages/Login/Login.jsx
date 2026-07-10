import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import authService from '../../services/authService';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import './Login.css';

const Login = () => {
  const { loginWithOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 'mobile' — enter the registered mobile number and request an OTP
  // 'otp'    — enter the OTP that was sent, then log in
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMobileChange = (e) => {
    setMobile(e.target.value);
    setErrors((prev) => ({ ...prev, mobile: '' }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrors((prev) => ({ ...prev, otp: '' }));
  };

  const validateMobile = () => {
    const next = {};
    if (!mobile.trim()) next.mobile = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(mobile.trim())) next.mobile = 'Enter a valid 10-digit mobile number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateOtp = () => {
    const next = {};
    if (!otp.trim()) next.otp = 'OTP is required';
    else if (!/^[0-9]{6}$/.test(otp.trim())) next.otp = 'Enter the 6-digit code';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateMobile()) return;

    setIsSendingOtp(true);
    try {
      await authService.sendOtp(mobile.trim());
      showToast(`OTP sent to ${mobile.trim()}`, 'success');
      setStep('otp');
    } catch (err) {
      showToast(err.message || 'This number is not registered.', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setIsSubmitting(true);
    try {
      const data = await loginWithOtp(mobile.trim(), otp.trim());
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err.message || 'Invalid OTP.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('mobile');
    setOtp('');
    setErrors({});
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">
          {step === 'mobile'
            ? 'Log in with your registered mobile number'
            : `Enter the OTP sent to ${mobile}`}
        </p>

        {step === 'mobile' && (
          <form className="auth-card__form" onSubmit={handleSendOtp}>
            <Input
              label="Mobile Number"
              type="tel"
              name="mobile"
              placeholder="9876543210"
              value={mobile}
              onChange={handleMobileChange}
              error={errors.mobile}
              required
            />

            <Button type="submit" fullWidth isLoading={isSendingOtp}>
              Continue
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form className="auth-card__form" onSubmit={handleVerifyOtp}>
            <Input
              label="Enter OTP"
              type="text"
              name="otp"
              placeholder="6-digit code"
              value={otp}
              onChange={handleOtpChange}
              error={errors.otp}
              required
            />

            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Log In
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={handleBack}>
              Back
            </Button>
          </form>
        )}

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;