import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, Sun, Moon, Target, TrendingUp, Clock, Shuffle, AlertTriangle, Printer } from 'lucide-react';
import { themeConfig } from './config/theme';
import KpiCard from './components/KpiCard';
import PieCustomTooltip from './components/PieCustomTooltip';
import BarLineTooltip from './components/BarLineTooltip';
import { renderMainChartLabel } from './components/chartLabels';
import DrilldownPieWithLegend from './components/DrilldownPieWithLegend';
import StaticPieWithLegend from './components/StaticPieWithLegend';
import Logo from './components/Logo';
import { financialData, allMonths } from './data/financialData';

const COLORS = {
  main: ['#004dda', '#f97316', '#22c55e'],
  assets: ['#0e7490', '#0891b2', '#004dda', '#67e8f9'],
  liabilities: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
  equity: ['#15803d', '#f97316', '#22c55e'],
  income: ['#083344', '#075985', '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc'],
  expenses: ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74'],
  cartera: ['#8b5cf6', '#d946ef'],
  carteraPropia: ['#818cf8', '#c084fc']
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [startDate, setStartDate] = useState(allMonths[0]);
  const [endDate, setEndDate] = useState(allMonths[allMonths.length - 1]);
  const [portfolioView, setPortfolioView] = useState('main');
  // Eliminar estados y funciones de IA
  // const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  // const [analysisResult, setAnalysisResult] = useState('');
  // const [isAnalysisLoading, setAnalysisLoading] = useState(false);
  // const [copySuccess, setCopySuccess] = useState('');

  const filteredData = useMemo(() => {
    const startIndex = allMonths.indexOf(startDate);
    const endIndex = allMonths.indexOf(endDate);
    return startIndex <= endIndex ? financialData.slice(startIndex, endIndex + 1) : [];
  }, [startDate, endDate]);

  const latestMonthData = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  // Validación de datos para evitar errores en los gráficos
  const safeData = (data) => Array.isArray(data) && data.length > 0 ? data : [{ name: 'Sin datos', value: 1, displayValue: 1 }];

  const mapDataForChart = (dataObject) => dataObject ? Object.entries(dataObject).filter(([name, value]) => value > 0).map(([name, value]) => ({ name, value, displayValue: value })) : [];

  const {
    balanceComposition,
    assetComposition,
    liabilityComposition,
    equityComposition,
    carteraComposition,
    carteraPropiaComposition
  } = useMemo(() => {
    if (!latestMonthData) return {
      balanceComposition: [], assetComposition: [], liabilityComposition: [], equityComposition: [], carteraComposition: [], carteraPropiaComposition: []
    };
    const originalDataForMonth = financialData.find(d => d.month === latestMonthData.month) || {};
    
    // Use equityBreakdown from financialData instead of manual calculation
    const equityData = originalDataForMonth.equityBreakdown ? 
      Object.entries(originalDataForMonth.equityBreakdown).map(([name, value]) => ({ name, value })) :
      [
        { name: 'Capital', value: latestMonthData.capital || 0 },
        { name: 'Period Earnings', value: latestMonthData.utilidad || 0 },
        { name: 'Accumulated Earnings', value: latestMonthData.utilidadAcum2024 || 0 },
        { name: 'Provisions', value: (
          (latestMonthData.ajusteRamParkPlace || 0) +
          (latestMonthData.ajusteAmortizacion2024 || 0) +
          (latestMonthData.withholdingSociosExtranjeros2024 || 0) +
          (latestMonthData.provisionWithholdingSociosExtranjeros2025 || 0)
        )}
      ];
    return {
      balanceComposition: [
        { name: 'Assets', value: latestMonthData.activos },
        { name: 'Liabilities', value: latestMonthData.pasivos },
        { name: 'Equity', value: latestMonthData.patrimonio }
      ].map(d => ({ ...d, displayValue: d.value })),
      assetComposition: mapDataForChart(originalDataForMonth.assetBreakdown),
      liabilityComposition: mapDataForChart(originalDataForMonth.liabilityBreakdown),
      equityComposition: equityData.filter(item => item.value !== 0).map(item => ({ name: item.name, value: Math.abs(item.value), displayValue: item.value })),
      carteraComposition: [
        { name: 'Own Portfolio', value: latestMonthData.carteraPropia },
        { name: 'Third Party Portfolio', value: latestMonthData.carteraTerceros }
      ].map(d => ({ ...d, displayValue: d.value })),
      carteraPropiaComposition: [
        { name: 'Short Term', value: latestMonthData.carteraCortoPlazo },
        { name: 'Long Term', value: latestMonthData.carteraLargoPlazo }
      ].map(d => ({ ...d, displayValue: d.value })),
    };
  }, [latestMonthData]);

  const handlePortfolioClick = (data) => {
    if (data.name === 'Own Portfolio') setPortfolioView('propia');
  };

  const currentTheme = themeConfig[theme];

  return (
    <div className={`${currentTheme.background} ${currentTheme.textPrimary} font-sans p-4 sm:p-6 lg:p-8 min-h-screen`}>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #fff !important;
            color: #222 !important;
            font-size: 12pt;
            margin: 0;
          }
          .no-print, .no-print * {
            display: none !important;
          }
          .fixed, .z-40, .shadow-lg, .shadow-2xl {
            position: static !important;
            box-shadow: none !important;
            z-index: auto !important;
          }
          .rounded-2xl, .rounded-xl, .rounded-lg, .rounded-md, .rounded-full {
            border-radius: 0 !important;
          }
          .bg-gray-800/50, .bg-gray-200/50, .bg-gray-900, .bg-gray-100, .bg-white, .bg-gray-800, .bg-gray-700, .bg-gray-200 {
            background: #fff !important;
          }
          .text-white, .text-gray-800, .text-gray-400, .text-gray-500, .text-cyan-400, .text-cyan-600, .text-cyan-300, .text-cyan-700 {
            color: #222 !important;
          }
          .max-w-7xl, .min-h-[480px], .min-h-screen {
            max-width: 100% !important;
            min-height: 0 !important;
          }
          .p-6, .p-4 {
            padding: 18px 24px !important;
          }
          h1, h2, h3 {
            margin: 0 0 8px 0 !important;
            page-break-after: avoid;
          }
          .w-full {
            width: 100% !important;
          }
          .h-[400px], .h-[420px], .h-[250px], .h-[300px] {
            height: auto !important;
            min-height: 200px !important;
          }
          .mt-8, .mb-8 {
            margin-top: 8px !important;
            margin-bottom: 8px !important;
          }
          .page-break {
            page-break-before: always;
          }
          .grid {
            display: block !important;
            grid-template-columns: none !important;
            gap: 0 !important;
          }
          .card, .p-6, .p-4 {
            width: 95vw !important;
            margin: 0 auto 12px auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 250px !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
      {/* Header and sticky filters */}
      <div className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800/95' : 'bg-[rgba(243,244,246,0.95)]'} backdrop-blur shadow-md pb-1 mb-2 max-w-7xl mx-auto rounded-2xl`}>
        <header className="relative no-print">
          <div className="grid grid-cols-3 items-center px-2 sm:px-4 py-0">
            {/* Logo en contenedor independiente - columna izquierda */}
            <div className="flex justify-start">
              <Logo theme={theme} />
            </div>
            
            {/* Títulos centrados - columna central */}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{color: theme === 'dark' ? '#fff' : '#004dda'}}>Financial Dashboard</h1>
              <p className="mt-0 text-sm sm:text-base" style={{color: theme === 'dark' ? '#fff' : '#64748b'}}>Financial Analysis</p>
            </div>
            
            {/* Botón de tema - columna derecha */}
            <div className="flex justify-end">
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Change Theme" className="p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>
        <div className={`flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-4 pb-1.5 pt-0.5 rounded-lg no-print`}>
          <label htmlFor="start-date" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base" style={{color: theme === 'dark' ? '#fff' : '#64748b'}}><Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${currentTheme.accent}`}/> Start Date:</label>
          <select id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-1 sm:p-2 text-sm sm:text-base`}>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <label htmlFor="end-date" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base" style={{color: theme === 'dark' ? '#fff' : '#64748b'}}><Calendar className={`h-4 w-4 sm:h-5 sm:w-5 ${currentTheme.accent}`}/> End Date:</label>
          <select id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-1 sm:p-2 text-sm sm:text-base`}>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      {/* Main container for charts and sections */}
      <div className="max-w-7xl mx-auto">
        {/* 1. Balance Sheet Composition */}
        <div className="grid grid-cols-1 gap-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4 px-2" style={{color: theme === 'dark' ? '#fff' : '#004dda'}}>Balance Sheet Composition ({endDate})</h2>
            <div className="w-full h-64 sm:h-80 md:h-96">
              <ResponsiveContainer>
                <PieChart margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
                  <Pie
                    data={safeData(balanceComposition)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={props => renderMainChartLabel({ ...props, theme })}
                  >
                    {safeData(balanceComposition).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.main[index % COLORS.main.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip theme={theme} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 2. Asset Details and Portfolio Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title={`Asset Details (${endDate})`} data={safeData(assetComposition)} colors={COLORS.assets} theme={theme} />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            {portfolioView === 'main' ? (
              <StaticPieWithLegend title={`Total Portfolio Distribution (${endDate})`} data={safeData(carteraComposition)} colors={COLORS.cartera} theme={theme} onClick={handlePortfolioClick} />
            ) : (
              <DrilldownPieWithLegend title="Own Portfolio Details" data={safeData(carteraPropiaComposition)} colors={COLORS.carteraPropia} onBack={() => setPortfolioView('main')} theme={theme} />
            )}
          </div>
        </div>
        {/* 3. Liability Details and Equity Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title={`Liability Details (${endDate})`} data={safeData(liabilityComposition)} colors={COLORS.liabilities} theme={theme} />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title={`Equity Details (${endDate})`} data={safeData(equityComposition)} colors={COLORS.equity} theme={theme} />
          </div>
        </div>
        {/* 4. Performance (P&L) */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 px-2" style={{color: theme === 'dark' ? '#fff' : '#004dda'}}>Performance (P&L)</h2>
            <div className="w-full h-64 sm:h-80 md:h-[420px]">
              <ResponsiveContainer>
                <LineChart data={safeData(filteredData)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.grid} />
                  <XAxis dataKey="month" stroke={currentTheme.axis} />
                  <YAxis stroke={currentTheme.axis} tickFormatter={value => `$${value / 1000}k`} />
                  <Tooltip content={<BarLineTooltip theme={theme} />} />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#004dda" strokeWidth={3} name="Income" />
                  <Line type="monotone" dataKey="costos" stroke="#f59e0b" strokeWidth={3} name="Costs" />
                  <Line type="monotone" dataKey="gastos" stroke="#f97316" strokeWidth={3} name="Expenses" />
                  <Line type="monotone" dataKey="utilidadDelPeriodo" stroke="#22c55e" strokeWidth={3} name="Profit" />
                  <Line type="monotone" dataKey="utilidad" stroke="#8b5cf6" strokeWidth={3} name="Accumulated Profit 2025" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 5. Income Details and Expense Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <StaticPieWithLegend title={`Income Composition (${endDate})`} data={safeData(mapDataForChart(latestMonthData?.incomeBreakdown))} colors={COLORS.income} theme={theme} />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <StaticPieWithLegend title={`Expense Composition (${endDate})`} data={safeData(mapDataForChart(latestMonthData?.expenseBreakdown))} colors={COLORS.expenses} theme={theme} />
          </div>
        </div>

        {/* 6. KPIs ocupando todo el ancho */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
          <KpiCard icon={Target} title="Approval Rate" value={latestMonthData?.approvalRate ? `${latestMonthData.approvalRate}%` : 'N/A'} theme={theme} />
          <KpiCard icon={TrendingUp} title="Disbursement Rate" value={latestMonthData?.disbursementRate ? `${latestMonthData.disbursementRate}%` : 'N/A'} theme={theme} />
          <KpiCard icon={Clock} title="Total Cycle" value={latestMonthData?.timeCycle ? `${latestMonthData.timeCycle} days` : 'N/A'} theme={theme} />
          <KpiCard icon={Shuffle} title="LTV / CAC" value={latestMonthData?.ltvCac ?? 'N/A'} theme={theme} />
          <KpiCard icon={AlertTriangle} title="NPLs" value={latestMonthData?.npls ? `${latestMonthData.npls}%` : 'N/A'} theme={theme} />
        </div>
      </div>
    </div>
  );
}