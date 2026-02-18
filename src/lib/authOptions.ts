import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '', 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID || '',
            clientSecret: process.env.APPLE_SECRET || ''
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (!user.email) return false;
                
                if (['google', 'facebook', 'apple'].includes(account?.provider || '')) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email }
                    });

                    if (!existingUser) {
                        try {
                            await prisma.user.create({
                                data: {
                                    name: user.name || 'User',
                                    email: user.email,
                                    image: user.image,
                                    password: Math.random().toString(36).slice(-8), // Dummy password for OAuth users
                                    role: 'CUSTOMER',
                                    isActive: true
                                }
                            });
                        } catch (createError) {
                            console.error('Error creating user during OAuth:', createError);
                            return false;
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error('Error during social sign in:', error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            try {
                if (user && user.email) {
                    // Initial sign in or update
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                    }
                } else if (token.email) {
                    // Subsequent requests - refresh role from DB
                    const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
                    if (dbUser) {
                        token.role = dbUser.role;
                        token.id = dbUser.id; // ensure ID is always fresh if needed
                    }
                }
            } catch (error) {
                console.error("Error in JWT callback:", error);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error', 
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
};
