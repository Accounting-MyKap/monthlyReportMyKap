import { useState, useEffect } from 'react';
import { fetchFinancialData } from '../utils/sheetsService';

/**
 * Hook that loads financial data from Google Sheets.
 * Returns { data, allMonths, loading, error }
 */
export function useFinancialData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFinancialData();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const allMonths = data.map(d => d.month);

  return { data, allMonths, loading, error };
}
