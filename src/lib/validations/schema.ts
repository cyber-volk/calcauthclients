import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
});

export const createUserSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    role: z.enum(['user', 'agent', 'admin']).default('user'),
});

export const updateUserSchema = z.object({
    id: z.string(),
    username: z.string().min(3).max(50).optional(),
    password: z.string().min(6).max(100).optional(),
});

export const createSiteSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
});

export const updateSiteSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

export const createFormSchema = z.object({
    name: z.string().min(1).max(100),
    data: z.string(),
    siteId: z.string(),
});

export const updateFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100).optional(),
    data: z.string().optional(),
});
