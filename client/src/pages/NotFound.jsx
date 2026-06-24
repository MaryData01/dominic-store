import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <AlertTriangle className="w-24 h-24 text-brand-cyan mb-6" />
        <h1 className="font-display text-8xl font-bold text-text-primary tracking-tighter mb-2">
          404
        </h1>
        <h2 className="font-display text-3xl font-bold text-text-secondary uppercase tracking-widest mb-6">
          SIGNAL LOST
        </h2>
        <p className="font-body text-lg text-text-muted max-w-md mb-10">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base px-8 py-4 rounded-lg font-bold transition-colors"
        >
          <Home className="w-5 h-5" /> Return to Base
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
