import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Simple in-memory stores (replace with persistent DB like Prisma in real apps)
const users: Array<{ id: string; name: string; email: string; passwordHash: string }> = [];
const failedLoginAttempts = new Map<string, { count: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function isLocked(email: string): boolean {
    const data = failedLoginAttempts.get(email);
    if (!data) return false;
    if (Date.now() < data.lockedUntil) return true;
    failedLoginAttempts.delete(email); // lock expired
    return false;
}

function recordFailure(email: string) {
    const existing = failedLoginAttempts.get(email) || { count: 0, lockedUntil: 0 };
    existing.count += 1;
    if (existing.count >= MAX_ATTEMPTS) {
        existing.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60_000;
    }
    failedLoginAttempts.set(email, existing);
}

function resetFailures(email: string) {
    failedLoginAttempts.delete(email);
}

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credenciales",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const email = credentials.email.toLowerCase().trim();
                if (isLocked(email)) {
                    throw new Error("Cuenta bloqueada temporalmente por intentos fallidos. Intenta más tarde.");
                }

                const user = users.find((u) => u.email === email);
                if (!user) {
                    recordFailure(email);
                    throw new Error("Credenciales inválidas");
                }
                const ok = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!ok) {
                    recordFailure(email);
                    throw new Error("Credenciales inválidas");
                }
                resetFailures(email);
                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user as any;
            }
            return session;
        },
    },
};

// Temporary register function (for /api/register route to push users here)
export function registerUser(name: string, email: string, passwordHash: string) {
    const exists = users.some((u) => u.email === email);
    if (exists) throw new Error("Email ya registrado");
    const user = { id: crypto.randomUUID(), name, email, passwordHash };
    users.push(user);
    return user;
}



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };