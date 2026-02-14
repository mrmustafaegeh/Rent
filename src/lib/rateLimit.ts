import { NextResponse } from 'next/server';

// Simple in-memory rate limiter for demo purposes
// In production with multiple instances/serverless, use Redis (e.g., Upstash)
const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestTimestamps = rateLimitMap.get(ip) || [];
  const requestsInWindow = requestTimestamps.filter((timestamp: number) => timestamp > windowStart);

  if (requestsInWindow.length >= limit) {
    return true; // Rate limited
  }

  requestsInWindow.push(now);
  rateLimitMap.set(ip, requestsInWindow);
  
  // Cleanup old entries periodically (optional optimization)
  if (requestsInWindow.length > limit * 2) {
      rateLimitMap.set(ip, requestsInWindow.slice(-limit)); 
  }

  return false; // Not rate limited
}

export function getIp(request: Request) {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0];
  }
  return '127.0.0.1';
}
