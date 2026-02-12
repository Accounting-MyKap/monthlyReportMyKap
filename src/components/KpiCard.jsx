import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '../config/theme';

const KpiCard = ({ icon, title, value, theme, accentColor }) => {
  const Icon = icon;
  const isDark = theme === 'dark';
  const currentTheme = themeConfig[theme];

  // Default accent color based on theme
  const iconColorClass = accentColor || currentTheme.kpiCard.iconColor;

  return (
    <div
      className={`
        kpi-card rounded-2xl shadow-card
        ${currentTheme.kpiCard.bg}
        flex items-center gap-4 px-5 py-4
        border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}
        animate-fade-in
      `}
    >
      {/* Icon container with subtle background */}
      <div
        className={`
          flex-shrink-0 p-3 rounded-xl
          ${currentTheme.kpiCard.iconBg}
          transition-transform duration-250
        `}
      >
        <Icon className={`h-6 w-6 ${iconColorClass}`} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex flex-col min-w-0">
        <span
          className={`
            text-xl font-bold leading-tight truncate
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}
        >
          {value}
        </span>
        <span
          className={`
            text-sm font-medium leading-tight truncate
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

KpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.string.isRequired,
  accentColor: PropTypes.string,
};

export default KpiCard;