import { Routes, Route } from "react-router-dom";
import { Home, Features, Pricing, Contact, SignUp, Otp, Login, ForgotPassword, ResetOtp, ChangePassword, OrganisationSetup, Dashboard } from "./pages";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-otp" element={<ResetOtp />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route path="/organisation-setup" element={<OrganisationSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />




    </Routes>
  );
}

export default App;

