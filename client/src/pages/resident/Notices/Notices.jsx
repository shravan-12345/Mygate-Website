import React, { useState, useEffect } from 'react';
import noticeService from '../../../services/noticeService.js';
import useToast from '../../../hooks/useToast.js';
import Card from '../../../components/Card/Card.jsx';
import Badge from '../../../components/Badge/Badge.jsx';
import Loader from '../../../components/Loader/Loader.jsx';
import { formatDate, titleCase } from '../../../utils/formatters.js';
import './Notices.css';

const CATEGORY_VARIANT = {
  general: 'neutral',
  maintenance: 'warning',
  event: 'info',
  emergency: 'danger',
  rules: 'success',
};

const Notices = () => {
  const { showToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await noticeService.getNotices();
        setNotices(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [showToast]);

  if (isLoading) return <Loader fullPage label="Loading notices..." />;

  return (
    <div className="notices-page">
      <h1 className="notices-page__title">Society Notices</h1>

      {notices.length === 0 ? (
        <Card>
          <p className="notices-page__empty">No active notices right now.</p>
        </Card>
      ) : (
        <div className="notices-list">
          {notices.map((notice) => (
            <Card key={notice._id} className="notice-card">
              <div className="notice-card__top">
                <span className="notice-card__title">{notice.title}</span>
                <Badge variant={CATEGORY_VARIANT[notice.category] || 'neutral'}>{titleCase(notice.category)}</Badge>
              </div>
              <p className="notice-card__desc">{notice.description}</p>
              <div className="notice-card__meta">
                <span>Posted {formatDate(notice.createdAt)}</span>
                {notice.expiryDate && <span>Valid until {formatDate(notice.expiryDate)}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
