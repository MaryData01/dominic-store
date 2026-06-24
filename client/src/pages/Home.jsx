import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Keyboard, Mouse, Headphones, Monitor, Gamepad, Armchair, Video, Lightbulb, ArrowDown, Star, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { useCurrency } from '../store/CurrencyContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

const categories = [
  { name: 'Keyboards', icon: Keyboard, slug: 'keyboards' },
  { name: 'Mice', icon: Mouse, slug: 'mice' },
  { name: 'Headsets', icon: Headphones, slug: 'headsets' },
  { name: 'Monitors', icon: Monitor, slug: 'monitors' },
  { name: 'Controllers', icon: Gamepad, slug: 'controllers' },
  { name: 'Chairs', icon: Armchair, slug: 'chairs' },
  { name: 'Capture Cards', icon: Video, slug: 'capture-cards' },
  { name: 'Lighting', icon: Lightbulb, slug: 'lighting' },
];

const Home = () => {
  const { formatPrice } = useCurrency();
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const res = await api.get('/products?featured=true&limit=8');
      return res.data.products;
    },
  });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 lg:py-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-violet/10 via-bg-base to-bg-base -z-10" />
        
        {/* Abstract pattern right side */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none -z-10 flex items-center justify-center">
           <div className="w-[800px] h-[800px] border-[1px] border-brand-cyan rounded-full absolute mix-blend-screen animate-[spin_60s_linear_infinite]" />
           <div className="w-[600px] h-[600px] border-[1px] border-brand-violet rounded-full absolute mix-blend-screen animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] mb-6 tracking-tight"
              >
                GEAR UP. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">PLAY DIFFERENT.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-body text-base sm:text-lg text-text-secondary mb-10 max-w-lg leading-relaxed"
              >
                Premium gaming peripherals for setups that mean business. Curated gear for gamers, streamers, and enthusiasts.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  to="/products" 
                  className="px-8 py-4 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-base font-display font-bold text-lg rounded-lg transition-colors"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/build" 
                  className="px-8 py-4 bg-transparent border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 font-display font-bold text-lg rounded-lg transition-colors"
                >
                  Build My Setup
                </Link>
              </motion.div>
            </div>
            
            {/* Hero Visual Area */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="flex relative h-[300px] sm:h-[450px] lg:h-[600px] w-full items-center justify-center perspective-[1000px]"
            >
               <div className="relative w-full max-w-md aspect-[3/4] bg-bg-raised border border-bg-border rounded-2xl shadow-[0_0_80px_rgba(124,58,237,0.15)] overflow-hidden transform lg:rotate-y-[-15deg] lg:rotate-x-[5deg] hover:lg:rotate-y-0 hover:lg:rotate-x-0 transition-transform duration-700 ease-out">
                  <img 
                    src="https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto/f_auto/v1781689186/This_Gaming_Setup_Looks_Unreal_ioiixj.jpg" 
                    alt="Dominic Store Setup" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
               </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted animate-bounce"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Category Strips */}
      <section className="py-20 bg-bg-surface border-y border-bg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-xs tracking-widest uppercase text-brand-cyan mb-8 font-semibold">SHOP BY CATEGORY</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link 
                to={`/products?category=${cat.slug}`} 
                key={cat.name}
                className="group flex flex-col items-center justify-center p-8 bg-bg-base rounded-xl border border-bg-border hover:border-brand-cyan/50 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] hover:-translate-y-1"
              >
                <cat.icon className="w-10 h-10 text-text-muted group-hover:text-brand-cyan transition-colors mb-4" />
                <h3 className="font-display font-bold text-lg text-text-primary group-hover:text-brand-cyan transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-body text-xs tracking-widest uppercase text-brand-cyan mb-2 font-semibold">FEATURED GEAR</p>
            <h2 className="font-display text-4xl font-bold text-text-primary uppercase tracking-wide">Hand-picked for elite setups</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(n => (
                <SkeletonProductCard key={n} />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {}
              }}
            >
              {featuredData?.map(product => (
                <motion.div key={product._id} variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 }
                }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Setup Showcase Section */}
      <section className="py-24 bg-bg-surface border-y border-bg-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-violet/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-brand-cyan mb-2 font-semibold">BUILD YOUR SETUP</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary uppercase tracking-wide mb-6">Every component.<br/>One place.</h2>
              <p className="font-body text-lg text-text-secondary mb-8 leading-relaxed">
                Stop jumping between tabs. Use our Setup Builder to select your monitor, keyboard, mouse, and accessories, see the live total, and checkout in one click.
              </p>
              <div className="flex gap-4">
                <Link to="/build" className="px-6 py-3 bg-brand-violet hover:bg-brand-violet/90 text-text-primary font-display font-bold text-lg rounded-lg transition-colors">
                  Start the Setup Builder
                </Link>
                <Link to="/products" className="px-6 py-3 text-text-primary hover:text-brand-cyan font-display font-bold text-lg rounded-lg transition-colors flex items-center">
                  Browse All Products →
                </Link>
              </div>
            </div>
            
            {/* Setup Builder Mockup UI */}
            <div className="bg-bg-base border border-bg-border rounded-xl p-6 shadow-2xl relative">
               <div className="absolute top-4 right-4 flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-status-error/50"></div>
                 <div className="w-3 h-3 rounded-full bg-status-warning/50"></div>
                 <div className="w-3 h-3 rounded-full bg-status-success/50"></div>
               </div>
               <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="col-span-1 flex flex-row sm:flex-col gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                   {['Monitor', 'Keyboard', 'Mouse', 'Headset'].map((item, i) => (
                     <div key={item} className={`p-2.5 sm:p-3 rounded border text-xs sm:text-sm font-mono whitespace-nowrap ${i===1 ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 'bg-bg-raised border-bg-border text-text-muted'}`}>
                       {item}
                     </div>
                   ))}
                 </div>
                 <div className="sm:col-span-2 bg-bg-raised rounded border border-bg-border p-4 flex flex-col justify-between min-h-[180px] sm:min-h-0">
                   <div className="w-full h-24 sm:h-32 bg-bg-base rounded mb-4 flex items-center justify-center text-text-muted border border-dashed border-bg-border text-sm">Preview Area</div>
                   <div className="flex justify-between items-center">
                     <span className="font-mono text-text-secondary text-sm">Total: {formatPrice(450000)}</span>
                     <div className="h-8 w-24 bg-brand-cyan rounded"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Teaser */}
      <section className="py-20 bg-bg-raised border-b border-bg-border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <MessageSquare className="w-12 h-12 text-brand-cyan mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold text-text-primary uppercase tracking-wide mb-4">Meet your AI gaming advisor</h2>
          <p className="font-body text-lg text-text-secondary mb-8">
            Not sure what to buy? Describe your game, budget, or setup — get instant gear recommendations from NEXUS, our AI expert.
          </p>
          <Link to="/assistant" className="inline-block px-8 py-4 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan/10 font-display font-bold text-lg rounded-lg transition-colors">
            Try the AI Assistant →
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'AlexTheGreat', platform: 'Twitch Partner', quote: "Dominic Store has the best curation of gear in Nigeria. The delivery was fast and the quality is unmatched." },
              { name: 'SarahFPS', platform: 'Esports Pro', quote: "I built my entire streaming setup using their Setup Builder. It saved me hours of research." },
              { name: 'CodeNinja', platform: 'Setup Enthusiast', quote: "The aesthetic of the site matches the premium quality of the gear. 10/10 shopping experience." },
            ].map((t, i) => (
              <div key={i} className="p-8 bg-bg-surface rounded-xl border border-bg-border">
                <div className="flex text-brand-cyan mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="font-body text-text-secondary italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-display font-bold text-text-primary text-lg">{t.name}</p>
                  <p className="font-body text-xs text-text-muted">{t.platform}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
