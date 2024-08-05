import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage";
import LoginPage from "./Components/loginPage/LoginPage";
import Signup from "./Components/SignupPage/Signup.js";
import Dashboard from "./Components/DashboardComponents/Dashboard/Dashboard";
import Contactus from "./Components/ContactUs/Contactus";
import Payment from "./Components/PaymentPage/Payment.js";
import ContactusTable from "./Components/DashboardComponents/Contactus-Table/Contactus-Table";
import Profile from "./Components/DashboardComponents/Profile/Profile.js"
import Message from "./Components/DashboardComponents/Message/Message";
import CustomersTable from "./Components/DashboardComponents/Cutomers-Table/Cutomers-Table";
import HeatMap from "./Components/DashboardComponents/HeatMap/HeatMap";
import HeatMapRawView from "./Components/DashboardComponents/HeatMap/HeatMapRawView/HeatMapRawView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/login" exact element={<LoginPage />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/dashboard" exact element={<Dashboard />}>
            <Route path="customers" element={<CustomersTable/>} />
            <Route path="contactus" element={<ContactusTable/>} />
            <Route path="profile" element={<Profile/>} />
            <Route path="message" element={<Message/>} />
            <Route path="heatmap" element={<HeatMap/>} />
          </Route>
          <Route path="/contactus" exact element={<Contactus />} />
          <Route path="/payment" exact element={<Payment />} />
          <Route path="/rawview" exact element={<HeatMapRawView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
