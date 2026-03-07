import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

import SplashScreen from "./pages/SplashScreen";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import Complaint from "./pages/Complaint";

import UserHome from "./pages/user/UserHome";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminComplaints from "./pages/AdminComplaints";
import AdminAbout from "./pages/AdminAbout";

/* Layout component to conditionally render Navbar and Footer */
function Layout() {
  const location = useLocation();

  // Show navbar only on selected pages
  const showNavbarRoutes = [
    "/dashboard",
    "/about",
    "/help",
    "/feedback",
    "/complaint",
    "/user/home",
  ];
  const showNavbar = showNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<Complaint />} />

        <Route path="/user/home" element={<UserHome />} />

        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/about" element={<AdminAbout />} />
      </Routes>
      {showNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
