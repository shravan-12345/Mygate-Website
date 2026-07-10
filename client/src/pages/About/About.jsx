import React from 'react';
import './About.css';

const STEPS = [
  {
    role: 'Resident',
    text: 'Pre-register a guest and share a QR code, or approve/reject a walk-in request from your phone the moment the guard logs it.',
  },
  {
    role: 'Security Guard',
    text: 'Log a guest or delivery at the gate in seconds. Scan a pre-registered QR code to skip the approval wait entirely.',
  },
  {
    role: 'Society Admin',
    text: 'Approve new residents and guards, manage notices and maintenance, and keep an eye on everything from one dashboard.',
  },
];

const About = () => {
  return (
    <div className="about">
      <section className="about__intro">
        <h1>Built around the front gate</h1>
        <p>
          Most society-management tools are spreadsheets wearing a login page. SocietyManage starts from
          the one place every visitor, delivery, and complaint actually passes through — the gate — and
          builds outward from there.
        </p>
      </section>

      <section className="about__steps">
        {STEPS.map((step, i) => (
          <div className="about__step" key={step.role}>
            <span className="about__step-index">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.role}</h3>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="about__values">
        <div className="about__value">
          <h3>No paper register</h3>
          <p>Every visitor is timestamped, photographed, and searchable — not scribbled in a logbook.</p>
        </div>
        <div className="about__value">
          <h3>Approval, not assumption</h3>
          <p>A guard never has to guess whether a visitor is welcome. The resident decides, in real time.</p>
        </div>
        <div className="about__value">
          <h3>One login per person</h3>
          <p>Role-based dashboards mean residents, guards, and admins each see exactly what they need.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
