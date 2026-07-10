import React, { useState, useEffect } from 'react';
import residentService from '../../../services/residentService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Input from '../../../components/Input/Input.jsx';
import Button from '../../../components/Button/Button.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import './Profile.css';

const Profile = () => {
  const { showToast } = useToast();
  const [resident, setResident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    block: '',
    ownershipType: 'owner',
    vehicleNumbers: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await residentService.getMyProfile();
        setResident(data);
        setForm({
          name: data.user?.name || '',
          phone: data.user?.phone || '',
          block: data.block || '',
          ownershipType: data.ownershipType || 'owner',
          vehicleNumbers: (data.vehicleNumbers || []).join(', '),
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
        });
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [showToast]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('block', form.block);
      formData.append('ownershipType', form.ownershipType);
      formData.append('emergencyContactName', form.emergencyContactName);
      formData.append('emergencyContactPhone', form.emergencyContactPhone);
      // multer aggregates repeated same-name fields into an array automatically
      form.vehicleNumbers
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((v) => formData.append('vehicleNumbers', v));
      if (photoFile) formData.append('profileImage', photoFile);

      const { data } = await residentService.updateMyProfile(formData);
      setResident(data);
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader fullPage label="Loading your profile..." />;

  const avatarSrc = photoPreview || (resident?.user?.profileImage ? resident.user.profileImage : null);
  const initials = resident?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile-page">
      <h1 className="profile-page__title">My Profile</h1>

      <Card>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form__photo-row">
            <div className="profile-form__avatar">
              {avatarSrc ? <img src={avatarSrc} alt="Profile" /> : <span>{initials}</span>}
            </div>
            <label className="profile-form__photo-upload">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            </label>
          </div>

          <div className="profile-form__grid">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="Flat Number" value={resident?.flatNumber || ''} disabled helperText="Contact admin to change your unit" />
            <Input label="Block" name="block" value={form.block} onChange={handleChange} />

            <div className="field">
              <label className="field__label" htmlFor="ownershipType">
                Ownership Type
              </label>
              <select
                id="ownershipType"
                name="ownershipType"
                className="profile-form__select"
                value={form.ownershipType}
                onChange={handleChange}
              >
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>
            <Input
              label="Vehicle Numbers"
              name="vehicleNumbers"
              value={form.vehicleNumbers}
              onChange={handleChange}
              placeholder="Comma-separated, e.g. MH12AB1234, MH12CD5678"
            />

            <Input
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
            />
            <Input
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
