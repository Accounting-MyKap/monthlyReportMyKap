import React, { useState, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Sun, Moon, Target, TrendingUp, Clock, Shuffle, AlertTriangle } from 'lucide-react';
import { themeConfig, chartColors } from './config/theme';
import KpiCard from './components/KpiCard';
import PieCustomTooltip from './components/PieCustomTooltip';
import BarLineTooltip from './components/BarLineTooltip';
import { renderMainChartLabel } from './components/chartLabels';
import DrilldownPieWithLegend from './components/DrilldownPieWithLegend';
import StaticPieWithLegend from './components/StaticPieWithLegend';
import Logo from './components/Logo';
import { financialData, allMonths } from './data/financialData';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [portfolioView, setPortfolioView] = useState('main');

  // Parse available years and months from data
  const { availableYears, monthsByYear, monthNames } = useMemo(() => {
    const years = new Set();
    const monthsMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'];

    allMonths.forEach(m => {
      const [month, year] = m.split('-');
      const fullYear = `20${year}`;
      years.add(fullYear);
      if (!monthsMap[fullYear]) monthsMap[fullYear] = [];
      monthsMap[fullYear].push({ value: m, label: month });
    });

    return {
      availableYears: Array.from(years).sort(),
      monthsByYear: monthsMap,
      monthNames: months
    };
  }, []);

  // Initialize with first and last available dates
  const firstMonth = allMonths[0];
  const lastMonth = allMonths[allMonths.length - 1];
  const [startYear, startMonthVal] = firstMonth.split('-');
  const [endYear, endMonthVal] = lastMonth.split('-');

  const [startDateYear, setStartDateYear] = useState(`20${startMonthVal}`);
  const [startDateMonth, setStartDateMonth] = useState(firstMonth);
  const [endDateYear, setEndDateYear] = useState(`20${endMonthVal}`);
  const [endDateMonth, setEndDateMonth] = useState(lastMonth);

  // When year changes, adjust month to first available in that year
  const handleStartYearChange = (year) => {
    setStartDateYear(year);
    const monthsInYear = monthsByYear[year];
    if (monthsInYear && monthsInYear.length > 0) {
      setStartDateMonth(monthsInYear[0].value);
    }
  };

  const handleEndYearChange = (year) => {
    setEndDateYear(year);
    const monthsInYear = monthsByYear[year];
    if (monthsInYear && monthsInYear.length > 0) {
      setEndDateMonth(monthsInYear[monthsInYear.length - 1].value);
    }
  };

  const filteredData = useMemo(() => {
    const startIndex = allMonths.indexOf(startDateMonth);
    const endIndex = allMonths.indexOf(endDateMonth);
    const data = startIndex <= endIndex ? financialData.slice(startIndex, endIndex + 1) : [];
    return data.map(item => ({
      ...item,
      costosYGastos: (item.costos || 0) + (item.gastos || 0)
    }));
  }, [startDateMonth, endDateMonth]);

  const latestMonthData = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  const safeData = (data) => Array.isArray(data) && data.length > 0 ? data : [{ name: 'No data', value: 1, displayValue: 1 }];

  const mapDataForChart = (dataObject) => dataObject
    ? Object.entries(dataObject)
      .filter(([, value]) => value !== 0)
      .map(([name, value]) => ({ name, value: Math.abs(value), displayValue: value }))
    : [];

  const getAccumulatedBreakdown = useCallback((filteredData) => {
    const accumulatedIncome = {};
    const accumulatedExpenses = {};

    filteredData.forEach(monthData => {
      if (monthData.incomeBreakdown) {
        Object.entries(monthData.incomeBreakdown).forEach(([name, value]) => {
          accumulatedIncome[name] = (accumulatedIncome[name] || 0) + value;
        });
      }

      if (monthData.expenseBreakdown) {
        Object.entries(monthData.expenseBreakdown).forEach(([name, value]) => {
          const normalizedName = name === 'Reversal of Operating Provision' ? 'Provision' : name;
          accumulatedExpenses[normalizedName] = (accumulatedExpenses[normalizedName] || 0) + value;
        });
      }
    });

    return {
      income: mapDataForChart(accumulatedIncome),
      expenses: mapDataForChart(accumulatedExpenses)
    };
  }, []);

  const {
    balanceComposition,
    assetComposition,
    liabilityComposition,
    equityComposition,
    carteraComposition,
    carteraPropiaComposition
  } = useMemo(() => {
    if (!latestMonthData) return {
      balanceComposition: [], assetComposition: [], liabilityComposition: [],
      equityComposition: [], carteraComposition: [], carteraPropiaComposition: []
    };

    const originalDataForMonth = financialData.find(d => d.month === latestMonthData.month) || {};

    const equityData = originalDataForMonth.equityBreakdown
      ? Object.entries(originalDataForMonth.equityBreakdown).map(([name, value]) => ({ name, value }))
      : [
        { name: 'Capital', value: latestMonthData.capital || 0 },
        { name: 'Period Earnings', value: latestMonthData.utilidad || 0 },
        { name: 'Accumulated Earnings', value: latestMonthData.utilidadAcum2024 || 0 },
      ];

    return {
      balanceComposition: [
        { name: 'Assets', value: latestMonthData.activos },
        { name: 'Liabilities', value: latestMonthData.pasivos },
        { name: 'Equity', value: latestMonthData.patrimonio }
      ].map(d => ({ ...d, displayValue: d.value })),
      assetComposition: mapDataForChart(originalDataForMonth.assetBreakdown),
      liabilityComposition: mapDataForChart(originalDataForMonth.liabilityBreakdown),
      equityComposition: equityData
        .filter(item => item.value !== 0)
        .map(item => ({ name: item.name, value: Math.abs(item.value), displayValue: item.value })),
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

  const handleExportPDF = () => {
    window.print();
  };

  const currentTheme = themeConfig[theme];
  const isDark = theme === 'dark';

  return (
    <div className={`${currentTheme.background} min-h-screen font-sans transition-colors duration-300`}>
      {/* Header - Sticky with glassmorphism */}
      <div className={`sticky top-0 z-50 ${currentTheme.header.bg} ${currentTheme.header.border} shadow-sm no-print`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-3">
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Logo */}
              <div className="flex justify-start">
                <Logo theme={theme} />
              </div>

              {/* Title */}
              <div className="flex flex-col items-center justify-center">
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
                  style={{ color: isDark ? '#fff' : '#004dda' }}
                >
                  Financial Dashboard
                </h1>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle theme"
                  className={`
                    p-2 rounded-lg transition-all duration-250
                    ${isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}
                  `}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-3">
              {/* Start Date */}
              <div className="flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-primary'}`} />
                <span className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>
                  From:
                </span>
                <select
                  id="start-year"
                  value={startDateYear}
                  onChange={e => handleStartYearChange(e.target.value)}
                  className={`
                    ${currentTheme.select.bg} ${currentTheme.select.text} 
                    border ${currentTheme.select.border} 
                    rounded-lg px-2 py-1.5 text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    transition-all duration-150
                  `}
                >
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  id="start-month"
                  value={startDateMonth}
                  onChange={e => setStartDateMonth(e.target.value)}
                  className={`
                    ${currentTheme.select.bg} ${currentTheme.select.text} 
                    border ${currentTheme.select.border} 
                    rounded-lg px-2 py-1.5 text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    transition-all duration-150
                  `}
                >
                  {(monthsByYear[startDateYear] || []).map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* End Date */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: currentTheme.textSecondary }}>
                  To:
                </span>
                <select
                  id="end-year"
                  value={endDateYear}
                  onChange={e => handleEndYearChange(e.target.value)}
                  className={`
                    ${currentTheme.select.bg} ${currentTheme.select.text} 
                    border ${currentTheme.select.border} 
                    rounded-lg px-2 py-1.5 text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    transition-all duration-150
                  `}
                >
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  id="end-month"
                  value={endDateMonth}
                  onChange={e => setEndDateMonth(e.target.value)}
                  className={`
                    ${currentTheme.select.bg} ${currentTheme.select.text} 
                    border ${currentTheme.select.border} 
                    rounded-lg px-2 py-1.5 text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                    transition-all duration-150
                  `}
                >
                  {(monthsByYear[endDateYear] || []).map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* 1. Balance Sheet Breakdown - Full Width */}
        <section className="mb-8 animate-slide-up">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <h2
              className="text-lg sm:text-xl font-bold text-center mb-4"
              style={{ color: isDark ? '#fff' : '#004dda' }}
            >
              Balance Sheet Breakdown ({endDateMonth})
            </h2>
            <div className="w-full h-72 sm:h-80 md:h-96">
              <ResponsiveContainer>
                <PieChart margin={{ top: 40, right: 80, left: 80, bottom: 40 }}>
                  <Pie
                    data={safeData(balanceComposition)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    labelLine={false}
                    label={props => renderMainChartLabel({ ...props, theme })}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {safeData(balanceComposition).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors.main[index % chartColors.main.length]}
                        stroke={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)'}
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieCustomTooltip theme={theme} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 2. Assets and Portfolio Distribution */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-100`}>
            <DrilldownPieWithLegend
              title={`Assets (${endDateMonth})`}
              data={safeData(assetComposition)}
              colors={chartColors.assets}
              theme={theme}
            />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-200`}>
            {portfolioView === 'main' ? (
              <StaticPieWithLegend
                title={`Portfolio Distribution (${endDateMonth})`}
                data={safeData(carteraComposition)}
                colors={chartColors.cartera}
                theme={theme}
                onClick={handlePortfolioClick}
              />
            ) : (
              <DrilldownPieWithLegend
                title="Own Portfolio Details"
                data={safeData(carteraPropiaComposition)}
                colors={chartColors.carteraPropia}
                onBack={() => setPortfolioView('main')}
                theme={theme}
              />
            )}
          </div>
        </section>

        {/* 3. Liabilities and Equity */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-100`}>
            <DrilldownPieWithLegend
              title={`Liabilities (${endDateMonth})`}
              data={safeData(liabilityComposition)}
              colors={chartColors.liabilities}
              theme={theme}
            />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-200`}>
            <DrilldownPieWithLegend
              title={`Equity (${endDateMonth})`}
              data={safeData(equityComposition)}
              colors={chartColors.equity}
              theme={theme}
            />
          </div>
        </section>

        {/* 4. Performance (P&L) - Full Width */}
        <section className="mb-8 animate-slide-up">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <h2
              className="text-lg sm:text-xl font-bold mb-4"
              style={{ color: isDark ? '#fff' : '#004dda' }}
            >
              Performance (P&L)
            </h2>
            <div className="w-full h-72 sm:h-80 md:h-[420px]">
              <ResponsiveContainer>
                <LineChart data={safeData(filteredData)} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={currentTheme.grid}
                    strokeOpacity={currentTheme.gridOpacity}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={currentTheme.axis}
                    tick={{ fill: currentTheme.textSecondary, fontSize: 12 }}
                    axisLine={{ stroke: currentTheme.grid }}
                  />
                  <YAxis
                    stroke={currentTheme.axis}
                    tick={{ fill: currentTheme.textSecondary, fontSize: 12 }}
                    tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
                    axisLine={{ stroke: currentTheme.grid }}
                  />
                  <Tooltip content={<BarLineTooltip theme={theme} />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 15 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke={chartColors.lines.income}
                    strokeWidth={3}
                    name="Income"
                    dot={{ fill: chartColors.lines.income, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="costosYGastos"
                    stroke={chartColors.lines.costs}
                    strokeWidth={3}
                    name="Costs & Expenses"
                    dot={{ fill: chartColors.lines.costs, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="utilidadDelPeriodo"
                    stroke={chartColors.lines.profit}
                    strokeWidth={3}
                    name="Profit"
                    dot={{ fill: chartColors.lines.profit, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="utilidad"
                    stroke={chartColors.lines.accumulated}
                    strokeWidth={3}
                    name="Accumulated Profit 2025"
                    dot={{ fill: chartColors.lines.accumulated, strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 5. Accumulated Income and Expense Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-100`}>
            <StaticPieWithLegend
              title="Income Breakdown (Accumulated)"
              data={safeData(getAccumulatedBreakdown(filteredData).income)}
              colors={chartColors.income}
              theme={theme}
            />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-200`}>
            <StaticPieWithLegend
              title="Expense Breakdown (Accumulated)"
              data={safeData(getAccumulatedBreakdown(filteredData).expenses)}
              colors={chartColors.expenses}
              theme={theme}
            />
          </div>
        </section>

        {/* 6. Monthly Income and Expense Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-100`}>
            <StaticPieWithLegend
              title={`Income Breakdown (${endDateMonth})`}
              data={safeData(mapDataForChart(latestMonthData?.incomeBreakdown))}
              colors={chartColors.income}
              theme={theme}
            />
          </div>
          <div className={`${currentTheme.card} p-6 rounded-2xl shadow-card border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} min-h-[450px] animate-slide-up delay-200`}>
            <StaticPieWithLegend
              title={`Expense Breakdown (${endDateMonth})`}
              data={safeData(mapDataForChart(latestMonthData?.expenseBreakdown))}
              colors={chartColors.expenses}
              theme={theme}
            />
          </div>
        </section>

        {/* 7. KPIs */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          <KpiCard icon={Target} title="Approval Rate" value={latestMonthData?.approvalRate ? `${latestMonthData.approvalRate}%` : 'N/A'} theme={theme} />
          <KpiCard icon={TrendingUp} title="Disbursement Rate" value={latestMonthData?.disbursementRate ? `${latestMonthData.disbursementRate}%` : 'N/A'} theme={theme} />
          <KpiCard icon={Clock} title="Total Cycle" value={latestMonthData?.timeCycle ? `${latestMonthData.timeCycle} days` : 'N/A'} theme={theme} />
          <KpiCard icon={Shuffle} title="LTV / CAC" value={latestMonthData?.ltvCac ?? 'N/A'} theme={theme} />
          <KpiCard icon={AlertTriangle} title="NPLs" value={latestMonthData?.npls ? `${latestMonthData.npls}%` : 'N/A'} theme={theme} />
        </section>

      </main>
    </div>
  );
}
