import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import { DataTable } from '../DataTable';

// Mock the table component
jest.mock('@/components/ui/table', () => ({
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableHeader: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
    TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}));

// Mock the button component
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

describe('DataTable', () => {
    const mockData = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const mockColumns = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
    ];

    it('renders table with correct data', () => {
        render(<DataTable columns={mockColumns} data={mockData} />);

        // Check if column headers are rendered
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();

        // Check if data is rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('handles sorting', () => {
        render(<DataTable columns={mockColumns} data={mockData} />);

        // Click on Name header to sort
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);

        // Check if data is sorted
        const cells = screen.getAllByRole('cell');
        expect(cells[0]).toHaveTextContent('Jane Smith');
        expect(cells[1]).toHaveTextContent('jane@example.com');
    });

    it('handles empty data', () => {
        render(<DataTable columns={mockColumns} data={[]} />);
        expect(screen.getByText('No results.')).toBeInTheDocument();
    });

    it('handles pagination', () => {
        const manyItems = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Person ${i + 1}`,
            email: `person${i + 1}@example.com`,
        }));

        render(<DataTable columns={mockColumns} data={manyItems} />);

        // Check if pagination controls are rendered
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

        // Navigate to next page
        fireEvent.click(screen.getByLabelText('Go to next page'));

        // Check if page 2 items are rendered
        expect(screen.getByText('Person 11')).toBeInTheDocument();
    });

    it('handles row selection', () => {
        const onRowSelect = jest.fn();
        render(
            <DataTable
                columns={mockColumns}
                data={mockData}
                onRowSelect={onRowSelect}
            />
        );

        // Click on a row
        fireEvent.click(screen.getByText('John Doe'));
        expect(onRowSelect).toHaveBeenCalledWith(mockData[0]);
    });

    it('applies custom styling', () => {
        const customClass = 'custom-table';
        render(
            <DataTable
                columns={mockColumns}
                data={mockData}
                className={customClass}
            />
        );

        expect(screen.getByRole('table')).toHaveClass(customClass);
    });
});
