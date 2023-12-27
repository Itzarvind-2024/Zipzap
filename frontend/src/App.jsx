import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import OrderForm from "./components/OrderForm";
import Login from "./components/Login";
import DarkStore from "./components/DarkStore";
import StoreOperations from "./components/StoreOperations";
import StoreDashboard from "./components/StoreDashboard";

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/store-dashboard" element={<StoreDashboard />} />
            <Route path="/darkstore" element={<DarkStore />} />
            <Route path="/storeoperations" element={<StoreOperations />} />
          </Routes>        
      </Router>
    </>
  );
}

export default App;
