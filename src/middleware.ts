import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create a new ratelimiter
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
});

// Role-based route access
const roleRoutes = {
    admin: ['/dashboard/admin'],
    agent: ['/dashboard/agent'],
    user: ['/dashboard/user']
};

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Apply rate limiting to API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        try {
            const ip = request.ip ?? '127.0.0.1';
            const { success } = await ratelimit.limit(ip);
            
            if (!success) {
                return NextResponse.json(
                    { error: 'Too many requests' },
                    { status: 429 }
                );
            }
        } catch (error) {
            console.error('Rate limit error:', error);
        }
    }

    // Check authentication and role-based access for dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('auth-token');

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const decoded = verify(token.value, JWT_SECRET) as { role: string };
            const role = decoded.role;
            const path = request.nextUrl.pathname;

            // Check if user has access to this route
            const hasAccess = roleRoutes[role as keyof typeof roleRoutes]?.some(
                route => path.startsWith(route)
            );

            if (!hasAccess) {
                // Redirect to appropriate dashboard based on role
                return NextResponse.redirect(
                    new URL(`/dashboard/${role}`, request.url)
                );
            }
        } catch (error) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/:path*'
    ]
};
