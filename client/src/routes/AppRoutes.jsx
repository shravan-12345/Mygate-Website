import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout/PublicLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

import Home from '../pages/Home/Home.jsx';
import About from '../pages/About/About.jsx';
import Contact from '../pages/Contact/Contact.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from '../pages/ResetPassword/ResetPassword.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import NotFound from '../pages/NotFound/NotFound.jsx';

// Resident dashboard pages (Phase 5)
import Profile from '../pages/resident/Profile/Profile.jsx';
import MyFamily from '../pages/resident/MyFamily/MyFamily.jsx';
import VisitorApproval from '../pages/resident/VisitorApproval/VisitorApproval.jsx';
import VisitorQRCode from '../pages/resident/VisitorQRCode/VisitorQRCode.jsx';
import AmenityBooking from '../pages/resident/AmenityBooking/AmenityBooking.jsx';
import ResidentComplaints from '../pages/resident/Complaints/Complaints.jsx';
import ResidentNotices from '../pages/resident/Notices/Notices.jsx';
import MaintenanceBills from '../pages/resident/MaintenanceBills/MaintenanceBills.jsx';

// Shared pages (available to every role)
import Notifications from '../pages/shared/Notifications/Notifications.jsx';
import EmergencyContacts from '../pages/shared/EmergencyContacts/EmergencyContacts.jsx';
import Settings from '../pages/shared/Settings/Settings.jsx';

import { ROLES } from '../utils/constants.js';

// NOTE: Security (Phase 6) and Admin (Phase 7) dashboard pages are added here
// progressively as they're built, following the same per-role ProtectedRoute pattern.
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      </Route>

      {/* Protected dashboard shell — role-specific pages nest under here as each phase adds them */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Resident-only pages (Phase 5) */}
        <Route
          path="profile"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="family"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <MyFamily />
            </ProtectedRoute>
          }
        />
        <Route
          path="visitors"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <VisitorApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="visitors/qr"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <VisitorQRCode />
            </ProtectedRoute>
          }
        />
        <Route
          path="amenities"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <AmenityBooking />
            </ProtectedRoute>
          }
        />
        {/* NOTE: complaints/notices/maintenance below currently render the resident
            view for every role. Phase 7 replaces these with a role-dispatching
            wrapper once the Admin management views for each exist. */}
        <Route
          path="complaints"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <ResidentComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="notices"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <ResidentNotices />
            </ProtectedRoute>
          }
        />
        <Route
          path="maintenance"
          element={
            <ProtectedRoute roles={[ROLES.RESIDENT]}>
              <MaintenanceBills />
            </ProtectedRoute>
          }
        />

        {/* Shared pages — every authenticated role can access these */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="emergency" element={<EmergencyContacts />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
