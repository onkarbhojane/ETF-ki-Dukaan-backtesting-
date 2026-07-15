import cron from "node-cron";
import axios from "axios";
import { getETFData } from "../services/etf.service.js";
import Transactions from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import DoneTransactionModel from "../models/DoneTransaction.model.js";
// Cache holidays for the day
let holidayCache = [];

/**
 * Fetch NSE trading holidays
 */
async function loadTradingHolidays() {
  try {
    const { data } = await axios.get(
      "https://www.nseindia.com/api/holiday-master?type=trading",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          Referer: "https://www.nseindia.com/",
        },
      },
    );

    holidayCache =
      data?.CM?.map((item) => item.tradingDate) ||
      data?.data?.map((item) => item.tradingDate) ||
      [];

    console.log("Trading holidays loaded:", holidayCache.length);
  } catch (err) {
    console.log("Unable to load holiday list", err);
  }
}

function formatDate(date) {
  return date.toLocaleDateString("en-GB");
}

function isTradingDay() {
  const today = new Date();

  // Saturday
  if (today.getDay() === 6) return false;

  // Sunday
  if (today.getDay() === 0) return false;

  const current = formatDate(today);

  if (holidayCache.includes(current)) return false;

  return true;
}

export async function startCron() {
  await loadTradingHolidays();

  cron.schedule(
    "0 6 * * 0",
    async () => {
      await loadTradingHolidays();
    },
    {
      timezone: "Asia/Kolkata",
    },
  );

  // Every weekday at 3:00 PM
  cron.schedule(
    "0 15 * * 1-5",
    async () => {
      if (!isTradingDay()) {
        console.log("Holiday / Weekend");
        return;
      }

      console.log("Trading Day");
      const data = await getETFData();
      buyETF(data);
    },
    {
      timezone: "Asia/Kolkata",
    },
  );

  // Check ETF sell conditions every 30 minutes during market hours
  cron.schedule(
    "*/30 9-15 * * 1-5",
    async () => {
      if (!isTradingDay()) {
        console.log("Holiday / Weekend - Sell check skipped");
        return;
      }

      const now = new Date();

      const currentTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });

      // NSE market hours filter
      if (currentTime < "09:15:00" || currentTime > "15:30:00") {
        return;
      }

      console.log("Running ETF Sell Check:", currentTime);

      try {
        const data = await getETFData();

        await sellETF(data);

        console.log("ETF Sell Check Completed");
      } catch (error) {
        console.error("Error during ETF sell check:", error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
  console.log("ETF Scheduler Started ");
}

const buyETF = async (data) => {
  try {
    const tns = await Transactions.find({});
    const user = await User.findOne({ name: "Onkar" }); // Assuming you have a User model and you want to fetch the first user
    if (!user) {
      console.error("No user found in the database.");
      return;
    }
    const buyETFs = data.summary;
    const threshold = 3.14;
    const budget = 1000;
    user.budget -= budget; // Deduct the budget from the user's budget
    if (user.budget < 0) {
      console.error("Insufficient budget for buying ETFs.");
      return;
    }
    const buyETFbucket = [];
    for (let i = 0; i < buyETFs.length; i++) {
      console.log("Comparing:", buyETFs[i]);

      for (let j = 0; j < data.etfs.length; j++) {
        if (data.etfs[j].symbol === buyETFs[i]) {
          buyETFbucket.push(data.etfs[j]);
          break;
        }
      }
    }

    console.log("Buy ETF Bucket:", buyETFbucket);

    console.log("Buy ETF Bucket:", buyETFbucket);
    for (let i = 0; i < buyETFbucket.length; i++) {
      let flag = false;
      for (let j = 0; j < tns.length; j++) {
        if (tns[j].Symbol === buyETFbucket[i].symbol) {
          console.log("Already Bought");
          flag = true;
        }
      }
      if (!flag) {
        //buy the ETF
        const newTransaction = new Transactions({
          Symbol: buyETFbucket[i].symbol,
          Price: buyETFbucket[i].price,
          Quantity: budget / buyETFbucket[i].price,
          ltp: buyETFbucket[i].price,
        });
        await newTransaction.save();
        await user.save();
        console.log("Bought ETF:", buyETFbucket[i].symbol);
        return;
      }
    }

    for (let i = 0; i < buyETFbucket.length; i++) {
      let flag = false;
      for (let j = 0; j < tns.length; j++) {
        if (tns[j].Symbol === buyETFbucket[i].symbol) {
          console.log("Already Bought");
          if (
            ((tns[j].ltp - buyETFbucket[i].price) / tns[j].ltp) * 100 >
            threshold
          ) {
            //loss is in the range of threshold, average down the position
            console.log("Averaging Down");
            const newQuantity = budget / buyETFbucket[i].price;
            tns[j].Quantity += newQuantity;
            tns[j].Price =
              (tns[j].Price * tns[j].Quantity +
                buyETFbucket[i].price * newQuantity) /
              (tns[j].Quantity + newQuantity);
            tns[j].ltp = buyETFbucket[i].price;
            await tns[j].save();
            await user.save();
            console.log("Averaged Down");
            return;
          }
        }
      }
      console.log("No ETF is bought from the list which is not ready to buy");
    }
  } catch (error) {
    console.error("Error occurred while buying ETF:", error);
  }
};

const sellETF = async (data) => {
  try {
    const tns = await Transactions.find({});
    const sellETFs = data.etfs;
    const threshold = 3.14;
    const user = await User.findOne({ name: "Onkar" });
    if (!user) {
      console.error("No user found in the database.");
      return;
    }
    for (let i = 0; i < tns.length; i++) {
      for (let j = 0; j < sellETFs.length; j++) {
        if (tns[i].Symbol === sellETFs[j].symbol) {
          if (
            ((sellETFs[j].price - tns[i].Price) / sellETF[j].Price) * 100 >
            threshold
          ) {
            //sell the ETF
            user.budget += tns[i].Quantity * sellETFs[j].price;
            await user.save();
            await Transactions.deleteOne({ _id: tns[i]._id });
            const doneTransaction = new DoneTransactionModel({
              Symbol: tns[i].Symbol,
              Price: tns[i].Price,
              Quantity: tns[i].Quantity,
              profit: (sellETFs[j].price - tns[i].Price) * tns[i].Quantity,
              Timestamp: new Date(),
            });
            await doneTransaction.save();
            console.log("Sold ETF:", tns[i].Symbol);
            return;
          }
        }
      }
    }
    console.log("No ETF is ready to sell based on the threshold.");
  } catch (error) {
    console.error("Error occurred while selling ETF:", error);
  }
};
