import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Warranty = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center max-w-4xl mx-auto py-16">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <ShieldCheck className="w-20 h-20 text-brand-cyan mb-6" />
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-wide mb-4 uppercase">
          Warranty Information
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-violet rounded-full mb-8"></div>
        <p className="font-body text-lg text-text-secondary max-w-lg mb-6">
          Warranty guidelines and repair claims process are coming soon.
        </p>
        <div className="bg-bg-surface border border-bg-border rounded-xl p-8 text-left w-full max-w-2xl mb-10">
          <h3 className="font-display font-bold text-xl text-text-primary mb-3">1-Year Limited Warranty</h3>
          <p className="font-body text-text-secondary mb-6">All premium products purchased from Dominic Store include a 1-year limited manufacturer warranty covering components and structural defects.</p>
          <h3 className="font-display font-bold text-xl text-text-primary mb-3">Claims Process</h3>
          <p className="font-body text-text-secondary">To start a warranty claim, please contact our support team with your order number, product details, and description of the technical issue.</p>
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

export default Warranty;
