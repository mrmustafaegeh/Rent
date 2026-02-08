import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import React from 'react';

// Mock svg because it might cause issues or just noise
vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react')>();
    return {
        ...actual,
    };
});

describe('Button Component', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
        render(<Button isLoading>Submit</Button>);
        // Assuming loading spinner is rendered, or button is disabled
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('applies variant classes', () => {
        const { container } = render(<Button variant="outline">Outline</Button>);
        // Check if class list contains outline styles (border)
        expect(container.firstChild).toHaveClass('border');
    });
});
