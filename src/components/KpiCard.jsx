import React from 'react';
import PropTypes from 'prop-types';

const KpiCard = ({ icon, title, value, theme }) => {
  const Icon = icon;
  const isDark = theme === 'dark';
  
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-md flex items-center px-6 py-5 min-w-[180px]`} style={{minHeight: 110}}>
      <Icon className={`h-8 w-8 mr-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
      <div className="flex flex-col justify-center">
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} leading-tight`}>{value}</span>
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'} leading-tight`}>{title}</span>
      </div>
    </div>
  );
};

KpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.string.isRequired,
};

export default KpiCard;