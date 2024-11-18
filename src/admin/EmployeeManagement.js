import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [employee, setEmployee] = useState({
    fname: '',
    lname: '',
    phone_number: '',
    email: '',
    password: '',
    branch_name: '', // Use branch_name instead of branch_id
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]); // State for storing branches

  // Load employees from localStorage and fetch branches when component mounts
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(storedEmployees);

    // Fetch branches
    fetch('http://localhost/getBranches.php')
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error('Error fetching branches:', error));
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
  
    setErrorMessage('');
  
    // Log the data that is being sent to the backend
    console.log('Submitting employee data:', {
      fname: employee.fname,
      lname: employee.lname,
      phone_number: employee.phone_number,
      email: employee.email,
      branch_name: employee.branch_name, // Send branch_name instead of branch_id
      password: employee.password,
    });
  
    try {
      const response = await fetch('http://localhost/createEmployee.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: employee.fname,
          lname: employee.lname,
          phone_number: employee.phone_number,
          email: employee.email,
          branch_name: employee.branch_name, // Send branch_name instead of branch_id
          password: employee.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }
  
      if (data.status === 'success') {
        const updatedEmployees = [...employees, employee];
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        setEmployees(updatedEmployees);
        setEmployee({
          fname: '',
          lname: '',
          phone_number: '',
          email: '',
          password: '',
          branch_name: '', // Reset branch selection
        });
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the employee.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Employee Management</h2>

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
        <div>
          <label>Branch:</label>
          <select
  name="branch_name"
  value={employee.branch_name}
  onChange={handleInputChange}
  required
  className="block w-full border border-gray-400 p-2 rounded"
>
  <option value="">Select a branch</option>
  {branches.map((branch) => (
    <option key={branch.id} value={branch.name}>  {/* Ensure unique "key" here */}
      {branch.name}
    </option>
  ))}
</select>

        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </form>

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
                <p><strong>Branch:</strong> {emp.branch_name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
