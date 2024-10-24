import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../main/header';




function HomePage() {
  return (
    <>
    <Header />



    <div>
      {/* Navbar */}
    

      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?restaurant')` }}>
        <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl font-bold">Welcome to Our Restaurant POS System</h1>
            <p className="text-xl">Efficiently manage orders, billing, and customer data with our easy-to-use system.</p>
            <Link to="/menu">
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                Explore Menu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Menu Management</h3>
              <p>Quickly add, update, or remove items from the menu to keep up with restaurant changes.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Order Tracking</h3>
              <p>Easily track orders from preparation to serving with real-time updates.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Billing and Payment</h3>
              <p>Process payments effortlessly with both online payment and cash on delivery options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Restaurant POS System. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}

export default HomePage;
