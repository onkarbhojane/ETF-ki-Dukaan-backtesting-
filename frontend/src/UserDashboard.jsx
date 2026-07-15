import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCards from './components/SummaryCards';
import PortfolioTable from './components/PortfolioTable';
import ClosedPositionsTable from './components/ClosedPositionsTable';
import ProfitChart from './components/ProfitChart';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [doneTransactions, setDoneTransactions] = useState([]);

  // Compute derived stats
  const totalInvested = (transactions||[]).reduce(
    (sum, t) => sum + t.Price * t.Quantity,
    0
  );
  const currentValue = transactions.reduce(
    (sum, t) => sum + t.ltp * t.Quantity,
    0
  );
  const unrealizedPnl = currentValue - totalInvested;
  const realizedPnl = doneTransactions.reduce(
    (sum, d) => sum + d.profit,
    0
  );
  const totalPnl = unrealizedPnl + realizedPnl;
  const pnlPercentage = totalInvested ? (totalPnl / totalInvested) * 100 : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, txnRes, doneRes] = await Promise.all([
          axios.get('https://etf-ki-dukaan-backtesting001.onrender.com/api/user/api/user'),
          axios.get('https://etf-ki-dukaan-backtesting001.onrender.com/api/user/api/transactions'),
          axios.get('https://etf-ki-dukaan-backtesting001.onrender.com/api/user/api/donetransactions'),
        ]);
        setUser(userRes.data);
        setTransactions(txnRes.data);
        setDoneTransactions(doneRes.data);
        setError('');
        console.log('User:', userRes);
        console.log('Transactions:', txnRes);
        console.log('Done Transactions:', doneRes);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user?.name || 'User'} 👋
      </h1>

      {/* Summary Cards */}
      <SummaryCards
        budget={user?.budget || 0}
        totalInvested={totalInvested}
        currentValue={currentValue}
        totalPnl={totalPnl}
        pnlPercentage={pnlPercentage}
      />

      {/* Profit Chart */}
      <div className="mt-8">
        <ProfitChart doneTransactions={doneTransactions} />
      </div>

      {/* Portfolio Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Current Portfolio
        </h2>
        <PortfolioTable transactions={transactions} />
      </div>

      {/* Closed Positions */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Closed Positions
        </h2>
        <ClosedPositionsTable doneTransactions={doneTransactions} />
      </div>
    </div>
  );
};

export default UserDashboard;
