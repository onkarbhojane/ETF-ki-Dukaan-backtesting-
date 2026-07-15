import React from 'react';

const SummaryCards = ({
  budget,
  totalInvested,
  currentValue,
  totalPnl,
  pnlPercentage,
}) => {
  const cardStyle =
    'bg-white rounded-lg shadow-md p-6 flex flex-col items-start';
  const labelStyle = 'text-sm font-medium text-gray-500 uppercase tracking-wider';
  const valueStyle = 'text-2xl font-bold text-gray-800 mt-1';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className={cardStyle}>
        <span className={labelStyle}>Budget</span>
        <span className={valueStyle}>₹{budget.toFixed(2)}</span>
      </div>
      <div className={cardStyle}>
        <span className={labelStyle}>Invested</span>
        <span className={valueStyle}>₹{totalInvested.toFixed(2)}</span>
      </div>
      <div className={cardStyle}>
        <span className={labelStyle}>Current Value</span>
        <span className={valueStyle}>₹{currentValue.toFixed(2)}</span>
      </div>
      <div className={cardStyle}>
        <span className={labelStyle}>Total P&L</span>
        <span
          className={`${valueStyle} ${
            totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          ₹{totalPnl.toFixed(2)}
        </span>
      </div>
      <div className={cardStyle}>
        <span className={labelStyle}>P&L %</span>
        <span
          className={`${valueStyle} ${
            pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {pnlPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default SummaryCards;