import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { ROLE_LABELS } from '../../utils/constants.js';
import notificationService from '../../services/notificationService.js';
import './Topbar.css';

const Topbar = ({ onToggleSidebar, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Poll unread notification count every 30s so the bell badge stays fresh
  // without needing a websocket connection.
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { unreadCount: count } = await notificationService.getMyNotifications({ unreadOnly: 'true' });
        setUnreadCount(count);
      } catch {
        // Silently ignore — the bell just won't update this cycle
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__icon-btn topbar__icon-btn--desktop" onClick={onToggleSidebar} aria-label="Collapse sidebar">
          ☰
        </button>
        <button className="topbar__icon-btn topbar__icon-btn--mobile" onClick={onToggleMobileSidebar} aria-label="Open menu">
          ☰
        </button>
      </div>

      <div className="topbar__right">
        <Link to="/dashboard/notifications" className="topbar__icon-btn topbar__bell" aria-label="Notifications">
          🔔
          {unreadCount > 0 && <span className="topbar__bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Link>

        <div className="topbar__profile" ref={profileRef}>
          <button className="topbar__profile-btn" onClick={() => setIsProfileOpen((prev) => !prev)}>
            <span className="topbar__avatar">{initials}</span>
            <span className="topbar__profile-info">
              <span className="topbar__profile-name">{user?.name}</span>
              <span className="topbar__profile-role">{ROLE_LABELS[user?.role]}</span>
            </span>
          </button>

          {isProfileOpen && (
            <div className="topbar__dropdown">
              <Link to="/dashboard/profile" className="topbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                My Profile
              </Link>
              <Link to="/dashboard/settings" className="topbar__dropdown-item" onClick={() => setIsProfileOpen(false)}>
                Settings
              </Link>
              <button className="topbar__dropdown-item topbar__dropdown-item--danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
