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
import { financialData, allMonths } from './data/financialData';

const COLORS = {
  main: ['#06b6d4', '#f97316', '#22c55e'],
  assets: ['#0e7490', '#0891b2', '#06b6d4', '#67e8f9'],
  liabilities: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
  equity: ['#15803d', '#22c55e', '#f97316'],
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
    
    // Calcular ajustes totales sumando todos los componentes de ajuste
    const ajustesTotal = (
      (latestMonthData.utilidadAcum2024 || 0) +
      (latestMonthData.ajusteRamParkPlace || 0) +
      (latestMonthData.ajusteAmortizacion2024 || 0) +
      (latestMonthData.withholdingSociosExtranjeros2024 || 0) +
      (latestMonthData.provisionWithholdingSociosExtranjeros2025 || 0)
    );
    
    const equityData = [
      { name: 'Capital', value: latestMonthData.capital || 0 },
      { name: 'Utilidad del periodo', value: latestMonthData.utilidad || 0 },
      { name: 'Ajustes', value: ajustesTotal }
    ];
    return {
      balanceComposition: [
        { name: 'Activos', value: latestMonthData.activos },
        { name: 'Pasivos', value: latestMonthData.pasivos },
        { name: 'Patrimonio', value: latestMonthData.patrimonio }
      ].map(d => ({ ...d, displayValue: d.value })),
      assetComposition: mapDataForChart(originalDataForMonth.assetBreakdown),
      liabilityComposition: mapDataForChart(originalDataForMonth.liabilityBreakdown),
      equityComposition: equityData.map(item => ({ name: item.name, value: Math.abs(item.value), displayValue: item.value })),
      carteraComposition: [
        { name: 'Cartera Propia', value: latestMonthData.carteraPropia },
        { name: 'Cartera de Terceros', value: latestMonthData.carteraTerceros }
      ].map(d => ({ ...d, displayValue: d.value })),
      carteraPropiaComposition: [
        { name: 'Corto Plazo', value: latestMonthData.carteraCortoPlazo },
        { name: 'Largo Plazo', value: latestMonthData.carteraLargoPlazo }
      ].map(d => ({ ...d, displayValue: d.value })),
    };
  }, [latestMonthData]);

  const handlePortfolioClick = (data) => {
    if (data.name === 'Cartera Propia') setPortfolioView('propia');
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
      {/* Header y filtros sticky */}
      <div className="sticky top-0 z-50 bg-[rgba(243,244,246,0.95)] backdrop-blur shadow-md pb-2 mb-4 max-w-7xl mx-auto rounded-2xl">
        <header className="mb-2 relative no-print">
          <h1 className="text-3xl sm:text-4xl font-bold text-center" style={{color: theme === 'dark' ? '#fff' : currentTheme.accent}}>Panel Financiero Interactivo</h1>
          <p className={`text-center ${currentTheme.textSecondary} mt-2`}>Análisis Financiero</p>
          <div className="absolute top-0 right-0">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Cambiar tema" className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
              {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </button>
          </div>
        </header>
        <div className={`flex flex-wrap justify-center items-center gap-4 p-4 rounded-lg no-print`}>
          <label htmlFor="start-date" className={`flex items-center gap-2 ${currentTheme.textSecondary}`}><Calendar className={`h-5 w-5 ${currentTheme.accent}`}/> Desde:</label>
          <select id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-2`}>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <label htmlFor="end-date" className={`flex items-center gap-2 ${currentTheme.textSecondary}`}><Calendar className={`h-5 w-5 ${currentTheme.accent}`}/> Hasta:</label>
          <select id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-2`}>
            {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      {/* Contenedor principal para los gráficos y secciones */}
      <div className="max-w-7xl mx-auto">
        {/* 1. Composición del Balance Sheet */}
        <div className="grid grid-cols-1 gap-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <h2 className="text-xl font-bold text-center mb-4" style={{color: theme === 'dark' ? '#fff' : currentTheme.accent}}>Composición del Balance Sheet ({endDate})</h2>
            <div className="w-full h-[400px]">
              <ResponsiveContainer>
                <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
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
        {/* 2. Detalle de Activos y Distribución de Cartera */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title="Detalle de Activos" data={safeData(assetComposition)} colors={COLORS.assets} theme={theme} />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            {portfolioView === 'main' ? (
              <StaticPieWithLegend title={`Distribución de Cartera Total (${endDate})`} data={safeData(carteraComposition)} colors={COLORS.cartera} theme={theme} onClick={handlePortfolioClick} />
            ) : (
              <DrilldownPieWithLegend title="Detalle de Cartera Propia" data={safeData(carteraPropiaComposition)} colors={COLORS.carteraPropia} onBack={() => setPortfolioView('main')} theme={theme} />
            )}
          </div>
        </div>
        {/* 3. Detalle de Pasivos y Detalle de Patrimonio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title="Detalle de Pasivos" data={safeData(liabilityComposition)} colors={COLORS.liabilities} theme={theme} />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
            <DrilldownPieWithLegend title="Detalle de Patrimonio" data={safeData(equityComposition)} colors={COLORS.equity} theme={theme} />
          </div>
        </div>
        {/* 4. Evolución de Resultados (P&L) */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg min-h-[480px]`}>
            <h2 className="text-xl font-bold mb-4" style={{color: theme === 'dark' ? '#fff' : currentTheme.accent}}>Evolución de Resultados (P&L)</h2>
            <div className="w-full h-[420px]">
              <ResponsiveContainer>
                <LineChart data={safeData(filteredData)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.grid} />
                  <XAxis dataKey="month" stroke={currentTheme.axis} />
                  <YAxis stroke={currentTheme.axis} tickFormatter={value => `$${value / 1000}k`} />
                  <Tooltip content={<BarLineTooltip theme={theme} />} />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#06b6d4" strokeWidth={3} name="Ingresos" />
                  <Line type="monotone" dataKey="costos" stroke="#f59e0b" strokeWidth={3} name="Costos" />
                  <Line type="monotone" dataKey="gastos" stroke="#f97316" strokeWidth={3} name="Gastos" />
                  <Line type="monotone" dataKey="utilidad" stroke="#22c55e" strokeWidth={3} name="Utilidad" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* 5. Detalle de Ingresos y Detalle de Gastos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
          <div className="min-h-[480px]">
            <StaticPieWithLegend title={`Composición de Ingresos (${endDate})`} data={safeData(mapDataForChart(latestMonthData?.incomeBreakdown))} colors={COLORS.income} theme={theme} />
          </div>
          <div className="min-h-[480px]">
            <StaticPieWithLegend title={`Composición de Gastos (${endDate})`} data={safeData(mapDataForChart(latestMonthData?.expenseBreakdown))} colors={COLORS.expenses} theme={theme} />
          </div>
        </div>

        {/* 6. KPIs ocupando todo el ancho */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
          <KpiCard icon={Target} title="Approval Rate" value={latestMonthData?.approvalRate ? `${latestMonthData.approvalRate}%` : 'N/A'} />
          <KpiCard icon={TrendingUp} title="Disbursement Rate" value={latestMonthData?.disbursementRate ? `${latestMonthData.disbursementRate}%` : 'N/A'} />
          <KpiCard icon={Clock} title="Ciclo Total" value={latestMonthData?.timeCycle ? `${latestMonthData.timeCycle} días` : 'N/A'} />
          <KpiCard icon={Shuffle} title="LTV / CAC" value={latestMonthData?.ltvCac ?? 'N/A'} />
          <KpiCard icon={AlertTriangle} title="NPLs" value={latestMonthData?.npls ? `${latestMonthData.npls}%` : 'N/A'} />
        </div>
      </div>
    </div>
  );
}