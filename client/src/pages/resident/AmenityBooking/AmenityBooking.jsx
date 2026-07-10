import React, { useState, useEffect, useCallback } from 'react';
import amenityService from '../../../services/amenityService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Button from '../../../components/Button/Button.jsx';
import Input from '../../../components/Input/Input.jsx';
import Modal from '../../../components/Modal/Modal.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import { formatDate } from '../../../utils/formatters.js';
import './AmenityBooking.css';

const AMENITY_ICONS = { default: '🏊' };

const AmenityBooking = () => {
  const { showToast } = useToast();
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [form, setForm] = useState({ bookingDate: '', slotStart: '', slotEnd: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [amenityRes, bookingRes] = await Promise.all([
        amenityService.getAmenities(),
        amenityService.getMyBookings(),
      ]);
      setAmenities(amenityRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openBookingModal = (amenity) => {
    setBookingTarget(amenity);
    setForm({ bookingDate: '', slotStart: amenity.openTime, slotEnd: amenity.closeTime, notes: '' });
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.bookingDate || !form.slotStart || !form.slotEnd) {
      showToast('Please choose a date and time slot', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await amenityService.book({ amenityId: bookingTarget._id, ...form });
      showToast('Amenity booked successfully', 'success');
      setBookingTarget(null);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await amenityService.cancelBooking(bookingId);
      showToast('Booking cancelled', 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (isLoading) return <Loader fullPage label="Loading amenities..." />;

  return (
    <div className="amenity-page">
      <h1 className="amenity-page__title">Amenity Booking</h1>

      <section className="amenity-page__section">
        <h2 className="amenity-page__section-title">Available Amenities</h2>
        {amenities.length === 0 ? (
          <Card>
            <p className="amenity-page__empty">No amenities have been set up yet.</p>
          </Card>
        ) : (
          <div className="amenity-grid">
            {amenities.map((amenity) => (
              <Card key={amenity._id} accent="primary" className="amenity-card">
                <span className="amenity-card__icon">{AMENITY_ICONS.default}</span>
                <h3 className="amenity-card__name">{amenity.name}</h3>
                {amenity.description && <p className="amenity-card__desc">{amenity.description}</p>}
                <span className="amenity-card__hours">
                  {amenity.openTime} – {amenity.closeTime}
                </span>
                <Button size="sm" fullWidth onClick={() => openBookingModal(amenity)}>
                  Book a Slot
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="amenity-page__section">
        <h2 className="amenity-page__section-title">My Bookings</h2>
        {bookings.length === 0 ? (
          <Card>
            <p className="amenity-page__empty">You haven't booked any amenities yet.</p>
          </Card>
        ) : (
          <div className="amenity-bookings">
            {bookings.map((booking) => (
              <Card key={booking._id} className="booking-row">
                <div className="booking-row__info">
                  <span className="booking-row__name">{booking.amenity?.name}</span>
                  <span className="booking-row__meta">
                    {formatDate(booking.bookingDate)} · {booking.slotStart} – {booking.slotEnd}
                  </span>
                </div>
                <div className="booking-row__actions">
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'neutral'}>{booking.status}</Badge>
                  {booking.status === 'confirmed' && (
                    <Button size="sm" variant="ghost" onClick={() => handleCancel(booking._id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={!!bookingTarget}
        onClose={() => setBookingTarget(null)}
        title={`Book ${bookingTarget?.name || ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setBookingTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleBook} isLoading={isSubmitting}>
              Confirm Booking
            </Button>
          </>
        }
      >
        <form className="amenity-booking-form" onSubmit={handleBook}>
          <Input label="Date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} required />
          <div className="amenity-booking-form__row">
            <Input label="Start Time" name="slotStart" type="time" value={form.slotStart} onChange={handleChange} required />
            <Input label="End Time" name="slotEnd" type="time" value={form.slotEnd} onChange={handleChange} required />
          </div>
          <Input label="Notes (optional)" name="notes" value={form.notes} onChange={handleChange} />
        </form>
      </Modal>
    </div>
  );
};

export default AmenityBooking;
