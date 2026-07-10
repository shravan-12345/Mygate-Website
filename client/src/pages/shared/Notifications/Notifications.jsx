import React, { useState, useEffect, useCallback } from 'react';
import notificationService from '../../../services/notificationService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Button from '../../../components/Button/Button.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import { formatDateTime } from '../../../utils/formatters.js';
import './Notifications.css';

const NOTIFICATION_ICONS = {
  guest_arrived: '🚶',
  delivery_arrived: '📦',
  notice_created: '📢',
  complaint_updated: '📝',
  maintenance_due: '🧾',
  emergency_alert: '🚨',
  visitor_approval_request: '🚪',
  registration_status: '✅',
};

const Notifications = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const { notifications: list } = await notificationService.getMyNotifications();
      setNotifications(list);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card padded={false}>
        {isLoading ? (
          <Loader label="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <p className="notifications-page__empty">You're all caught up — no notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`notification-item ${!n.isRead ? 'notification-item--unread' : ''}`}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
              >
                <span className="notification-item__icon">{NOTIFICATION_ICONS[n.type] || '🔔'}</span>
                <div className="notification-item__body">
                  <p className="notification-item__title">{n.title}</p>
                  <p className="notification-item__message">{n.message}</p>
                  <span className="notification-item__time">{formatDateTime(n.createdAt)}</span>
                </div>
                {!n.isRead && <span className="notification-item__dot" />}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
