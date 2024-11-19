import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../route';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth';

// Mock next-auth
jest.mock('next-auth');
const mockGetServerSession = getServerSession as jest.Mock;

// Mock prisma
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        agent: {
            findUnique: jest.fn(),
        },
    },
}));

describe('Users API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/users', () => {
        it('should return 401 if not authenticated', async () => {
            mockGetServerSession.mockResolvedValueOnce(null);

            const request = new NextRequest('http://localhost/api/users');
            const response = await GET(request);

            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({ error: 'Unauthorized' });
        });

        it('should return users for admin', async () => {
            const mockUsers = [
                { id: '1', username: 'user1' },
                { id: '2', username: 'user2' },
            ];

            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'admin-id', role: 'admin' },
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
                id: 'admin-id',
                role: 'admin',
            });

            (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);

            const request = new NextRequest('http://localhost/api/users');
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockUsers);
        });

        it('should return only assigned users for agent', async () => {
            const mockUsers = [{ id: '1', username: 'user1' }];

            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'agent-id', role: 'agent' },
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
                id: 'agent-id',
                role: 'agent',
            });

            (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);

            const request = new NextRequest('http://localhost/api/users');
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockUsers);
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                where: { agentId: 'agent-id' },
                include: { sites: true, forms: true },
            });
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'newuser',
                password: 'password123',
                role: 'user',
            };

            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'admin-id', role: 'admin' },
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
                id: 'admin-id',
                role: 'admin',
            });

            (prisma.user.create as jest.Mock).mockResolvedValueOnce({
                id: '3',
                ...newUser,
                password: 'hashed-password',
            });

            const request = new NextRequest('http://localhost/api/users', {
                method: 'POST',
                body: JSON.stringify(newUser),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty('id');
            expect(data.username).toBe(newUser.username);
            expect(data).not.toHaveProperty('password');
        });

        it('should enforce agent user limit', async () => {
            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'agent-id', role: 'agent' },
            });

            (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
                id: 'agent-id',
                role: 'agent',
                _count: { users: 10 },
            });

            (prisma.agent.findUnique as jest.Mock).mockResolvedValueOnce({
                id: 'agent-id',
                maxUsers: 10,
            });

            const request = new NextRequest('http://localhost/api/users', {
                method: 'POST',
                body: JSON.stringify({
                    username: 'newuser',
                    password: 'password123',
                }),
            });

            const response = await POST(request);
            expect(response.status).toBe(400);
            expect(await response.json()).toEqual({
                error: 'Maximum user limit reached',
            });
        });
    });

    describe('DELETE /api/users', () => {
        it('should delete a user', async () => {
            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'admin-id', role: 'admin' },
            });

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: 'admin-id',
                    role: 'admin',
                })
                .mockResolvedValueOnce({
                    id: 'user-id',
                    agentId: null,
                });

            (prisma.user.delete as jest.Mock).mockResolvedValueOnce({
                id: 'user-id',
            });

            const url = new URL('http://localhost/api/users');
            url.searchParams.set('id', 'user-id');
            const request = new NextRequest(url);

            const response = await DELETE(request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ success: true });
        });

        it('should prevent unauthorized deletion', async () => {
            mockGetServerSession.mockResolvedValueOnce({
                user: { id: 'agent-id', role: 'agent' },
            });

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: 'agent-id',
                    role: 'agent',
                })
                .mockResolvedValueOnce({
                    id: 'user-id',
                    agentId: 'other-agent-id',
                });

            const url = new URL('http://localhost/api/users');
            url.searchParams.set('id', 'user-id');
            const request = new NextRequest(url);

            const response = await DELETE(request);
            expect(response.status).toBe(401);
            expect(await response.json()).toEqual({ error: 'Unauthorized' });
        });
    });
});
