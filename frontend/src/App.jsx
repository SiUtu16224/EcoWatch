import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/Map";
import Report from "./pages/Report";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Reward from "./pages/Reward";
import { useAuth } from "./context/Authcontext";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/lapor"
          element={user ? <Report /> : <Navigate to="/login" />}
        />

        <Route
          path="/map"
          element={user ? <MapPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/artikel"
          element={user ? <Articles /> : <Navigate to="/login" />}
        />

        <Route
          path="/artikel/:id"
          element={user ? <ArticleDetail /> : <Navigate to="/login" />}
        />

        <Route
          path="/reward"
          element={user ? <Reward /> : <Navigate to="/login" />}
        />

        
      </Routes>
    </BrowserRouter>
  );
}
