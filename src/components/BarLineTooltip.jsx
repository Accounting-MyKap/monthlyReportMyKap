import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '../config/theme';
import { formatCurrency } from '../utils/formatters';

const BarLineTooltip = ({ active, payload, label, theme }) => {
  if (!active || !payload || !payload.length) return null;

  const currentTheme = themeConfig[theme];

  return (
    <div
      className={`
        chart-tooltip px-4 py-3 rounded-xl min-w-[180px]
        ${currentTheme.tooltip.bg} 
        ${currentTheme.tooltip.border}
        ${currentTheme.tooltip.shadow}
        border animate-fade-in-scale
      `}
    >
      {/* Month label */}
      <div
        className="font-semibold text-sm mb-3 pb-2 border-b"
        style={{
          color: currentTheme.textPrimary,
          borderColor: currentTheme.divider
        }}
      >
        {label}
      </div>

      {/* Data items */}
      <div className="space-y-2">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: currentTheme.textSecondary }}
              >
                {item.name}
              </span>
            </div>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: item.color }}
            >
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

BarLineTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
  theme: PropTypes.string.isRequired,
};

export default BarLineTooltip;