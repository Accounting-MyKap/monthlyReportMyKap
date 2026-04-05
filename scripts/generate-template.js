#!/usr/bin/env node
/**
 * generate-template.js
 * Generates a filled Excel template from the current financialData.js
 * so the user has a reference for how to structure their Google Sheet.
 *
 * Usage: node scripts/generate-template.js
 * Output: financialData-template.xlsx in the project root
 */

import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load existing data ────────────────────────────────────────────────────────
// We inline the data here to avoid ESM/CJS complications in a script context
const { financialData } = await import('../src/data/financialData.js');

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSheet(rows) {
  return XLSX.utils.json_to_sheet(rows);
}

function setColumnWidths(ws, widths) {
  ws['!cols'] = widths.map(w => ({ wch: w }));
}

// ── Build each sheet ──────────────────────────────────────────────────────────

// 1. Main — all flat fields
const mainHeaders = [
  'month',
  'activos', 'pasivos', 'patrimonio',
  'ingresos', 'costos', 'gastos', 'utilidad', 'utilidadDelPeriodo',
  'capital',
  'utilidadAcum2024', 'utilidadAcum2025',
  'ajusteRamParkPlace', 'ajusteAmortizacion2024', 'ajusteAmortizacion2025',
  'withholdingSociosExtranjeros2024_2025', 'withholdingSociosExtranjeros',
  'provisionWithholdingSociosExtranjeros2025', 'provisionWithholdingSociosExtranjeros2026',
  'carteraPropia', 'carteraCortoPlazo', 'carteraLargoPlazo', 'carteraTerceros',
  'approvalRate', 'disbursementRate', 'timeCycle', 'ltvCac', 'npls',
];

const mainRows = financialData.map(d => {
  const row = {};
  for (const h of mainHeaders) {
    row[h] = d[h] ?? 0;
  }
  return row;
});

// 2. IncomeBreakdown
const incomeKeys = new Set();
financialData.forEach(d => d.incomeBreakdown && Object.keys(d.incomeBreakdown).forEach(k => incomeKeys.add(k)));
const incomeRows = financialData.map(d => {
  const row = { month: d.month };
  incomeKeys.forEach(k => { row[k] = d.incomeBreakdown?.[k] ?? 0; });
  return row;
});

// 3. ExpenseBreakdown
const expenseKeys = new Set();
financialData.forEach(d => d.expenseBreakdown && Object.keys(d.expenseBreakdown).forEach(k => expenseKeys.add(k)));
const expenseRows = financialData.map(d => {
  const row = { month: d.month };
  expenseKeys.forEach(k => { row[k] = d.expenseBreakdown?.[k] ?? 0; });
  return row;
});

// 4. AssetBreakdown
const assetKeys = new Set();
financialData.forEach(d => d.assetBreakdown && Object.keys(d.assetBreakdown).forEach(k => assetKeys.add(k)));
const assetRows = financialData.map(d => {
  const row = { month: d.month };
  assetKeys.forEach(k => { row[k] = d.assetBreakdown?.[k] ?? 0; });
  return row;
});

// 5. LiabilityBreakdown
const liabilityKeys = new Set();
financialData.forEach(d => d.liabilityBreakdown && Object.keys(d.liabilityBreakdown).forEach(k => liabilityKeys.add(k)));
const liabilityRows = financialData.map(d => {
  const row = { month: d.month };
  liabilityKeys.forEach(k => { row[k] = d.liabilityBreakdown?.[k] ?? 0; });
  return row;
});

// 6. EquityBreakdown
const equityKeys = new Set();
financialData.forEach(d => d.equityBreakdown && Object.keys(d.equityBreakdown).forEach(k => equityKeys.add(k)));
const equityRows = financialData.map(d => {
  const row = { month: d.month };
  equityKeys.forEach(k => { row[k] = d.equityBreakdown?.[k] ?? 0; });
  return row;
});

// ── Assemble workbook ─────────────────────────────────────────────────────────

const wb = XLSX.utils.book_new();

const wsMain = makeSheet(mainRows);
setColumnWidths(wsMain, [10, ...Array(mainHeaders.length - 1).fill(16)]);
XLSX.utils.book_append_sheet(wb, wsMain, 'Main');

const wsIncome = makeSheet(incomeRows);
setColumnWidths(wsIncome, [10, ...Array(incomeKeys.size).fill(22)]);
XLSX.utils.book_append_sheet(wb, wsIncome, 'IncomeBreakdown');

const wsExpense = makeSheet(expenseRows);
setColumnWidths(wsExpense, [10, ...Array(expenseKeys.size).fill(22)]);
XLSX.utils.book_append_sheet(wb, wsExpense, 'ExpenseBreakdown');

const wsAsset = makeSheet(assetRows);
setColumnWidths(wsAsset, [10, ...Array(assetKeys.size).fill(20)]);
XLSX.utils.book_append_sheet(wb, wsAsset, 'AssetBreakdown');

const wsLiability = makeSheet(liabilityRows);
setColumnWidths(wsLiability, [10, ...Array(liabilityKeys.size).fill(24)]);
XLSX.utils.book_append_sheet(wb, wsLiability, 'LiabilityBreakdown');

const wsEquity = makeSheet(equityRows);
setColumnWidths(wsEquity, [10, ...Array(equityKeys.size).fill(22)]);
XLSX.utils.book_append_sheet(wb, wsEquity, 'EquityBreakdown');

// ── Write file ────────────────────────────────────────────────────────────────

const outPath = resolve(__dirname, '../financialData-template.xlsx');
XLSX.writeFile(wb, outPath);
console.log(`Template created: ${outPath}`);
console.log('Sheets: Main, IncomeBreakdown, ExpenseBreakdown, AssetBreakdown, LiabilityBreakdown, EquityBreakdown');
