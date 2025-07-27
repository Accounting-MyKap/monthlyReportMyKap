import React from 'react';
import PropTypes from 'prop-types';

const KpiCard = ({ icon, title, value }) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-2xl shadow-md flex items-center px-6 py-5 min-w-[180px]" style={{minHeight: 110}}>
      <Icon className="h-8 w-8 mr-4 text-cyan-600" />
      <div className="flex flex-col justify-center">
        <span className="text-lg font-bold text-gray-800 leading-tight">{value}</span>
        <span className="text-sm text-gray-500 leading-tight">{title}</span>
      </div>
    </div>
  );
};

KpiCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default KpiCard;