import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { themeConfig } from '../config/theme';
import PieCustomTooltip from './PieCustomTooltip';
import { renderDrilldownPercentageLabel } from './chartLabels';
import { formatCurrency } from '../utils/formatters';

const StaticPieWithLegend = ({ title, data, colors, theme, onClick }) => {
  const sortedData = useMemo(() => (Array.isArray(data) ? [...data].sort((a, b) => b.value - a.value) : []), [data]);

  return (
    <div className={`${themeConfig[theme].card} p-6 rounded-2xl shadow-lg h-full flex flex-col`}>
      <h2 className="text-xl font-bold mb-4 flex-shrink-0" style={{color: theme === 'dark' ? '#fff' : themeConfig[theme].accent}}>{title}</h2>
      <div className="w-full h-[250px] flex-shrink-0">
        <ResponsiveContainer>
          <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              labelLine={false}
              label={(props) => renderDrilldownPercentageLabel({ ...props, theme })}
              onClick={onClick}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className={onClick ? 'cursor-pointer' : ''} />
              ))}
            </Pie>
            <Tooltip content={<PieCustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full mt-2 space-y-2 px-4 overflow-y-auto">
        {sortedData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }} />
              <span style={{color: themeConfig[theme].textSecondary}}>{entry.name}</span>
            </div>
            <span style={{color: themeConfig[theme].textPrimary, fontFamily: 'monospace'}}>{formatCurrency(entry.displayValue)}</span>
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