import { useEffect } from "react";
import { useDataSync } from "./hooks/useDataSync";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatBox } from "./components/ChatBox";
import { Onboarding } from "./components/Onboarding";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user && !localStorage.getItem("accessToken"))
    return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DataSync() {
  useDataSync();
  return null;
}

function OnboardingGate() {
  const { user, fetchMe } = useAuth();
  if (!user || !localStorage.getItem("accessToken")) return null;
  if (!user.isFirstTime) return null;
  return <Onboarding onDone={() => fetchMe()} />;
}

function App() {
  const { fetchMe } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DataSync />
      <OnboardingGate />
      {!!localStorage.getItem("accessToken") && <ChatBox />}
    </BrowserRouter>
  );
}

export default App;
