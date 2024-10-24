import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  // State for form inputs
  const [employee, setEmployee] = useState({
    fname: '',
    lname: '',
    phone_number: '',
    email: '',
    password: '', // Added password field
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [employees, setEmployees] = useState([]); // State for storing the list of employees

  // Load employees from localStorage when the component mounts
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(storedEmployees);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format and password length
    if (!employee.email.endsWith('@pos.employee.nene')) {
      setErrorMessage('Email must end with @pos.employee.nene');
      return;
    }

    if (employee.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    // Reset error message
    setErrorMessage('');

    try {
      const response = await fetch('https://sparklingwater1.helioho.st/createEmployee.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              fname: employee.fname,
              lname: employee.lname,
              phone_number: employee.phone_number,
              email: employee.email,
          }),
      });

      const data = await response.json();

      if (!response.ok) {
          console.error("Fetch error:", data);
          setErrorMessage(data.message);
          return;
      }

      if (data.status === 'success') {
          // Update local storage and reset the form
          const updatedEmployees = [...employees, employee];
          localStorage.setItem('employees', JSON.stringify(updatedEmployees));
          setEmployees(updatedEmployees);
          setEmployee({
            fname: '',
            lname: '',
            phone_number: '',
            email: '',
            password: '',
          }); // Clear the form inputs
      } else {
          setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('An error occurred while adding the employee.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Employee Management</h2>

      {/* Employee Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="fname"
            value={employee.fname}
            onChange={handleInputChange}
            required
            className="block w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lname"
            value={employee.lname}
            onChange={handleInputChange}
            required
            className="block w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={employee.phone_number}
            onChange={handleInputChange}
            className="block w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleInputChange}
            required
            className="block w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleInputChange}
            required
            className="block w-full border border-gray-400 p-2 rounded"
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </form>

      {/* Display Employee List */}
      <div className="mt-8">
        <h3 className="text-xl mb-4">List of Employees</h3>
        {employees.length === 0 ? (
          <p>No employees added yet.</p>
        ) : (
          <ul className="space-y-4">
            {employees.map((emp, index) => (
              <li key={index} className="border p-4 rounded-md shadow">
                <p><strong>First Name:</strong> {emp.fname}</p>
                <p><strong>Last Name:</strong> {emp.lname}</p>
                <p><strong>Phone Number:</strong> {emp.phone_number}</p>
                <p><strong>Email:</strong> {emp.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
