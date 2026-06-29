import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="logo">
        <Brain size={28} className="logo-icon" />
        <span>ResumeIQ AI</span>
      </div>
      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#free-features">Free Features</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <div className="nav-actions">
        <Link to="/login" style={{ display: 'inline-block' }}>
          <Button variant="secondary" className="mr-4">Login</Button>
        </Link>
        <Link to="/register" style={{ display: 'inline-block' }}>
          <Button variant="primary">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};
