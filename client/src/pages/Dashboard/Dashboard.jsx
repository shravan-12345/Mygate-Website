import React from 'react';
import useAuth from '../../hooks/useAuth.js';
import Card from '../../components/Card/Card.jsx';
import ResidentHome from '../resident/ResidentHome/ResidentHome.jsx';
import { ROLES, ROLE_LABELS } from '../../utils/constants.js';
import './Dashboard.css';

// This is the shared landing page shown right after login. Residents (Phase 5)
// get real stat cards wired to live data; Security (Phase 6) and Admin (Phase 7)
// currently see a placeholder message until their dashboards are built out.
const ROLE_MESSAGE = {
  [ROLES.RESIDENT]: 'Approve visitors, check your dues, and stay on top of society notices.',
  [ROLES.SECURITY]: 'Log guests and deliveries, and keep the gate register moving.',
  [ROLES.ADMIN]: 'Review registrations, manage notices, and keep an eye on society-wide activity.',
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-home__greeting">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="dashboard-home__subtitle">{ROLE_MESSAGE[user?.role]}</p>

      {user?.role === ROLES.RESIDENT ? (
        <ResidentHome />
      ) : (
        <Card className="dashboard-home__notice" accent="info">
          <strong>{ROLE_LABELS[user?.role]} dashboard</strong> — the full set of tools for your role is on
          its way. Use the sidebar to navigate to what's available now.
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
