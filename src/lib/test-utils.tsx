import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

// Create a custom render function that includes providers
function render(ui: React.ReactElement, { session = null, ...options } = {}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <SessionProvider session={session}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </SessionProvider>
        );
    }

    return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };
