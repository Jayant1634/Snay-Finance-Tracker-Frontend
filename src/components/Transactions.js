import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  Form,
  Button,
  Pagination,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaTrash, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { API_URL, deleteTransaction } from "../services/api";
import { useNavigate } from "react-router-dom";
import AddTransactionForm from "./AddTransactionForm";
import Modal from "react-bootstrap/Modal";
import "./Transactions.css";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL + `/transactions/${user.id}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMonthKey = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const getAvailableMonths = () => {
    const months = new Set(transactions.map((t) => getMonthKey(t.date)));
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (!months.has(current)) months.add(current);
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  // Filter and sort transactions
  let filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter ? transaction.type === typeFilter : true;
    const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true;
    const matchesMonth = monthFilter ? getMonthKey(transaction.date) === monthFilter : true;
    return matchesSearch && matchesType && matchesCategory && matchesMonth;
  });

  // Sort
  filteredTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / transactionsPerPage));

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setCategoryFilter("");
    setMonthFilter("");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="transactions-page">
      <Container className="transactions-main">
        {/* Header */}
        <div className="transactions-header">
          <h2 className="transactions-title">Transactions</h2>
          <Button className="btn-add-transaction" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" />
            Add Transaction
          </Button>
        </div>

        {/* Filters */}
        <div className="transactions-filters">
          <Row className="g-3">
            <Col md={12} lg={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="transactions-filter-input"
                />
              </InputGroup>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="transactions-filter-select"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="transactions-filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="transactions-filter-select"
              >
                <option value="">All Months</option>
                {getAvailableMonths().map((monthKey) => {
                  const [year, month] = monthKey.split("-");
                  const label = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
                  return (
                    <option key={monthKey} value={monthKey}>
                      {label}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            <Col md={6} lg={2}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="transactions-filter-select"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Amount: High to low</option>
                <option value="amount-asc">Amount: Low to high</option>
              </Form.Select>
            </Col>
            <Col md={12} lg={1}>
              <Button variant="outline-secondary" size="sm" onClick={clearFilters} className="w-100">
                Clear
              </Button>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <div className="transactions-table-wrapper">
          <Table hover responsive className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`txn-badge txn-badge-${transaction.type}`}>{transaction.type}</span>
                    </td>
                    <td>{transaction.category}</td>
                    <td className={transaction.type === "income" ? "txn-amount-income" : "txn-amount-expense"}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </td>
                    <td>{transaction.description || "—"}</td>
                    <td className="text-end">
                      <Button
                        variant="link"
                        size="sm"
                        className="txn-delete-btn text-danger p-0"
                        onClick={() => setDeleteConfirm(transaction._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No transactions found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="transactions-pagination">
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p} active={p === currentPage} onClick={() => setCurrentPage(p)}>
                  {p}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </Pagination>
            <span className="txn-count text-muted">
              {indexOfFirst + 1}-{Math.min(indexOfLast, filteredTransactions.length)} of {filteredTransactions.length}
            </span>
          </div>
        )}
      </Container>

      {/* Add Transaction Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddTransactionForm
            onClose={() => {
              setShowAddModal(false);
              fetchTransactions();
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Delete Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TransactionsPage;
