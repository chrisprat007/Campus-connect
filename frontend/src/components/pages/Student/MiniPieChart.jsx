import React from 'react';

const MiniPieChart = ({ data, size = 100 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  const createPath = (percentage, cumulativePercentage) => {
    const startAngle = cumulativePercentage * 3.6 - 90;
    const endAngle = (cumulativePercentage + percentage) * 3.6 - 90;
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
    return `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };
  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const path = createPath(percentage, cumulativePercentage);
          cumulativePercentage += percentage;
          return (
            <path
              key={index}
              d={path}
              fill={item.color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default MiniPieChart;