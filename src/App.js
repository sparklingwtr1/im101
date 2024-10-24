import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Customers from './main/customers';
import Menu from './main/menu';
import Billing from './main/billing';
import Payment from './main/payment';
import Home from './main/home';
import Service from './main/service';
import Dashboard from './users/dashboard';
import Admin from './admin/adminDashboard';
import Employee from './employee/employee';
import EDash from './employee/EmployeeDashboard';





function App() {



  
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/billing" element={<Billing />} /> 
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/service" element={<Service />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee-dashboard" element={<EDash />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;