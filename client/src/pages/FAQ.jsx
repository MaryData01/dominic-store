import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQ = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center max-w-4xl mx-auto py-16">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <HelpCircle className="w-20 h-20 text-brand-cyan mb-6" />
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-wide mb-4 uppercase">
          Frequently Asked Questions
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-violet rounded-full mb-8"></div>
        <p className="font-body text-lg text-text-secondary max-w-lg mb-6">
          We are setting up our help center. Full FAQ is coming soon!
        </p>
        <div className="bg-bg-surface border border-bg-border rounded-xl p-8 text-left w-full max-w-2xl mb-10">
          <h3 className="font-display font-bold text-xl text-text-primary mb-3">When will my order ship?</h3>
          <p className="font-body text-text-secondary mb-6">Orders are processed manually and shipped via standard premium logistics within 2-3 business days. Tracked information will be shared with you.</p>
          <h3 className="font-display font-bold text-xl text-text-primary mb-3">Do you ship nationwide?</h3>
          <p className="font-body text-text-secondary">Yes, we deliver gaming hardware and setups across Nigeria.</p>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 px-8 py-4 rounded-lg font-bold transition-colors"
        >
          Return to Base <ChevronRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
};

export default FAQ;
