import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MoodTrackingPage from "./pages/MoodTrackingPage";
import JournalPage from "./pages/JournalPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mood-tracking" element={<MoodTrackingPage />} />
        <Route path="/journaling" element={<JournalPage />} />
      </Routes>
    </Router>
  );
};

export default App;
