import React, { useState } from 'react';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import useToast from '../../hooks/useToast.js';
import './Contact.css';

// NOTE: There is no backend endpoint for this form yet (the spec's public
// pages don't include a Contact API). It currently just confirms locally —
// wire it to a real `/api/contact` endpoint if one is added later.
const Contact = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please fill in every field', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      showToast("Message sent — we'll get back to you shortly.", 'success');
      setForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="contact">
      <div className="contact__intro">
        <h1>Get in touch</h1>
        <p>Questions about onboarding your society, or feedback on the product? Send us a note.</p>
      </div>

      <div className="contact__grid">
        <form className="contact__form" onSubmit={handleSubmit}>
          <Input label="Your Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required />
          <div className="field">
            <label className="field__label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="contact__textarea"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              required
            />
          </div>
          <Button type="submit" isLoading={isSubmitting}>
            Send Message
          </Button>
        </form>

        <div className="contact__info">
          <div className="contact__info-item">
            <span className="contact__info-label">Email</span>
            <span>support@societymanage.example</span>
          </div>
          <div className="contact__info-item">
            <span className="contact__info-label">Phone</span>
            <span>+91 98765 43210</span>
          </div>
          <div className="contact__info-item">
            <span className="contact__info-label">Hours</span>
            <span>Mon – Sat, 9:00 AM – 7:00 PM IST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
