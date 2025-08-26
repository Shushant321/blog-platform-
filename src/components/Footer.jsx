import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Github, Twitter, Linkedin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <PenTool size={24} />
              <span>BlogPlatform</span>
            </div>
            <p className="footer-description">
              A modern blogging platform where writers share their thoughts, 
              connect with readers, and build a community around great content.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul className="footer-links">
              <li><Link to="/writers">Writers</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/guidelines">Guidelines</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Github">
                <Github size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 BlogPlatform. All rights reserved.</p>
          <p>Built with React, Express, and MongoDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;