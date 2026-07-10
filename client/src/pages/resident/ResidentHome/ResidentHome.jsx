import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import visitorService from '../../../services/visitorService.js';
import complaintService from '../../../services/complaintService.js';
import maintenanceService from '../../../services/maintenanceService.js';
import notificationService from '../../../services/notificationService.js';
import Card from '../../../components/Card/Card.jsx';
import Skeleton from '../../../components/Skeleton/Skeleton.jsx';
import { VISITOR_STATUS, PAYMENT_STATUS, COMPLAINT_STATUS } from '../../../utils/constants.js';
import { formatCurrency } from '../../../utils/formatters.js';
import './ResidentHome.css';

const ResidentHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [visitorsRes, complaintsRes, billsRes, notificationsRes] = await Promise.all([
          visitorService.getMyVisitors(),
          complaintService.getMyComplaints(),
          maintenanceService.getMyBills(),
          notificationService.getMyNotifications(),
        ]);

        const pendingVisitors = visitorsRes.data.filter(
          (v) => v.approvalStatus === VISITOR_STATUS.PENDING_APPROVAL
        ).length;
        const openComplaints = complaintsRes.data.filter((c) => c.status !== COMPLAINT_STATUS.RESOLVED).length;
        const outstandingBills = billsRes.data.filter((b) => b.paymentStatus !== PAYMENT_STATUS.PAID);
        const totalDue = outstandingBills.reduce((sum, b) => sum + b.amount, 0);

        setStats({
          pendingVisitors,
          openComplaints,
          totalDue,
          unreadNotifications: notificationsRes.unreadCount,
        });
      } catch {
        // Non-critical widget — fail silently and just show zero-state cards
        setStats({ pendingVisitors: 0, openComplaints: 0, totalDue: 0, unreadNotifications: 0 });
      }
    };
    load();
  }, []);

  const CARDS = [
    {
      key: 'pendingVisitors',
      label: 'Visitors Awaiting Approval',
      icon: '🚪',
      accent: 'warning',
      to: '/dashboard/visitors',
    },
    {
      key: 'openComplaints',
      label: 'Open Complaints',
      icon: '📝',
      accent: 'info',
      to: '/dashboard/complaints',
    },
    {
      key: 'totalDue',
      label: 'Maintenance Due',
      icon: '🧾',
      accent: 'danger',
      to: '/dashboard/maintenance',
      isCurrency: true,
    },
    {
      key: 'unreadNotifications',
      label: 'Unread Notifications',
      icon: '🔔',
      accent: 'primary',
      to: '/dashboard/notifications',
    },
  ];

  return (
    <div className="resident-home__stats">
      {CARDS.map((card) => (
        <Link key={card.key} to={card.to} className="resident-home__stat-link">
          <Card accent={card.accent} className="resident-home__stat-card">
            <span className="resident-home__stat-icon">{card.icon}</span>
            {stats ? (
              <span className="resident-home__stat-value">
                {card.isCurrency ? formatCurrency(stats[card.key]) : stats[card.key]}
              </span>
            ) : (
              <Skeleton width="60px" height="26px" />
            )}
            <span className="resident-home__stat-label">{card.label}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ResidentHome;
