import User from '../models/User.model.js';
import Transaction from '../models/Transaction.model.js';
import DoneTransaction from '../models/DoneTransaction.model.js';

/**
 * GET /api/user
 * Returns the first user (or user by name) with budget.
 */
export const getUser = async (req, res) => {
  try {
    // Assuming you have a single user; adjust as needed.
    const user = await User.findOne({ name: 'Onkar' });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/transactions
 * Returns all active (open) transactions.
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ Timestamp: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/donetransactions
 * Returns all closed positions.
 */
export const getDoneTransactions = async (req, res) => {
  try {
    const doneTransactions = await DoneTransaction.find({}).sort({ Timestamp: -1 });
    res.status(200).json(doneTransactions);
  } catch (error) {
    console.error('Error fetching done transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/summary
 * Returns computed portfolio summary:
 * - budget, totalInvested, currentValue, unrealizedPnl, realizedPnl, totalPnl, pnlPercentage
 */
export const getSummary = async (req, res) => {
  try {
    const user = await User.findOne({ name: 'Onkar' });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = await Transaction.find({});
    const doneTransactions = await DoneTransaction.find({});

    // Compute invested and current value from active positions
    let totalInvested = 0;
    let currentValue = 0;

    transactions.forEach((txn) => {
      totalInvested += txn.Price * txn.Quantity;
      currentValue += txn.ltp * txn.Quantity;
    });

    const unrealizedPnl = currentValue - totalInvested;

    // Realized P&L from closed positions
    let realizedPnl = 0;
    doneTransactions.forEach((txn) => {
      realizedPnl += txn.profit;
    });

    const totalPnl = unrealizedPnl + realizedPnl;
    const pnlPercentage = totalInvested ? (totalPnl / totalInvested) * 100 : 0;

    res.status(200).json({
      budget: user.budget,
      totalInvested,
      currentValue,
      unrealizedPnl,
      realizedPnl,
      totalPnl,
      pnlPercentage,
    });
  } catch (error) {
    console.error('Error computing summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * (Optional) POST /api/buy
 * Manually trigger a buy cycle – useful for testing or manual intervention.
 * Uses the existing buyETF logic (you'll need to import getETFData and buyETF).
 * Note: This is optional; if you don't need it, you can omit.
 */
// import { getETFData } from '../services/etf.service.js';
// import { buyETF } from '../cron/etfScheduler.js'; // assuming you export buyETF
// export const manualBuy = async (req, res) => {
//   try {
//     const data = await getETFData();
//     await buyETF(data);
//     res.status(200).json({ message: 'Buy cycle executed successfully' });
//   } catch (error) {
//     console.error('Manual buy error:', error);
//     res.status(500).json({ error: 'Failed to execute buy' });
//   }
// };

/**
 * (Optional) POST /api/sell
 * Manually trigger a sell cycle.
 */
// export const manualSell = async (req, res) => {
//   try {
//     const data = await getETFData();
//     await sellETF(data);
//     res.status(200).json({ message: 'Sell cycle executed successfully' });
//   } catch (error) {
//     console.error('Manual sell error:', error);
//     res.status(500).json({ error: 'Failed to execute sell' });
//   }
// };