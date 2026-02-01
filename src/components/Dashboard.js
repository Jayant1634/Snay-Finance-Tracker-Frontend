import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  Card,
  Container,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import AddTransactionForm from "./AddTransactionForm";
import { FaPlus } from "react-icons/fa";
import FinancialGoals from "./FinancialGoals";
import { API_URL } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import "./Dashboard.css";

// Register the required elements
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [particles, setParticles] = useState([]);
  const isDark = theme === "dark";
  const chartTextColor = isDark ? "#e2e8f0" : "#374151";
  const chartGridColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(0,0,0,0.05)";

  // Month filter - default to current month
  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [trendViewMode, setTrendViewMode] = useState("day"); // "day" | "month"
  const [pieViewMode, setPieViewMode] = useState("month"); // "day" | "month"

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(API_URL + `/transactions/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(API_URL + `/goals/${user.id}`);
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
    fetchGoals();
  }, [user, navigate, fetchGoals, fetchTransactions]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, index) => (
      <div
        key={index}
        className={`particle particle-${
          index + 1
        } particle-${
          ["small", "medium", "large"][
            Math.floor(Math.random() * 3)
          ]
        } particle-${
          ["blue", "pink", "yellow", "green"][
            Math.floor(Math.random() * 4)
          ]
        }`}
      />
    ));
    setParticles(newParticles);
  }, []); // Empty dependency array ensures this runs only once

  // Get month key (YYYY-MM) from transaction date
  const getMonthKey = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // Get date key (YYYY-MM-DD) from transaction date
  const getDateKey = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Get available months from transactions (sorted newest first)
  const getAvailableMonths = () => {
    const months = new Set(transactions.map((t) => getMonthKey(t.date)));
    const current = getCurrentMonthKey();
    if (!months.has(current)) months.add(current);
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter((t) => getMonthKey(t.date) === selectedMonth);

  // Current Balance = all-time (like a bank account) - never resets
  const currentBalance = transactions.reduce((balance, t) => {
    return t.type === "income" ? balance + t.amount : balance - t.amount;
  }, 0);

  // Monthly totals (for selected month only)
  const monthlyTotalAmount = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAddMoneyModalClose = () => setShowAddMoneyModal(false);

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount);

    if (!isNaN(amount) && amount > 0) {
      try {
        const userId = JSON.parse(window.localStorage.getItem("user")).id;

        const response = await fetch(`${API_URL}/users/updateBalance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, amount }),
        });

        const data = await response.json();

        if (response.ok) {
          fetchTransactions(); // Refresh transactions after adding money
          setAddMoneyAmount("");
          handleAddMoneyModalClose();
        } else {
          console.error(data.message);
          alert("Error updating balance: " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to update balance. Please try again.");
      }
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const calculateExpensesByCategory = (data) => {
    const categoryTotals = data
      .filter((transaction) => transaction.type === "expense")
      .reduce((totals, transaction) => {
        const category = transaction.category;
        if (!totals[category]) {
          totals[category] = 0;
        }
        totals[category] += transaction.amount;
        return totals;
      }, {});

    return categoryTotals;
  };

  // Format time label based on transaction spread (seconds vs minutes vs hours)
  const formatTimeLabel = (date, showSeconds) => {
    if (showSeconds) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    }
    if (date.getMinutes() === 0 && date.getSeconds() === 0) {
      return `${String(date.getHours()).padStart(2, "0")}:00`;
    }
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Data for Spent vs Balance trend (day view: today only - per-transaction points)
  const getTrendDataDay = () => {
    const todayKey = getDateKey(new Date());
    const todayTx = transactions
      .filter((t) => getDateKey(t.date) === todayKey)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Determine time granularity from transaction spread
    let showSeconds = false;
    if (todayTx.length >= 2) {
      const first = new Date(todayTx[0].date).getTime();
      const last = new Date(todayTx[todayTx.length - 1].date).getTime();
      const spanMinutes = (last - first) / (60 * 1000);
      if (spanMinutes < 1) showSeconds = true; // span < 1 min -> show seconds
      else if (spanMinutes >= 60) showSeconds = false; // span >= 1 hour -> show hours
      // else span 1–60 min -> show minutes
    }

    const points = [];
    let runningBalance = 0;
    let runningExpense = 0;

    // Get balance at start of today (all transactions before today)
    const txBeforeToday = sortedTx.filter((t) => new Date(t.date) < todayStart);
    runningBalance = txBeforeToday.reduce(
      (bal, t) => (t.type === "income" ? bal + t.amount : bal - t.amount),
      0
    );

    // Start-of-day point (if we have any today transactions)
    if (todayTx.length > 0) {
      points.push({
        label: formatTimeLabel(todayStart, showSeconds),
        timestamp: todayStart.getTime(),
        balance: runningBalance,
        expense: 0,
      });
    }

    // Point for each transaction today
    for (const t of todayTx) {
      const d = new Date(t.date);
      if (t.type === "income") {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
        runningExpense += t.amount;
      }
      points.push({
        label: formatTimeLabel(d, showSeconds),
        timestamp: d.getTime(),
        balance: runningBalance,
        expense: runningExpense,
      });
    }

    if (points.length === 0) {
      // No transactions today - show single point
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const txUpToToday = sortedTx.filter((t) => new Date(t.date) <= todayEnd);
      const balance = txUpToToday.reduce(
        (bal, t) => (t.type === "income" ? bal + t.amount : bal - t.amount),
        0
      );
      return {
        labels: ["Today"],
        balanceByDay: [balance],
        expenseByDay: [0],
      };
    }

    return {
      labels: points.map((p) => p.label),
      balanceByDay: points.map((p) => p.balance),
      expenseByDay: points.map((p) => p.expense),
    };
  };

  // Data for Spent vs Balance trend (month view: all days of selected month)
  const getTrendDataMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const labels = [];
    const balanceByDay = [];
    const expenseByDay = [];
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month - 1, day);
      const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);
      const dateKey = getDateKey(dayDate);

      const txUpToDay = sortedTx.filter((t) => new Date(t.date) <= dayEnd);
      const balance = txUpToDay.reduce(
        (bal, t) => (t.type === "income" ? bal + t.amount : bal - t.amount),
        0
      );
      balanceByDay.push(balance);

      const dayTx = sortedTx.filter((t) => getDateKey(t.date) === dateKey && t.type === "expense");
      const expense = dayTx.reduce((sum, t) => sum + t.amount, 0);
      expenseByDay.push(expense);

      labels.push(`${monthNames[month - 1]} ${day}`);
    }

    return {
      labels,
      balanceByDay,
      expenseByDay,
    };
  };

  const trendData = trendViewMode === "day" ? getTrendDataDay() : getTrendDataMonth();

  // Expense goals: "expense", "budget", "spending" etc. – show as horizontal limit line(s)
  const expenseGoals = (goals || []).filter((g) => {
    const t = (g.goalType || "").toLowerCase();
    return t.includes("expense") || t.includes("budget") || t.includes("spending") || t.includes("limit");
  });

  const limitLineDatasets = expenseGoals.map((goal) => ({
    label: `Limit: ${goal.goalType} ($${goal.targetAmount})`,
    data: trendData.labels.map(() => goal.targetAmount),
    borderColor: "#f59e0b",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderDash: [6, 4],
    fill: false,
    tension: 0,
    pointRadius: 0,
    pointHoverRadius: 0,
  }));

  const trendChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: "Balance",
        data: trendData.balanceByDay,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
      },
      {
        label: "Expense",
        data: trendData.expenseByDay,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
      },
      ...limitLineDatasets,
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 11 },
          usePointStyle: true,
          color: chartTextColor,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxRotation: 45,
          color: chartTextColor,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: chartGridColor },
        ticks: {
          font: { size: 10 },
          callback: (v) => "$" + v,
          color: chartTextColor,
        },
      },
    },
  };

  const pieColors = isDark
    ? ["#f87171", "#60a5fa", "#fbbf24", "#34d399", "#a78bfa", "#fb923c"]
    : ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

  const todayKey = getDateKey(new Date());
  const pieTransactions =
    pieViewMode === "day" ? transactions.filter((t) => getDateKey(t.date) === todayKey) : filteredTransactions;
  const categoryExpenses = calculateExpensesByCategory(pieTransactions);
  const categoryPieData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    layout: { padding: { bottom: 8 } },
  };

  return (
    <div className="dashboard-container">
    {/* Render Particles */}
    {particles}

      <Container className="dashboard-main">
        {/* Header: Title, Month Filter & Add Transaction */}
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <div className="dashboard-header-actions">
            <div className="dashboard-month-filter">
              <Form.Label className="mb-0">View:</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="dashboard-month-select"
              >
                {getAvailableMonths().map((monthKey) => {
                  const [year, month] = monthKey.split("-");
                  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const label = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
                  return (
                    <option key={monthKey} value={monthKey}>
                      {label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            <Button variant="primary" className="btn-add-transaction" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Stats & Charts - Left: graph first, then 2 cards | Right: Expenses by Category (matches left height) */}
        <div className="dashboard-stats-row">
          <div className="dashboard-stats-left">
            <Card className="dashboard-card dashboard-card-chart dashboard-card-trend">
              <Card.Body>
                <div className="chart-card-header">
                  <Card.Title>Spent vs Balance Trend</Card.Title>
                  <Form.Select
                    value={trendViewMode}
                    onChange={(e) => setTrendViewMode(e.target.value)}
                    className="chart-view-dropdown"
                    size="sm"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                  </Form.Select>
                </div>
                <div className="trend-chart-wrapper">
                  <Line data={trendChartData} options={trendChartOptions} />
                </div>
              </Card.Body>
            </Card>
            <Card className={`dashboard-card dashboard-card-balance ${currentBalance < 0 ? "balance-negative" : ""}`}>
              <Card.Body>
                <Card.Title>Current Balance</Card.Title>
                <Card.Text className="dashboard-amount">
                  ${currentBalance.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title>Spent this Month</Card.Title>
                <Card.Text className="dashboard-amount">
                  ${monthlyTotalAmount.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="dashboard-stats-right">
            <Card className="dashboard-card dashboard-card-category">
              <Card.Body>
                <div className="chart-card-header">
                  <Card.Title>Expenses by Category</Card.Title>
                  <Form.Select
                    value={pieViewMode}
                    onChange={(e) => setPieViewMode(e.target.value)}
                    className="chart-view-dropdown"
                    size="sm"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                  </Form.Select>
                </div>
                <div className="category-pie-wrapper">
                  <Pie data={categoryPieData} options={chartOptions} />
                </div>
                <div className="category-pie-legend">
                  {categoryPieData.labels.map((label, i) => (
                    <div key={label} className="category-pie-legend-item">
                      <span
                        className="category-pie-legend-color"
                        style={{
                          backgroundColor:
                            categoryPieData.datasets[0].backgroundColor[i] || pieColors[i % 6],
                        }}
                      />
                      <span className="category-pie-legend-label">{label}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Financial Goals */}
        <Card className="dashboard-card dashboard-card-goals mb-3">
        <Card.Body className="py-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <Card.Title className="mb-0">Financial Goals</Card.Title>
            <Button variant="outline-success" size="sm" onClick={() => setShowGoalModal(true)}>
              Manage Goals
            </Button>
          </div>
          <FinancialGoals user={user} displayOnly />
        </Card.Body>
        </Card>

        {/* Modals */}
        <Modal show={showAddMoneyModal} onHide={handleAddMoneyModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Money to Balance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddMoney}>
              Add Money
            </Button>
          </Modal.Body>
        </Modal>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddTransactionForm onClose={() => setShowModal(false)} isOpen={showModal} />
          </Modal.Body>
        </Modal>

        <Modal
          show={showGoalModal}
          onHide={() => setShowGoalModal(false)}
          dialogClassName="goals-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Manage Financial Goals</Modal.Title>
          </Modal.Header>
          <Modal.Body className="goals-modal-body">
            <FinancialGoals
              user={user}
              onGoalAdded={() => {
                fetchGoals();
                setShowGoalModal(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default Dashboard;
