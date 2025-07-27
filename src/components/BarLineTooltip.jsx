import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '../config/theme';
import { formatCurrency } from '../utils/formatters';

const BarLineTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${themeConfig[theme].tooltip.bg} p-3 rounded-lg border ${themeConfig[theme].tooltip.border} backdrop-blur-sm`}>
        <p className={`font-bold ${themeConfig[theme].textPrimary}`}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{`${p.name}: ${formatCurrency(p.value)}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

BarLineTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
  theme: PropTypes.string.isRequired,
};

export default BarLineTooltip; 