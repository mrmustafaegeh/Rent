'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { currencies, CurrencyCode } from '@/lib/currency';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'; 
import { DollarSign, ChevronDown } from 'lucide-react';

export function CurrencySwitcher() {
  const { currency: currentCode, setCurrency } = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currencyList = Object.values(currencies);
  const currentCurrency = currencies[currentCode];

  if (!mounted) return (
    <div className="flex items-center gap-1 opacity-50 px-2 cursor-wait">
       <DollarSign className="h-4 w-4" />
       <span className="uppercase text-sm">{currentCode}</span>
       <ChevronDown className="h-3 w-3 opacity-50" />
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 hover:text-white transition-colors outline-none px-2"
          aria-label="Change currency"
        >
          <span className="text-gold font-bold text-sm">{currentCurrency.symbol}</span>
          <span className="uppercase text-sm">{currentCurrency.code}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border-white/10 text-popover-foreground min-w-[120px] shadow-2xl">
        {currencyList.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code as CurrencyCode)}
            className={`cursor-pointer transition-colors focus:bg-white/10 focus:text-white flex justify-between items-center ${
              currentCode === c.code ? 'text-gold font-bold bg-white/5' : 'text-white/80'
            }`}
          >
            <span>{c.code}</span>
            <span className="text-gold opacity-50">{c.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
