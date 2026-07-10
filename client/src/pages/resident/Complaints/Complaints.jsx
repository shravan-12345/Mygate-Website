import React, { useState, useEffect, useCallback } from 'react';
import complaintService from '../../../services/complaintService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Button from '../../../components/Button/Button.jsx';
import Input from '../../../components/Input/Input.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import { COMPLAINT_STATUS_VARIANT } from '../../../utils/constants.js';
import { formatDateTime, titleCase } from '../../../utils/formatters.js';
import './Complaints.css';

const CATEGORIES = ['plumbing', 'electrical', 'security', 'cleanliness', 'noise', 'parking', 'other'];

const Complaints = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'other', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [viewing, setViewing] = useState(null);

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      showToast('Title and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('description', form.description);
      if (imageFile) formData.append('image', imageFile);

      await complaintService.create(formData);
      showToast('Complaint submitted successfully', 'success');
      setIsModalOpen(false);
      setForm({ title: '', category: 'other', description: '' });
      setImageFile(null);
      loadComplaints();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader fullPage label="Loading your complaints..." />;

  return (
    <div className="complaints-page">
      <div className="complaints-page__header">
        <h1>My Complaints</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Raise a Complaint</Button>
      </div>

      {complaints.length === 0 ? (
        <Card>
          <p className="complaints-page__empty">You haven't raised any complaints yet.</p>
        </Card>
      ) : (
        <div className="complaints-list">
          {complaints.map((c) => (
            <Card key={c._id} className="complaint-card">
              <div className="complaint-card__body" onClick={() => setViewing(c)}>
                <div className="complaint-card__top">
                  <span className="complaint-card__title">{c.title}</span>
                  <Badge variant={COMPLAINT_STATUS_VARIANT[c.status]}>{c.status}</Badge>
                </div>
                <span className="complaint-card__category">{titleCase(c.category)}</span>
                <p className="complaint-card__desc">{c.description}</p>
                <span className="complaint-card__date">{formatDateTime(c.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Raise a Complaint"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Complaint
            </Button>
          </>
        }
      >
        <form className="complaint-form" onSubmit={handleSubmit}>
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <div className="field">
            <label className="field__label" htmlFor="category">
              Category
            </label>
            <select id="category" name="category" className="complaint-form__select" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {titleCase(cat)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="complaint-form__textarea"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label className="field__label">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing?.title} size="lg">
        {viewing && (
          <div className="complaint-detail">
            <div className="complaint-detail__meta">
              <Badge variant={COMPLAINT_STATUS_VARIANT[viewing.status]}>{viewing.status}</Badge>
              <span>{titleCase(viewing.category)}</span>
              <span>{formatDateTime(viewing.createdAt)}</span>
            </div>
            <p className="complaint-detail__desc">{viewing.description}</p>
            {viewing.image && <img src={viewing.image} alt="Complaint" className="complaint-detail__image" />}
            {viewing.adminReply && (
              <div className="complaint-detail__reply">
                <span className="complaint-detail__reply-label">Admin Reply</span>
                <p>{viewing.adminReply}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Complaints;
