import React from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import CreatePoll from "./pages/CreatePoll";
import LiveResultsPage from "./pages/LiveResultsPage";
import ShareablePollVotingPage from "./pages/ShareablePollVotingPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
// import "./App.css";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {/* Public Auth Routes (No Header/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main App Wrapper (With Header/Footer) */}
        <Route element={<Layout />}>
          {/* --- PUBLIC ROUTES --- */}
          <Route index element={<Home />} />
          <Route
            path="poll-voting-page/:id"
            element={<ShareablePollVotingPage />}
          />
          <Route path="live-results-poll/:id" element={<LiveResultsPage />} />

          {/* --- PROTECTED ROUTES --- */}
          {/* This ProtectedRoute acts as a bouncer for everything inside it */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-poll" element={<CreatePoll />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
