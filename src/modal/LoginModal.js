import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




const FlipCardModal = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone_number, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();





  useEffect(() => {
    const savedEmail = localStorage.getItem('customerEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const saveEmailToLocalStorage = (userEmail) => {
    localStorage.setItem('userEmail', userEmail);
  };

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Default admin credentials
    const adminEmail = 'kelvin@pos.nene';
    const adminPassword = 'admin123'; // You can change this to a more secure password
  
    // Check if the email contains the admin domain
    if (email.endsWith('@pos.nene')) {
      if (email === adminEmail && password === adminPassword) {
        // Navigate to admin dashboard
        navigate('/admin'); // Replace with your admin dashboard route
        onClose();
      } else {
        setError('Invalid admin credentials');
        setLoading(false);
        return;
      }
    } else {
      // Proceed with normal user login
      try {
        const response = await fetch('http://localhost/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (data.message === 'Login successful') {
          saveEmailToLocalStorage(data.email);
          const orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
          const totalAmount = localStorage.getItem('totalAmount') || 0;
          navigate('/dashboard', { state: { orderItems, totalAmount } });
          onClose();
        } else {  
          setError(data.message);
        }
      } catch (error) {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!phone_number || isNaN(phone_number)) {
      setError("Please provide a valid phone number.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
          phone_number,
          fname,
          lname,
        }),
      });
  

      const data = await response.json();
      console.log(data); // Log response for debugging

      if (data.message === 'Account created successfully') {
        saveEmailToLocalStorage(email);
        navigate('/dashboard');
        onClose();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Account creation failed');
    } finally {
      setLoading(false);
    }
};


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
          <div
            className="flip-card bg-white p-8 rounded-lg shadow-lg z-10 w-full max-w-lg"
            style={{ height: '500px', width: '420px' }} // Adjusted height
          >
            <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
              <div className="flip-card-front">
                <h1 className="text-2xl font-bold mb-2 text-center">Log In</h1>

                <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
                  <div className="mb-6 w-full">
                    <label htmlFor="email" className="block text-gray-700">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6 w-full">
                    <label htmlFor="password" className="block text-gray-700">
                      Password:
                    </label>
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

                <div className="text-center mt-6">
                  <p className="text-gray-500">
                    Don't have an account?{' '}
                    <span
                      className="text-blue-500 cursor-pointer underline"
                      onClick={() => setIsFlipped(true)}
                    >
                      Sign Up
                    </span>
                  </p>
                </div>
              </div>

              <div className="flip-card-back">
                <h1 className="text-2xl font-bold mb-2 text-center">Sign Up</h1>

                <form onSubmit={handleSignup} className="flex flex-col items-center w-full">
                  <div className="grid grid-cols-2 gap-4 mb-6 w-full">
                    <div>
                      <label htmlFor="signup-email" className="block text-gray-700">Email:</label>
                      <input
                        type="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="username" className="block text-gray-700">Username:</label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="firstname" className="block text-gray-700">First Name:</label>
                      <input
                        type="text"
                        id="firstname"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastname" className="block text-gray-700">Last Name:</label>
                      <input
                        type="text"
                        id="lastname"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-gray-700">Phone Number:</label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone_number}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-gray-700">Password:</label>
                      <input
                        type="password"
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
                    >
                      Sign Up
                    </button>
                  )}
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-500">
                    Already have an account?{' '}
                    <span
                      className="text-blue-500 cursor-pointer underline"
                      onClick={() => setIsFlipped(false)}
                    >
                      Log In
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{
        `
          .flip-card {
            width: 100%; 
            max-width: 600px; 
            height: 60%; /* Reduced the height */
            position: relative;
            perspective: 1000px;
            overflow: hidden; 
            margin: 0 auto;
          }
      
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 50%;
            transform-style: preserve-3d;
            transition: transform 0.6s;
          }
      
          .flip-card-inner.flipped {
            transform: rotateY(180deg);
          }
      
          .flip-card-front,
          .flip-card-back {
            position: absolute;
            width: 100%;
            height: 50%;
            backface-visibility: hidden;
          }
      
          .flip-card-back {
            transform: rotateY(180deg);
          }
      
          /* Spinner Styles */
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #007bff;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            margin: 0 auto;
            animation: spin 1s ease infinite;
          }
      
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `
      }</style> 
    </>
  );
};

export default FlipCardModal;
