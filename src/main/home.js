import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../main/header';

function HomePage() {
  return (
    <>
      <Header />

      <div>
        {/* Hero Section */}
        <section
          className="bg-cover bg-center h-screen relative"
          style={{
            backgroundImage: `url('https://source.unsplash.com/1600x900/?restaurant')`,
          }}
        >
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
          ></div>

          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white space-y-6 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold">
                Welcome to Our Restaurant POS System
              </h1>
              <p className="text-lg md:text-xl font-light">
                Efficiently manage orders, billing, and customer data with our easy-to-use system.
              </p>
              <Link to="/menu">
                <button className="mt-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-white font-semibold py-3 px-8 rounded-lg shadow-lg">
                  Explore Menu
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg p-8 text-center border-t-4 border-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Menu Management
                </h3>
                <p className="text-gray-600">
                  Quickly add, update, or remove items from the menu to keep up with restaurant changes.
                </p>
              </div>
              <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg p-8 text-center border-t-4 border-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Tracking
                </h3>
                <p className="text-gray-600">
                  Easily track orders from preparation to serving with real-time updates.
                </p>
              </div>
              <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg p-8 text-center border-t-4 border-gray-800">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Billing and Payment
                </h3>
                <p className="text-gray-600">
                  Process payments effortlessly with both online payment and cash on delivery options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10">
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base">
              &copy; 2024 Restaurant POS System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
