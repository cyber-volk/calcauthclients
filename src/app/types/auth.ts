export type Role = 'user' | 'agent' | 'admin';

export interface User {
    id: string;
    username: string;
    role: Role;
    agentId?: string; // For users created by agents
}

export interface Agent {
    id: string;
    username: string;
    maxUsers: number;
    currentUsers: number;
}

export interface Site {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    // Add other site-specific fields
}

export interface Form {
    id: string;
    name: string;
    userId: string;
    siteId: string;
    createdAt: Date;
    // Add form-specific fields
}
