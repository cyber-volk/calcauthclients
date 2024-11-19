import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

// Mock user database
const users = {
    admin: {
        id: '1',
        username: 'admin',
        password: 'admin',
        role: 'admin'
    },
    agent: {
        id: '2',
        username: 'agent',
        password: 'agent',
        role: 'agent'
    },
    user: {
        id: '3',
        username: 'user',
        password: 'user',
        role: 'user'
    }
};

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Find user in our mock database
        const user = Object.values(users).find(
            u => u.username === username && u.password === password
        );

        if (user) {
            // Create JWT token using jose
            const token = await new SignJWT({
                id: user.id,
                username: user.username,
                role: user.role
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('1d')
                .sign(JWT_SECRET);

            // Set cookie
            cookies().set('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400 // 1 day
            });

            return NextResponse.json({
                id: user.id,
                username: user.username,
                role: user.role
            });
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
