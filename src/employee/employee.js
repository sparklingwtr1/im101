import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeLoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the email follows the required format
    if (!employeeId.endsWith('@pos.employee.nene')) {
      setError('Email must end with @pos.employee.nene');
      setLoading(false);
      return;
    }

    // Simulating employee credential validation
    try {
      const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
      const employee = storedEmployees.find(emp => emp.email === employeeId && emp.password === password);
      
      if (employee) {
        // Redirect to employee dashboard
        navigate('/employee-dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Employee Log In</h1>
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-gray-700">Email:</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600"
            >
              Log In
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
