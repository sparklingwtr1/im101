import logo from '../image/zorbox.png';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../modal/LoginModal';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  // Retrieve email from local storage
  const storedEmail = localStorage.getItem('userEmail'); 

  const fetchUsernameFromBackend = useCallback(async () => {
    if (storedEmail) {
      try {
        console.log('Stored email:', storedEmail);

        const response = await fetch('http://sparklingwater1.helioho.st/getUser.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: storedEmail }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received from backend:', data);
        
        if (data.username) {
          setUsername(data.username);
          setError(null);
        } else {
          setError(data.message || 'No user found');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setError('Failed to fetch username.');
      }
    } else {
      setUsername(null);
    }
  }, [storedEmail]);

  useEffect(() => {
    fetchUsernameFromBackend();
  }, [fetchUsernameFromBackend]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleSettingsClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUsername(null);
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold">
            <a href="/">
              <img src={logo} alt="Logo" className="h-10" />
            </a>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="text-xl hover:text-gray-300">Home</a>
              </li>
              <li>
                <a href="/menu" className="text-xl hover:text-gray-300">Menu</a>
              </li>
              <li>
                <a href="/service" className="text-xl hover:text-gray-300">Services</a>
              </li>
              {username ? (
                <li className="relative dropdown">
                  <button
                    onClick={toggleDropdown}
                    className="text-xl hover:text-gray-300 relative"
                  >
                    {username}
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 py-2 w-48 bg-white text-gray-800 rounded shadow-lg">
                      <li>
                        <button
                          onClick={handleSettingsClick}
                          className="block px-4 py-2 text-lg hover:bg-gray-200 w-full text-left"
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-lg hover:bg-gray-200 w-full text-left"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li>
                  <button
                    onClick={openModal}
                    className="text-xl hover:text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-white"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isModalOpen} onClose={closeModal} />

      {error && (
        <div className="bg-red-500 text-white p-4">
          <p>{error}</p>
        </div>
      )}
    </>
  );
};

export default Header;
