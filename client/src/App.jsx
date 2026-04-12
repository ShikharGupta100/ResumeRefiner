// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar          from "./components/layout/Navbar";
import Footer          from "./components/layout/Footer";
import HomePage        from "./pages/HomePage";
import ResultPage      from "./pages/ResultPage";
import HistoryPage     from "./pages/HistoryPage";
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import GoogleSuccessPage from "./pages/GoogleSuccessPage";
import "./styles/global.css";

// Redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuth, ready } = useAuth();
  if (!ready) return null; // wait for localStorage rehydration
  return isAuth ? children : <Navigate to="/login" replace />;
}

// Redirects to / if already logged in
function GuestRoute({ children }) {
  const { isAuth, ready } = useAuth();
  if (!ready) return null;
  return !isAuth ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Protected */}
            <Route path="/" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            }/>
            <Route path="/result/:id" element={
              <ProtectedRoute><ResultPage /></ProtectedRoute>
            }/>
            <Route path="/history" element={
              <ProtectedRoute><HistoryPage /></ProtectedRoute>
            }/>

            {/* Guest only */}
            <Route path="/login"  element={<GuestRoute><LoginPage /></GuestRoute>}  />
            <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

            {/* Auth callbacks */}
            <Route path="/verify-email"        element={<VerifyEmailPage />}   />
            <Route path="/auth/google/success" element={<GoogleSuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}