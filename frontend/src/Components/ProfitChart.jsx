import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const ProfitChart = ({ doneTransactions }) => {
  // Aggregate profits by date
  const profitData = doneTransactions.reduce((acc, txn) => {
    const date = new Date(txn.Timestamp).toLocaleDateString('en-IN');
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.profit += txn.profit;
    } else {
      acc.push({ date, profit: txn.profit });
    }
    return acc;
  }, []);

  // Sort by date
  profitData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute cumulative profit
  let cumulative = 0;
  const cumulativeData = profitData.map((item) => {
    cumulative += item.profit;
    return { ...item, cumulativeProfit: cumulative };
  });

  if (cumulativeData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No profit data to display.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Cumulative Profit Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={cumulativeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar dataKey="cumulativeProfit" fill="#8884d8">
            <LabelList dataKey="cumulativeProfit" position="top" formatter={(v) => `₹${v.toFixed(0)}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;