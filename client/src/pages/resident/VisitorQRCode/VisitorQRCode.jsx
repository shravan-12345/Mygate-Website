import React, { useState } from 'react';
import visitorService from '../../../services/visitorService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Input from '../../../components/Input/Input.jsx';
import Button from '../../../components/Button/Button.jsx';
import { formatDateTime } from '../../../utils/formatters.js';
import './VisitorQRCode.css';

const EMPTY_FORM = { visitorName: '', mobileNumber: '', purpose: '', vehicleNumber: '', expectedVisitTime: '' };

const VisitorQRCode = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generated, setGenerated] = useState(null);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitorName.trim() || !/^\d{10}$/.test(form.mobileNumber) || !form.purpose.trim()) {
      showToast('Please fill in visitor name, a valid 10-digit mobile number, and purpose', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await visitorService.preRegister(form);
      setGenerated(data);
      showToast('Visitor pre-registered — share the QR code below', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGenerated(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="visitor-qr">
      <h1 className="visitor-qr__title">Visitor QR Code</h1>
      <p className="visitor-qr__subtitle">
        Pre-register an expected guest and share the QR code — the security guard scans it to check them
        straight in, no approval wait needed.
      </p>

      <div className="visitor-qr__grid">
        <Card title="Pre-register a Visitor">
          <form className="visitor-qr__form" onSubmit={handleSubmit}>
            <Input label="Visitor Name" name="visitorName" value={form.visitorName} onChange={handleChange} required />
            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
            />
            <Input label="Purpose of Visit" name="purpose" value={form.purpose} onChange={handleChange} required />
            <Input label="Vehicle Number (optional)" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} />
            <Input
              label="Expected Visit Time"
              name="expectedVisitTime"
              type="datetime-local"
              value={form.expectedVisitTime}
              onChange={handleChange}
            />
            <Button type="submit" isLoading={isSubmitting}>
              Generate QR Code
            </Button>
          </form>
        </Card>

        <Card title="Visitor Pass">
          {generated ? (
            <div className="visitor-qr__pass">
              <img src={generated.qrCode} alt="Visitor QR Code" className="visitor-qr__image" />
              <div className="visitor-qr__pass-details">
                <span className="visitor-qr__pass-name">{generated.visitorName}</span>
                <span className="visitor-qr__pass-meta">{generated.purpose}</span>
                {generated.expectedVisitTime && (
                  <span className="visitor-qr__pass-meta">Expected: {formatDateTime(generated.expectedVisitTime)}</span>
                )}
              </div>
              <Button variant="outline" onClick={handleReset}>
                Register Another Visitor
              </Button>
            </div>
          ) : (
            <p className="visitor-qr__empty">Fill in the form to generate a shareable QR pass.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VisitorQRCode;
