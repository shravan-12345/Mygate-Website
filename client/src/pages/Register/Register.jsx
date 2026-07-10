import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { ROLES } from '../../utils/constants.js';
import '../Login/Login.css'; // reuses the shared auth-page/auth-card layout
import './Register.css';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLES.RESIDENT);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    flatNumber: '',
    block: '',
    employeeId: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!/^\d{10}$/.test(form.phone)) next.phone = 'Enter a valid 10-digit phone number';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (role === ROLES.RESIDENT && !form.flatNumber.trim()) next.flatNumber = 'Flat number is required';
    if (role === ROLES.SECURITY && !form.employeeId.trim()) next.employeeId = 'Employee ID is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...form, role };
      const data = await register(payload);

      if (data.token) {
        showToast(`Welcome, ${data.user.name}!`, 'success');
        navigate('/dashboard', { replace: true });
      } else {
        showToast(data.message, 'success');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__subtitle">Register as a resident or security guard</p>

        <div className="register__role-toggle">
          <button
            type="button"
            className={`register__role-btn ${role === ROLES.RESIDENT ? 'register__role-btn--active' : ''}`}
            onClick={() => setRole(ROLES.RESIDENT)}
          >
            🏠 Resident
          </button>
          <button
            type="button"
            className={`register__role-btn ${role === ROLES.SECURITY ? 'register__role-btn--active' : ''}`}
            onClick={() => setRole(ROLES.SECURITY)}
          >
            🛡️ Security Guard
          </button>
        </div>

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="register__grid">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="10-digit mobile number"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {role === ROLES.RESIDENT && (
              <>
                <Input
                  label="Flat Number"
                  name="flatNumber"
                  value={form.flatNumber}
                  onChange={handleChange}
                  error={errors.flatNumber}
                  placeholder="e.g. A-101"
                  required
                />
                <Input label="Block (optional)" name="block" value={form.block} onChange={handleChange} />
              </>
            )}

            {role === ROLES.SECURITY && (
              <Input
                label="Employee ID"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                error={errors.employeeId}
                required
              />
            )}
          </div>

          <p className="register__note">
            Your registration will be reviewed by the Society Admin before you can log in.
          </p>

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Register
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
