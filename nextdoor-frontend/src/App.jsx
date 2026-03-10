import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import Complaint from "./pages/Complaint";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserHome from "./pages/user/UserHome";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminComplaints from "./pages/AdminComplaints";
import AdminAbout from "./pages/AdminAbout";
import ProviderDashboard from "./pages/ProviderDashboard";
import Welcome from "./pages/Welcome";
import SplashScreen from "./pages/SplashScreen";

/* 👇 Helper component */
function Layout() {
  const location = useLocation();

  // pages where navbar SHOULD NOT appear (admin pages have their own navbar)
  const hideNavbarRoutes = [
    "/",
    "/home",
    "/welcome",
    "/login",
    "/register",
    "/admin/dashboard",
    "/admin/feedback",
    "/admin/complaints",
    "/admin/about"
  ];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <NavBar />}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER & PROVIDER */}
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/about" element={<AdminAbout />} />

        {/* COMMON */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
