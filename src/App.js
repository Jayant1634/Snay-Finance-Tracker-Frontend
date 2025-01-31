import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddTransactionForm from './components/AddTransactionForm';
import FinancialGoals from './components/FinancialGoals';
import Predictions from './components/Predictions';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword'; import OtpVerification from './components/OtpVerification'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import ResetPassword from './components/ResetPassword';
import LandingPage from './components/LandingPage';
import Transactions from './components/Transactions';
import HomePage from './components/HomePage';
import Profile from './components/Profile/Profile';
import Features from './components/Features';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Login is accessible at root */}
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransactionForm />} />
          <Route path="/goals" element={<FinancialGoals />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/login" element={<Login />} /> {/* Optional: Explicit login route */}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New Route */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* New Route */}
          <Route path="/otp-verification" element={<OtpVerification />} /> {/* Add OTP route */}
          <Route path="/transactions" element={<Transactions/>} />          
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} /> {/* Added Profile Route */}
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
