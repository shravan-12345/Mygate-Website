import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button.jsx';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <h1>This page took a wrong turn at the gate</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
