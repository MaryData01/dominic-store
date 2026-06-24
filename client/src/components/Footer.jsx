import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Github } from 'lucide-react';

const Footer = ({ hasStickyBottomBar }) => {
  return (
    <footer className={`bg-bg-surface border-t border-bg-border pt-16 ${hasStickyBottomBar ? 'pb-36 lg:pb-8' : 'pb-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Col */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl text-text-primary tracking-widest">
                DOMINIC<span className="text-brand-cyan">/</span>
              </span>
            </Link>
            <p className="font-body text-text-secondary mb-6 max-w-sm">
              Premium gaming peripherals for setups that mean business. Gear up. Play different.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-brand-cyan transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-text-secondary hover:text-brand-cyan transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-text-secondary hover:text-brand-cyan transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body text-text-secondary">
              <li><Link to="/products" className="hover:text-brand-cyan transition-colors">All Products</Link></li>
              <li><Link to="/build" className="hover:text-brand-cyan transition-colors">Build Setup</Link></li>
              <li><Link to="/assistant" className="hover:text-brand-cyan transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg text-text-primary mb-4">Support</h4>
            <ul className="space-y-3 font-body text-text-secondary">
              <li><Link to="/faq" className="hover:text-brand-cyan hover:underline transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-brand-cyan hover:underline transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/warranty" className="hover:text-brand-cyan hover:underline transition-colors">Warranty</Link></li>
              <li><Link to="/contact" className="hover:text-brand-cyan hover:underline transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-bg-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Dominic Store. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-text-muted">
            <span className="mr-2">Secured by</span>
            <span className="font-display font-bold text-text-primary">paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
