import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../store/CurrencyContext';

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurrency = CURRENCIES[currency];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-11 px-3 bg-bg-surface border border-bg-border rounded-lg text-text-secondary hover:text-brand-cyan transition-colors text-sm font-mono focus:outline-none"
      >
        <span>{activeCurrency.symbol}<span className="hidden lg:inline"> {currency}</span></span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-cyan' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-bg-surface border border-bg-border rounded-lg shadow-xl py-1 z-50 animate-fadeIn">
          {Object.keys(CURRENCIES).map((code) => {
            const cur = CURRENCIES[code];
            const isSelected = code === currency;
            return (
              <button
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-mono flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'text-brand-cyan bg-brand-cyan/5 border-l-2 border-brand-cyan font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-raised'
                }`}
              >
                <span>{cur.symbol} {code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
