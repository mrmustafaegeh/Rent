export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'TRY';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Rate relative to EUR (base)
}

export const currencies: Record<CurrencyCode, Currency> = {
    EUR: { code: 'EUR', symbol: '€', rate: 1 },
    USD: { code: 'USD', symbol: '$', rate: 1.08 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.85 },
    TRY: { code: 'TRY', symbol: '₺', rate: 34.50 },
};

export function convertPrice(price: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return price;
    
    // Convert to EUR first (base)
    const priceInEur = price / currencies[from].rate;
    
    // Convert from EUR to target
    return Math.round(priceInEur * currencies[to].rate);
}

export function formatPrice(price: number, targetCurrency: CurrencyCode, sourceCurrency: CurrencyCode = 'EUR'): string {
    const currency = currencies[targetCurrency];
    const converted = convertPrice(price, sourceCurrency, targetCurrency);
    
    // Custom formatting logic to ensure symbols are correctly placed
    if (targetCurrency === 'TRY') {
        return `${converted.toLocaleString()} ${currency.symbol}`;
    }
    return `${currency.symbol}${converted.toLocaleString()}`;
}
