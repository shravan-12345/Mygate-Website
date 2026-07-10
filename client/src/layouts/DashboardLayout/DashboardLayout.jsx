import React, { useState } from 'react';
import { Outlet, useSearchParams } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Topbar from '../../components/Topbar/Topbar.jsx';
import useAuth from '../../hooks/useAuth.js';
import './DashboardLayout.css';

// Shared shell for all three role dashboards. The actual page content is
// rendered via <Outlet /> from nested routes defined in routes/AppRoutes.jsx.
const DashboardLayout = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const devRole = searchParams.get("role");

  const role = user?.role || devRole || "resident";

  return (
    <div className="dashboard-layout">
  <Sidebar
    role={role}
    isCollapsed={isCollapsed}
    isMobileOpen={isMobileOpen}
    onCloseMobile={() => setIsMobileOpen(false)}
  />

      <div
        className={`dashboard-layout__main ${isCollapsed ? 'dashboard-layout__main--collapsed' : ''}`}
      >
        <Topbar
          onToggleSidebar={() => setIsCollapsed((prev) => !prev)}
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;


//////http://localhost:5173/dashboard?role=security///////