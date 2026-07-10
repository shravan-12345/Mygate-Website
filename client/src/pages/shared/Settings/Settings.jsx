import React, { useState } from 'react';
import authService from '../../../services/authService.js';
import useAuth from '../../../hooks/useAuth.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Input from '../../../components/Input/Input.jsx';
import Button from '../../../components/Button/Button.jsx';
import { ROLE_LABELS } from '../../../utils/constants.js';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      showToast('Password changed successfully', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">Settings</h1>

      <Card title="Account" className="settings-page__card">
        <div className="settings-account">
          <div>
            <span className="settings-account__label">Name</span>
            <span className="settings-account__value">{user?.name}</span>
          </div>
          <div>
            <span className="settings-account__label">Email</span>
            <span className="settings-account__value">{user?.email}</span>
          </div>
          <div>
            <span className="settings-account__label">Role</span>
            <span className="settings-account__value">{ROLE_LABELS[user?.role]}</span>
          </div>
        </div>
      </Card>

      <Card title="Change Password" className="settings-page__card">
        <form className="settings-form" onSubmit={handleSubmit}>
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" isLoading={isSubmitting}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
