import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import MarketPlace from "./pages/MarketPlace";
import RequestPage from "./pages/RequestPage";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute> <HomePage /> </ProtectedRoute>}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/requests" element={<RequestPage />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
