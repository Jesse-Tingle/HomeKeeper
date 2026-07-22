import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HomeDetailsPage from "./pages/HomeDetailsPage";
import AssetDetailsPage from "./pages/AssetDetailsPage";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomesPage from "./pages/HomesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/homes" element={<HomesPage />} />
          <Route path="/homes/:id" element={<HomeDetailsPage />} />
          <Route path="/assets/:id" element={<AssetDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}