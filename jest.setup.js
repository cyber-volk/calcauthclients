// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Request and Response
global.Request = class {
    constructor() {
        return {};
    }
};

global.Response = class {
    constructor() {
        return {};
    }
};

// Mock next/router
jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '',
            query: '',
            asPath: '',
            push: jest.fn(),
            replace: jest.fn(),
        };
    },
}));

// Mock next-auth
jest.mock('next-auth/react', () => {
    return {
        useSession: jest.fn(() => ({
            data: null,
            status: 'unauthenticated',
        })),
    };
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
