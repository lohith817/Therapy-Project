import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TherapistList from "./pages/TherapistList";
import TherapistProfile from "./pages/TherapistProfile";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Assessment from "./pages/Assessment";
import ResourceLibrary from "./pages/ResourceLibrary";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/therapists" element={<TherapistList />} />
        <Route path="/therapists/:id" element={<TherapistProfile />} />
        <Route path="/resources" element={<ResourceLibrary />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute roles={["client"]}>
              <Assessment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
