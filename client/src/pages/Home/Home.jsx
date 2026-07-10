import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import Card from '../../components/Card/Card.jsx';
import './Home.css';

const FEATURES = [
  {
    icon: '🚪',
    title: 'Visitor Management',
    text: 'Pre-register guests with a QR code, or let the gate log walk-ins and ping you for approval instantly.',
  },
  {
    icon: '📦',
    title: 'Delivery Tracking',
    text: 'Know the moment a courier arrives, and keep a full history of every package that passes through the gate.',
  },
  {
    icon: '📝',
    title: 'Complaints & Notices',
    text: 'Raise a complaint with a photo, track it to resolution, and never miss a society-wide notice.',
  },
  {
    icon: '🧾',
    title: 'Maintenance Billing',
    text: 'View dues, pay online, and download a receipt — all in one place.',
  },
  {
    icon: '🚨',
    title: 'Emergency Access',
    text: 'One tap to call the hospital, police, electrician, or society office — no digging through contacts.',
  },
  {
    icon: '🛡️',
    title: 'Built for Every Role',
    text: 'Purpose-built dashboards for residents, security guards, and the society admin — not one-size-fits-all.',
  },
];

const Home = () => {
  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-text">
          <span className="home__eyebrow">Gate to Ledger, In One System</span>
          <h1 className="home__title">
            Every visitor logged. <br />
            Every bill tracked. <br />
            <span className="home__title-accent">Nothing missed at the gate.</span>
          </h1>
          <p className="home__subtitle">
            SocietyManage replaces the paper visitor register and the WhatsApp group with one system
            residents, guards, and admins actually want to use.
          </p>
          <div className="home__hero-actions">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        <div className="home__hero-visual" aria-hidden="true">
          <div className="home__gate-card">
            <div className="home__gate-row">
              <span className="home__gate-dot" />
              <span>Visitor at Main Gate</span>
            </div>
            <div className="home__gate-name">Rahul Sharma</div>
            <div className="home__gate-meta">Visiting A-204 · Delivery · 2 min ago</div>
            <div className="home__gate-actions">
              <span className="home__gate-btn home__gate-btn--approve">Approve</span>
              <span className="home__gate-btn home__gate-btn--reject">Reject</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="home__section-head">
          <span className="home__eyebrow">What's Inside</span>
          <h2>One system, three dashboards</h2>
        </div>
        <div className="home__feature-grid">
          {FEATURES.map((f) => (
            <Card key={f.title} accent="primary" className="home__feature-card">
              <span className="home__feature-icon">{f.icon}</span>
              <h3 className="home__feature-title">{f.title}</h3>
              <p className="home__feature-text">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="home__cta">
        <h2>Ready to modernize your society's front gate?</h2>
        <p>Registration takes two minutes. Approval by your admin usually takes less time than that.</p>
        <Link to="/register">
          <Button size="lg">Create Your Account</Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
