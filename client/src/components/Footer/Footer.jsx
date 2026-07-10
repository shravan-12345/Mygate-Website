import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-mark">S</span>
          <span>SocietyManage</span>
        </div>
        <nav className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Log In</Link>
        </nav>
        <p className="footer__copy">© {year} SocietyManage. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
