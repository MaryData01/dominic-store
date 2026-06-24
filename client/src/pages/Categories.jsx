import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Mouse, Headphones, Monitor, Gamepad, Armchair, Video, Lightbulb, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Keyboards', icon: Keyboard, slug: 'keyboards', desc: 'Premium mechanical and optical gaming keyboards' },
  { name: 'Mice', icon: Mouse, slug: 'mice', desc: 'Ultra-lightweight wireless and high-precision mice' },
  { name: 'Headsets', icon: Headphones, slug: 'headsets', desc: 'High-fidelity audio with spatial sound and clear mics' },
  { name: 'Monitors', icon: Monitor, slug: 'monitors', desc: 'Fast refresh rate gaming monitors and QD-OLED panels' },
  { name: 'Controllers', icon: Gamepad, slug: 'controllers', desc: 'Pro-grade controllers and custom gamepads' },
  { name: 'Chairs', icon: Armchair, slug: 'chairs', desc: 'Ergonomic gaming chairs designed for all-day comfort' },
  { name: 'Capture Cards', icon: Video, slug: 'capture-cards', desc: 'Ultra-low latency game capture hardware' },
  { name: 'Lighting', icon: Lightbulb, slug: 'lighting', desc: 'Vibrant smart lighting and desk ambient panels' },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const SkeletonCategoryCard = () => (
  <div className="flex flex-col justify-between p-4 sm:p-8 bg-bg-surface border border-bg-border rounded-2xl">
    <div>
      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-bg-raised animate-pulse rounded-xl mb-4 sm:mb-6" />
      <div className="h-5 sm:h-6 w-20 sm:w-24 bg-bg-raised animate-pulse rounded mb-2 sm:mb-3" />
      <div className="space-y-2 mb-4 sm:mb-6">
        <div className="h-3 sm:h-4 w-full bg-bg-raised animate-pulse rounded" />
        <div className="h-3 sm:h-4 w-3/4 bg-bg-raised animate-pulse rounded" />
      </div>
    </div>
    <div className="h-3 sm:h-4 w-20 sm:w-28 bg-bg-raised animate-pulse rounded" />
  </div>
);

const Categories = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="h-10 w-64 bg-bg-raised animate-pulse rounded mx-auto mb-4" />
          <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-violet rounded-full mx-auto mt-4 mb-6" />
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="h-4 w-full bg-bg-raised animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-bg-raised animate-pulse rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <SkeletonCategoryCard key={n} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary tracking-wide uppercase">
          Browse by Category
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-violet rounded-full mx-auto mt-4 mb-6"></div>
        <p className="font-body text-text-secondary text-lg max-w-xl mx-auto">
          Explore our collection of hand-picked premium gaming peripherals and hardware to elevate your battle station.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, i) => (
          <Link 
            to={`/products?category=${cat.slug}`} 
            key={cat.name}
            className="group flex flex-col justify-between p-4 sm:p-8 bg-bg-surface border border-bg-border rounded-2xl hover:border-brand-cyan/50 transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.08)] hover:-translate-y-1"
          >
            <div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-bg-base border border-bg-border rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:border-brand-cyan/30 transition-colors">
                <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-text-muted group-hover:text-brand-cyan transition-colors" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-2xl text-text-primary group-hover:text-brand-cyan transition-colors mb-2">
                {cat.name}
              </h3>
              <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 sm:mb-6">
                {cat.desc}
              </p>
            </div>
            <div className="flex items-center text-xs sm:text-sm font-semibold text-brand-cyan group-hover:underline">
              Explore Gear <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Categories;
