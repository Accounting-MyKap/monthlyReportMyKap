#!/usr/bin/env node
/**
 * xlsx-to-json.js
 *
 * Converts an Excel file (.xlsx) with the MyKap financial data format
 * into the financialData.js module used by the dashboard.
 *
 * Expected sheet structure (same as the Google Sheets integration):
 *   Main            — one row per month, flat fields
 *   IncomeBreakdown
 *   ExpenseBreakdown
 *   AssetBreakdown
 *   LiabilityBreakdown
 *   EquityBreakdown
 *
 * Usage:
 *   node scripts/xlsx-to-json.js path/to/file.xlsx
 *   node scripts/xlsx-to-json.js path/to/file.xlsx --write   # overwrites src/data/financialData.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SHEET_NAMES = [
  'Main',
  'IncomeBreakdown',
  'ExpenseBreakdown',
  'AssetBreakdown',
  'LiabilityBreakdown',
  'EquityBreakdown',
];

const BREAKDOWN_MAP = {
  IncomeBreakdown:    'incomeBreakdown',
  ExpenseBreakdown:   'expenseBreakdown',
  AssetBreakdown:     'assetBreakdown',
  LiabilityBreakdown: 'liabilityBreakdown',
  EquityBreakdown:    'equityBreakdown',
};

function sheetToRows(worksheet) {
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? value : num;
}

function buildMainMap(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row.month) continue;
    const entry = {};
    for (const [key, val] of Object.entries(row)) {
      entry[key] = parseNumber(val);
    }
    map.set(String(row.month), entry);
  }
  return map;
}

function mergeBreakdown(mainMap, rows, breakdownKey) {
  for (const row of rows) {
    const month = String(row.month || '');
    if (!month || !mainMap.has(month)) continue;
    const breakdown = {};
    for (const [key, val] of Object.entries(row)) {
      if (key === 'month') continue;
      breakdown[key] = parseNumber(val);
    }
    mainMap.get(month)[breakdownKey] = breakdown;
  }
}

function toJsLiteral(value, indent = 2) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map(v => toJsLiteral(v, indent)).join(', ')}]`;
  }
  if (typeof value === 'object' && value !== null) {
    const pad = ' '.repeat(indent);
    const entries = Object.entries(value)
      .map(([k, v]) => `${pad}  ${JSON.stringify(k)}: ${toJsLiteral(v, indent + 2)}`)
      .join(',\n');
    return `{\n${entries}\n${pad}}`;
  }
  return String(value);
}

function generateFileContent(data) {
  const pad = '  ';
  const rows = data
    .map(row => {
      const fields = Object.entries(row)
        .map(([k, v]) => `${pad}  ${k}: ${toJsLiteral(v, 4)}`)
        .join(',\n');
      return `${pad}{\n${fields}\n${pad}}`;
    })
    .join(',\n');

  return `export const financialData = [\n${rows}\n];\nexport const allMonths = financialData.map(d => d.month);\n`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');
const filePath = args.find(a => !a.startsWith('--'));

if (!filePath) {
  console.error('Usage: node scripts/xlsx-to-json.js <path/to/file.xlsx> [--write]');
  process.exit(1);
}

const absolutePath = resolve(filePath);
console.log(`Reading: ${absolutePath}`);

let workbook;
try {
  workbook = XLSX.readFile(absolutePath);
} catch (e) {
  console.error(`Could not read file: ${e.message}`);
  process.exit(1);
}

// Check required sheets exist
const missing = SHEET_NAMES.filter(name => !workbook.SheetNames.includes(name));
if (missing.length > 0) {
  console.warn(`Warning: missing sheets: ${missing.join(', ')}`);
  console.warn('Only available sheets will be used.');
}

// Build data
const mainSheet = workbook.Sheets['Main'];
if (!mainSheet) {
  console.error('Error: "Main" sheet is required but not found.');
  process.exit(1);
}

const mainMap = buildMainMap(sheetToRows(mainSheet));

for (const sheetName of SHEET_NAMES.slice(1)) {
  if (workbook.Sheets[sheetName]) {
    const rows = sheetToRows(workbook.Sheets[sheetName]);
    mergeBreakdown(mainMap, rows, BREAKDOWN_MAP[sheetName]);
  }
}

const data = Array.from(mainMap.values());
const content = generateFileContent(data);

if (shouldWrite) {
  const outPath = resolve(__dirname, '../src/data/financialData.js');
  writeFileSync(outPath, content, 'utf-8');
  console.log(`Written to: ${outPath}`);
} else {
  console.log('\n── Generated financialData.js ─────────────────────────────────\n');
  console.log(content);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('\nTip: run with --write to overwrite src/data/financialData.js directly.');
}
