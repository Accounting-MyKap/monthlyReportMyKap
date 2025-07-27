import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('formats numbers as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(1000.50)).toBe('$1,001');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(-1000)).toBe('-$1,000');
  });
});