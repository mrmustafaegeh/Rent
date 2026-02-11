'use client';

import { useEffect, useState } from 'react';

declare global {
    interface Window {
        grecaptcha: any;
    }
}

interface UseRecaptchaReturn {
    executeRecaptcha: (action: string) => Promise<string | null>;
    ready: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

        if (!siteKey) {
            console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured');
            setReady(true); // Allow to proceed in development
            return;
        }

        // Load reCAPTCHA script
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.grecaptcha) {
                window.grecaptcha.ready(() => {
                    console.log('✅ reCAPTCHA loaded and ready');
                    setReady(true);
                });
            }
        };

        script.onerror = () => {
            console.error('❌ Failed to load reCAPTCHA script');
            setReady(true); // Allow to proceed anyway
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    const executeRecaptcha = async (action: string): Promise<string | null> => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

        if (!siteKey) {
            console.warn('⚠️ reCAPTCHA not configured, skipping...');
            return null;
        }

        if (!ready || !window.grecaptcha) {
            console.warn('⚠️ reCAPTCHA not ready yet');
            return null;
        }

        try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            console.log(`✅ reCAPTCHA token generated for action: ${action}`);
            return token;
        } catch (error) {
            console.error('❌ reCAPTCHA execution failed:', error);
            return null;
        }
    };

    return { executeRecaptcha, ready };
}
