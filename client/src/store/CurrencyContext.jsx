import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  NGN: { symbol: '₦', rate: 1, locale: 'en-NG', code: 'NGN' },
  USD: { symbol: '$', rate: 0.00063, locale: 'en-US', code: 'USD' },
  GBP: { symbol: '£', rate: 0.00050, locale: 'en-GB', code: 'GBP' },
  EUR: { symbol: '€', rate: 0.00058, locale: 'en-IE', code: 'EUR' },
  GHS: { symbol: '₵', rate: 0.0094, locale: 'en-GH', code: 'GHS' }
};

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('storeCurrency');
    return saved && CURRENCIES[saved] ? saved : 'NGN';
  });

  const setCurrency = (curr) => {
    if (CURRENCIES[curr]) {
      setCurrencyState(curr);
      localStorage.setItem('storeCurrency', curr);
    }
  };

  const convertPrice = (priceInNGN) => {
    const rate = CURRENCIES[currency].rate;
    return Number((priceInNGN * rate).toFixed(2));
  };

  const formatPrice = (priceInNGN) => {
    if (priceInNGN === undefined || priceInNGN === null) return '';
    const converted = convertPrice(priceInNGN);
    const info = CURRENCIES[currency];
    
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: info.code === 'NGN' ? 0 : 2,
      maximumFractionDigits: info.code === 'NGN' ? 0 : 2
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
