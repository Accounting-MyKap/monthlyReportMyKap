import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';
import { themeConfig } from '../config/theme';

const PieCustomTooltip = ({ active, payload, theme }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const displayValue = data.payload.displayValue ?? data.value;
    return (
      <div className={`${themeConfig[theme].tooltip.bg} p-3 rounded-lg border ${themeConfig[theme].tooltip.border} backdrop-blur-sm`}>
        <p className={`font-bold ${themeConfig[theme].textPrimary}`}>{data.name}</p>
        <p style={{ color: data.fill }}>
          {formatCurrency(displayValue)}
        </p>
      </div>
    );
  }
  return null;
};

PieCustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  theme: PropTypes.string.isRequired,
};

export default PieCustomTooltip;