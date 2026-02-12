import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { themeConfig } from '../config/theme';
import PieCustomTooltip from './PieCustomTooltip';
import { renderDrilldownPercentageLabel } from './chartLabels';
import { formatCurrency } from '../utils/formatters';

const DrilldownPieWithLegend = ({ title, data, colors, theme, onBack }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedData = useMemo(() => (
    Array.isArray(data) ? [...data].sort((a, b) => b.value - a.value) : []
  ), [data]);

  const totalValue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.displayValue || 0), 0);
  }, [sortedData]);

  const chartSettings = useMemo(() => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;

    return {
      margin: isMobile
        ? { top: 10, right: 10, bottom: 10, left: 10 }
        : isTablet
          ? { top: 20, right: 20, bottom: 20, left: 20 }
          : { top: 30, right: 30, bottom: 30, left: 30 },
      outerRadius: isMobile ? 55 : isTablet ? 65 : 75,
    };
  }, [windowWidth]);

  // Special color mapping for Equity chart
  const getColorForEquityComponent = (name) => {
    const equityColorMap = {
      'Capital': '#15803d',
      'Period Earnings': '#22c55e',
      'Accumulated Earnings': '#f97316',
      'Withholding 2024 - 2025': '#0891b2',
      'Withholding Provision': '#06b6d4',
      'Adjustments': '#64748b',
    };
    return equityColorMap[name] || colors[0];
  };

  const dataWithColors = sortedData.map((entry, index) => ({
    ...entry,
    fill: title.includes('Equity')
      ? getColorForEquityComponent(entry.name)
      : colors[index % colors.length]
  }));

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header with optional back button */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'}
            `}
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h2
          className="text-lg sm:text-xl font-bold"
          style={{ color: theme === 'dark' ? '#fff' : '#004dda' }}
        >
          {title}
        </h2>
      </div>

      {/* Chart */}
      <div className="w-full h-48 sm:h-56 md:h-64 flex-shrink-0">
        <ResponsiveContainer>
          <PieChart margin={chartSettings.margin}>
            <Pie
              data={dataWithColors}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartSettings.outerRadius}
              labelLine={false}
              label={(props) => renderDrilldownPercentageLabel({ ...props, theme })}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {dataWithColors.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke={theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<PieCustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-full mt-3 space-y-1.5 px-2 sm:px-4 overflow-y-auto flex-1">
        {/* Total line */}
        <div
          className="flex items-center justify-between text-sm font-semibold pb-2 mb-2 border-b"
          style={{ borderColor: currentTheme.textSecondary + '30' }}
        >
          <span style={{ color: currentTheme.textPrimary }}>Total</span>
          <span
            className="font-mono font-bold"
            style={{ color: currentTheme.textPrimary }}
          >
            {formatCurrency(totalValue)}
          </span>
        </div>

        {/* Legend items */}
        {dataWithColors.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center justify-between text-sm py-0.5 transition-colors duration-150 hover:opacity-80"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm"
                style={{ backgroundColor: entry.fill }}
              />
              <span
                className="truncate"
                style={{ color: currentTheme.textSecondary }}
              >
                {entry.name}
              </span>
            </div>
            <span
              className="font-mono text-xs sm:text-sm flex-shrink-0 ml-2"
              style={{ color: currentTheme.textPrimary }}
            >
              {formatCurrency(entry.displayValue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

DrilldownPieWithLegend.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  onBack: PropTypes.func,
};

export default DrilldownPieWithLegend;