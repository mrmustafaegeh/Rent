/**
 * reCAPTCHA v3 Integration
 * 
 * Server-side verification for Google reCAPTCHA v3
 */

interface RecaptchaVerifyResponse {
    success: boolean;
    score?: number;
    challenge_ts?: string;
    hostname?: string;
    'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string, expectedAction?: string): Promise<{
    success: boolean;
    score?: number;
    error?: string;
}> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.warn('⚠️ RECAPTCHA_SECRET_KEY not configured');
        // In development, you might want to skip verification
        if (process.env.NODE_ENV === 'development') {
            return { success: true, score: 1.0 };
        }
        return { success: false, error: 'reCAPTCHA not configured' };
    }

    if (!token) {
        return { success: false, error: 'No reCAPTCHA token provided' };
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data: RecaptchaVerifyResponse = await response.json();

        console.log('[reCAPTCHA] Verification result:', {
            success: data.success,
            score: data.score,
            action: expectedAction,
            hostname: data.hostname,
        });

        if (!data.success) {
            return {
                success: false,
                error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`,
            };
        }

        // Check score (0.0 - 1.0, higher is better)
        // 0.0 is very likely a bot, 1.0 is very likely a human
        const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');
        
        if (data.score !== undefined && data.score < minScore) {
            console.warn(`[reCAPTCHA] Low score detected: ${data.score} (min: ${minScore})`);
            return {
                success: false,
                score: data.score,
                error: `Bot-like behavior detected (score: ${data.score})`,
            };
        }

        return {
            success: true,
            score: data.score,
        };
    } catch (error) {
        console.error('[reCAPTCHA] Verification error:', error);
        return {
            success: false,
            error: 'Failed to verify reCAPTCHA',
        };
    }
}

/**
 * Middleware-style function to verify reCAPTCHA from request body
 */
export async function verifyRecaptchaFromRequest(
    requestBody: any,
    expectedAction?: string
): Promise<{ success: boolean; error?: string }> {
    const token = requestBody.recaptchaToken || requestBody.captchaToken;
    
    if (!token) {
        return {
            success: false,
            error: 'reCAPTCHA token missing from request',
        };
    }

    const result = await verifyRecaptcha(token, expectedAction);
    
    return {
        success: result.success,
        error: result.error,
    };
}
