const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetches a range from Google Sheets API v4
 */
async function fetchSheet(spreadsheetId, sheetName, apiKey) {
  const range = encodeURIComponent(`${sheetName}!A:ZZ`);
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${range}?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(`Sheets API error (${response.status}): ${err?.error?.message || response.statusText}`);
  }
  const result = await response.json();
  return result.values || [];
}

/**
 * Converts a 2D array (first row = headers) to an array of objects keyed by month.
 * Returns a Map: month -> { field: value, ... }
 */
function parseSheetToMap(values) {
  if (!values || values.length < 2) return new Map();
  const [headers, ...rows] = values;
  const map = new Map();
  for (const row of rows) {
    const obj = {};
    headers.forEach((header, i) => {
      const raw = row[i];
      if (raw === undefined || raw === '') {
        obj[header] = 0;
      } else {
        const num = Number(raw);
        obj[header] = isNaN(num) ? raw : num;
      }
    });
    if (obj.month) {
      map.set(obj.month, obj);
    }
  }
  return map;
}

/**
 * Merges breakdown maps into each month object as a nested object.
 * Headers beyond "month" become keys of the nested object.
 */
function mergeBreakdown(mainMap, breakdownValues, breakdownKey) {
  if (!breakdownValues || breakdownValues.length < 2) return;
  const [headers, ...rows] = breakdownValues;
  const dataHeaders = headers.slice(1); // skip "month" column

  for (const row of rows) {
    const month = row[0];
    if (!month || !mainMap.has(month)) continue;
    const breakdown = {};
    dataHeaders.forEach((header, i) => {
      const raw = row[i + 1];
      const num = Number(raw);
      breakdown[header] = (raw === undefined || raw === '') ? 0 : (isNaN(num) ? raw : num);
    });
    mainMap.get(month)[breakdownKey] = breakdown;
  }
}

/**
 * Fetches all financial data from Google Sheets and returns it in the same
 * format as the local financialData array.
 */
export async function fetchFinancialData() {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

  if (!spreadsheetId || !apiKey) {
    throw new Error(
      'Google Sheets no configurado. Agrega VITE_GOOGLE_SHEETS_ID y VITE_GOOGLE_SHEETS_API_KEY en tu archivo .env.local'
    );
  }

  const [mainValues, incomeValues, expenseValues, assetValues, liabilityValues, equityValues] =
    await Promise.all([
      fetchSheet(spreadsheetId, 'Main', apiKey),
      fetchSheet(spreadsheetId, 'IncomeBreakdown', apiKey),
      fetchSheet(spreadsheetId, 'ExpenseBreakdown', apiKey),
      fetchSheet(spreadsheetId, 'AssetBreakdown', apiKey),
      fetchSheet(spreadsheetId, 'LiabilityBreakdown', apiKey),
      fetchSheet(spreadsheetId, 'EquityBreakdown', apiKey),
    ]);

  const mainMap = parseSheetToMap(mainValues);

  mergeBreakdown(mainMap, incomeValues, 'incomeBreakdown');
  mergeBreakdown(mainMap, expenseValues, 'expenseBreakdown');
  mergeBreakdown(mainMap, assetValues, 'assetBreakdown');
  mergeBreakdown(mainMap, liabilityValues, 'liabilityBreakdown');
  mergeBreakdown(mainMap, equityValues, 'equityBreakdown');

  return Array.from(mainMap.values());
}
