import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KpiCard from './KpiCard';
import { Target } from 'lucide-react';

describe('KpiCard', () => {
  const mockThemeConfig = {
    light: {
      card: 'bg-white',
      accent: 'text-cyan-600',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-500',
    },
  };

  it('renders correctly with props', () => {
    render(
      <KpiCard 
        icon={Target} 
        title="Approval Rate" 
        value="96.67%" 
        theme="light" 
        themeConfig={mockThemeConfig}
      />
    );

    expect(screen.getByText('Approval Rate')).toBeInTheDocument();
    expect(screen.getByText('96.67%')).toBeInTheDocument();
  });
});