import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import { themeConfig } from '../config/theme';

const PieCustomTooltip = ({ active, payload, theme }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const displayValue = data.payload.displayValue ?? data.value;
  const percentage = data.payload.percent
    ? `${(data.payload.percent * 100).toFixed(1)}%`
    : null;
  const currentTheme = themeConfig[theme];

  return (
    <div
      className={`
        chart-tooltip px-4 py-3 rounded-xl
        ${currentTheme.tooltip.bg} 
        ${currentTheme.tooltip.border} 
        ${currentTheme.tooltip.shadow}
        border animate-fade-in-scale
      `}
    >
      {/* Color indicator and name */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: data.payload.fill || data.fill }}
        />
        <span
          className="font-semibold text-sm"
          style={{ color: currentTheme.textPrimary }}
        >
          {data.name}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span
          className="text-lg font-bold"
          style={{ color: data.payload.fill || data.fill }}
        >
          {formatCurrency(displayValue)}
        </span>
        {percentage && (
          <span
            className="text-xs font-medium"
            style={{ color: currentTheme.textSecondary }}
          >
            ({percentage})
          </span>
        )}
      </div>
    </div>
  );
};

PieCustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  theme: PropTypes.string.isRequired,
};

export default PieCustomTooltip;