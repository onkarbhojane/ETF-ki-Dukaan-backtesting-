import express from 'express';
import {
  getUser,
  getTransactions,
  getDoneTransactions,
  getSummary,
  // manualBuy,
  // manualSell,
} from '../controllers/AllControllers.js';

const router = express.Router();

router.get('/user', getUser);
router.get('/transactions', getTransactions);
router.get('/donetransactions', getDoneTransactions);
router.get('/summary', getSummary);

// Optional manual triggers
// router.post('/buy', manualBuy);
// router.post('/sell', manualSell);

export default router;