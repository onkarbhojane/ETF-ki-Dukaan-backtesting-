# ETF Ki Dukan -- Automated Trading & Portfolio Tracker

A full-stack application that implements the **ETF Ki Dukan strategy**
--- a rules-based ETF trading bot that periodically buys and sells ETFs
based on price thresholds.

The system includes a cron-based scheduler, MongoDB database, and React
dashboard for tracking portfolio performance, current holdings, and
profit analytics.

## 🚀 Features

- **Automated Trading** -- Runs every market day at **3:00 PM** to buy
  ETFs and every **30 minutes between 9:15 AM and 3:30 PM** to check
  sell conditions.
- **Smart Averaging** -- If an ETF drops more than **3.14%** from the
  average buy price, the strategy averages down with an additional
  purchase.
- **Profit Booking** -- Sells when profit exceeds the **3.14%
  threshold**.
- **User Dashboard** -- Portfolio view, profit/loss summary, closed
  positions table, and cumulative profit chart.
- **REST API** -- Exposes user data, open transactions, closed
  positions, and summary statistics.
- **Responsive UI** -- Built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- node-cron
- Axios
- dotenv

### Frontend

- React
- Axios
- Recharts
- Tailwind CSS

## 📁 Project Structure

```text
ETF-Ki-Dukan/
├── backend/
│   ├── controllers/
│   │   └── etfController.js
│   ├── models/
│   │   ├── Transaction.model.js
│   │   ├── DoneTransaction.model.js
│   │   └── User.model.js
│   ├── services/
│   │   └── etf.service.js
│   ├── cron/
│   │   └── etfScheduler.js
│   ├── routes/
│   │   └── etfRoutes.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── PortfolioTable.jsx
│   │   │   ├── ClosedPositionsTable.jsx
│   │   │   └── ProfitChart.jsx
│   │   ├── UserDashboard.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## 🔧 Prerequisites

Before running the project, install:

- Node.js v14 or later
- MongoDB or MongoDB Atlas
- npm or yarn

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ETF-Ki-Dukan.git
cd ETF-Ki-Dukan
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
```

> **Security:** Never commit your real MongoDB username, password, or
> connection URI to GitHub. Keep `.env` in `.gitignore`.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

For development with nodemon:

```bash
npm run dev
```

The backend server runs at:

```text
http://localhost:8080
```

### Start the Frontend

```bash
cd frontend
npm start
```

The React application runs at:

```text
http://localhost:3000
```

## 📡 API Endpoints

All endpoints are prefixed with `/api`.

  Method   Endpoint              Description

---

  GET      `/user`               Returns the user object including name and budget
  GET      `/transactions`       Lists all active/open positions
  GET      `/donetransactions`   Lists all closed/realised positions
  GET      `/summary`            Returns aggregated portfolio statistics

### Example `/summary` Response

```json
{
  "budget": 4000,
  "totalInvested": 2500,
  "currentValue": 2700,
  "unrealizedPnl": 200,
  "realizedPnl": 150,
  "totalPnl": 350,
  "pnlPercentage": 14.0
}
```

## 🧠 Strategy Overview

### Buy Signal

At **3:00 PM on trading days**, the system:

1. Computes a list of ETFs to buy based on the summary provided by
   `etf.service.js`.
2. Checks whether an ETF is already held.
3. If no existing holding exists, buys the ETF using a fixed budget of
   **₹1,000**.
4. If the ETF is already held and its price has dropped by more than
   **3.14%**, the system purchases additional quantity to average down.

### Sell Signal

Every **30 minutes during market hours**, the system:

1. Fetches the latest ETF data.
2. Checks all currently held ETFs.
3. Compares the current ETF price with its average buy price.
4. If profit exceeds **3.14%**, the entire position is sold.
5. Records the completed trade in `DoneTransaction`.
6. Updates the user's available budget.

The strategy also respects:

- NSE trading holidays
- Saturdays and Sundays
- Indian market timings

## ⏰ Scheduler

### Buy Cron

Runs every weekday at **3:00 PM IST**.

```text
0 15 * * 1-5
```

### Sell Check Cron

Checks sell conditions every **30 minutes during market hours**.

The sell scheduler runs only on valid NSE trading days.

## 🖥️ Dashboard Components

### Summary Cards

Displays:

- Available budget
- Total invested amount
- Current portfolio value
- Total P&L
- P&L percentage

### Portfolio Table

Displays currently held ETFs with:

- ETF symbol
- Quantity
- Average buy price
- Last traded price (LTP)
- Profit/Loss

### Closed Positions Table

Displays completed trades with:

- ETF symbol
- Buy price
- Sell price
- Quantity
- Realised profit
- Sell date

### Profit Chart

Displays cumulative realised profit over time using Recharts.

## 📦 Key Dependencies

### Backend

- `express`
- `mongoose`
- `node-cron`
- `axios`
- `dotenv`
- `nodemon`

### Frontend

- `react`
- `react-dom`
- `axios`
- `recharts`
- `tailwindcss`

## 🚢 Deployment

### Backend

Deploy the backend to a Node.js hosting platform.

Configure the following environment variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
```

Never hardcode database credentials in the source code.

### Frontend

Build the production application:

```bash
cd frontend
npm run build
```

Deploy the generated production build to a compatible static frontend
hosting platform.

## 🔐 Security

- Never commit `.env` files.
- Never expose MongoDB credentials.
- Store production secrets as environment variables.
- Rotate database credentials if they are accidentally exposed.
- Validate API input before storing data.
- Add authentication and authorization before using the application
  with multiple users.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE`
file for details.

## 🙏 Acknowledgements

- NSE India for holiday and ETF-related data used by the project.
- The open-source community for the frameworks, libraries, and
  development tools.

## ⚠️ Disclaimer

This project is intended for **educational and research purposes only**.

It is not financial or investment advice. Automated trading strategies
involve financial risk. Always test a strategy thoroughly before using
it with real money.

---

**Happy Trading! 📈**
