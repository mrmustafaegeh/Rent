import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '', 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (!user.email) return false;
                if (account?.provider === 'google' || account?.provider === 'facebook') {
                    await dbConnect();
                    
                    if (!user.email) return false;
                    const existingUser = await User.findOne({ email: user.email as string });

                    if (!existingUser) {
                        await User.create({
                            firstName: (user.name || 'User').split(' ')[0],
                            lastName: (user.name || '').split(' ')[1] || '',
                            email: user.email as string,
                            image: user.image || undefined,
                            password: Math.random().toString(36).slice(-8), 
                            role: 'customer',
                            provider: account.provider
                        });
                        return true;
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
                await dbConnect();
                if (user && user.email) {
                    // Initial sign in
                    const dbUser = await User.findOne({ email: user.email as string });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                    }
                } else if (token.email) {
                    // Subsequent requests - refresh role from DB
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.role = dbUser.role;
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
