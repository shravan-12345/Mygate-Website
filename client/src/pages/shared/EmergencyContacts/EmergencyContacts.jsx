import React, { useState, useEffect } from 'react';
import emergencyService from '../../../services/emergencyService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import { EMERGENCY_CATEGORY_LABELS } from '../../../utils/constants.js';
import './EmergencyContacts.css';

const CATEGORY_ICONS = {
  hospital: '🏥',
  police: '👮',
  fire_brigade: '🚒',
  society_office: '🏢',
  electrician: '💡',
  plumber: '🔧',
  ambulance: '🚑',
};

const EmergencyContacts = () => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await emergencyService.getContacts();
        setContacts(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [showToast]);

  if (isLoading) return <Loader fullPage label="Loading emergency contacts..." />;

  return (
    <div className="emergency-page">
      <h1 className="emergency-page__title">Emergency Contacts</h1>
      <p className="emergency-page__subtitle">Tap a number to call immediately.</p>

      {contacts.length === 0 ? (
        <Card>
          <p className="emergency-page__empty">No emergency contacts have been added yet.</p>
        </Card>
      ) : (
        <div className="emergency-grid">
          {contacts.map((contact) => (
            <a key={contact._id} href={`tel:${contact.phoneNumber}`} className="emergency-card">
              <span className="emergency-card__icon">{CATEGORY_ICONS[contact.category] || '☎️'}</span>
              <div className="emergency-card__body">
                <span className="emergency-card__category">
                  {EMERGENCY_CATEGORY_LABELS[contact.category] || contact.category}
                </span>
                <span className="emergency-card__name">{contact.name}</span>
                {contact.address && <span className="emergency-card__address">{contact.address}</span>}
              </div>
              <span className="emergency-card__call">📞 {contact.phoneNumber}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
