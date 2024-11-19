import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

// Define protected routes and their required roles
const protectedRoutes = {
    '/admin/dashboard': ['admin'],
    '/admin/calculator': ['admin'],
    '/agent/dashboard': ['admin', 'agent'],
    '/agent/calculator': ['admin', 'agent'],
    '/user/dashboard': ['admin', 'agent', 'user'],
    '/user/calculator': ['admin', 'agent', 'user']
};

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if it's a protected route
    const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
        pathname.startsWith(route)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Get the token from the cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
    }

    try {
        // Verify the token
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userRole = payload.role as string;

        // Check if user has required role for this route
        const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
            pathname.startsWith(route)
        )?.[1];

        if (!requiredRoles?.includes(userRole)) {
            const url = new URL('/login', request.url);
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Token verification failed:', error);
        const url = new URL('/login', request.url);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/agent/:path*',
        '/user/:path*'
    ]
};
