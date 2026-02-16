'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, currencies } from '@/lib/currency';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    formatPrice: (price: number, sourceCurrency?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user-currency') as CurrencyCode;
        if (saved && currencies[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem('user-currency', code);
    };

    const formatPriceFn = (price: number, sourceCurrency: CurrencyCode = 'EUR') => {
        const curr = currencies[currency];
        const converted = Math.round((price / currencies[sourceCurrency].rate) * curr.rate);
        
        // Custom formatting logic to ensure symbols are correctly placed
        if (currency === 'TRY') {
            return `${converted.toLocaleString()} ${curr.symbol}`;
        }
        return `${curr.symbol}${converted.toLocaleString()}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice: formatPriceFn }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
