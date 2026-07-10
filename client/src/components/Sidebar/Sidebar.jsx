import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROLES } from '../../utils/constants.js';
import './Sidebar.css';

// Each role sees a different set of nav items, matching the feature list per
// dashboard from the spec. Paths point into the role's dashboard sub-routes,
// built out in Phases 5-7.
const NAV_ITEMS = {
  [ROLES.RESIDENT]: [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { to: '/dashboard/family', label: 'My Family', icon: '👥' },
    { to: '/dashboard/visitors', label: 'Visitor Approval', icon: '🚪', end: true },
    { to: '/dashboard/visitors/qr', label: 'Visitor QR Code', icon: '📱' },
    { to: '/dashboard/amenities', label: 'Amenity Booking', icon: '🏊' },
    { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/dashboard/complaints', label: 'Complaints', icon: '📝' },
    { to: '/dashboard/notices', label: 'Society Notices', icon: '📢' },
    { to: '/dashboard/maintenance', label: 'Maintenance Bills', icon: '🧾' },
    { to: '/dashboard/emergency', label: 'Emergency Contacts', icon: '🚨' },
    { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ],
  [ROLES.SECURITY]: [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/dashboard/guest-entry', label: 'Guest Entry / Exit', icon: '🚶' },
    { to: '/dashboard/visitor-entry', label: 'Visitor Entry / Exit', icon: '🚪' },
    { to: '/dashboard/delivery-entry', label: 'Delivery Entry / Exit', icon: '📦' },
    { to: '/dashboard/scan-qr', label: 'Scan Visitor QR', icon: '📷' },
    { to: '/dashboard/call-resident', label: 'Call / Message Resident', icon: '📞' },
    { to: '/dashboard/history', label: 'Visitor History', icon: '📜' },
    { to: '/dashboard/search', label: 'Search Visitor', icon: '🔍' },
    { to: '/dashboard/emergency', label: 'Emergency Contacts', icon: '🚨' },
    { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  ],
  [ROLES.ADMIN]: [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/dashboard/registrations', label: 'Approve Registration', icon: '✅' },
    { to: '/dashboard/residents', label: 'Manage Residents', icon: '👥' },
    { to: '/dashboard/guards', label: 'Manage Security Guards', icon: '🛡️' },
    { to: '/dashboard/notices', label: 'Notices', icon: '📢' },
    { to: '/dashboard/complaints', label: 'Complaints', icon: '📝' },
    { to: '/dashboard/maintenance', label: 'Maintenance', icon: '🧾' },
    { to: '/dashboard/emergency', label: 'Emergency Contacts', icon: '🚨' },
    { to: '/dashboard/reports', label: 'Reports', icon: '📊' },
    { to: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { to: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  ],
};

const Sidebar = ({ role, isCollapsed, isMobileOpen, onCloseMobile }) => {
  const items = NAV_ITEMS[role] || [];

  return (
    <>
      {isMobileOpen && <div className="sidebar__scrim" onClick={onCloseMobile} />}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}
      >
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">S</span>
          {!isCollapsed && <span className="sidebar__brand-text">SocietyManage</span>}
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              {!isCollapsed && <span className="sidebar__link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
