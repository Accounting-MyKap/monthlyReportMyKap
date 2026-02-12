import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { themeConfig } from '../config/theme';
import PieCustomTooltip from './PieCustomTooltip';
import { renderDrilldownPercentageLabel } from './chartLabels';
import { formatCurrency } from '../utils/formatters';

const StaticPieWithLegend = ({ title, data, colors, theme, onClick }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      const aIsNegative = (a.displayValue || 0) < 0;
      const bIsNegative = (b.displayValue || 0) < 0;
      if (aIsNegative !== bIsNegative) return aIsNegative ? 1 : -1;
      return b.value - a.value;
    });
  }, [data]);

  const pieData = useMemo(() => sortedData.map(item => ({
    ...item,
    value: item.displayValue < 0 ? 0 : item.value
  })), [sortedData]);

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
      innerRadius: isMobile ? 0 : isTablet ? 0 : 0,
    };
  }, [windowWidth]);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Title */}
      <h2
        className="text-lg sm:text-xl font-bold mb-3 flex-shrink-0"
        style={{ color: theme === 'dark' ? '#fff' : '#004dda' }}
      >
        {title}
      </h2>

      {/* Chart */}
      <div className="w-full h-48 sm:h-56 md:h-64 flex-shrink-0">
        <ResponsiveContainer>
          <PieChart margin={chartSettings.margin}>
            <defs>
              {colors.map((color, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`pieGradient-${index}`}
                  x1="0%" y1="0%" x2="100%" y2="100%"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartSettings.outerRadius}
              innerRadius={chartSettings.innerRadius}
              labelLine={false}
              label={(props) => renderDrilldownPercentageLabel({ ...props, theme })}
              onClick={onClick}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  className={onClick ? 'cursor-pointer' : ''}
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
        {sortedData.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center justify-between text-sm py-0.5 transition-colors duration-150 hover:opacity-80"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
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

StaticPieWithLegend.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default StaticPieWithLegend;