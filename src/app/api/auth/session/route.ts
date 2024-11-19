import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        const token = cookies().get('auth-token');

        if (!token) {
            return NextResponse.json(null);
        }

        const user = verify(token.value, JWT_SECRET);
        return NextResponse.json(user);
    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json(null);
    }
}
