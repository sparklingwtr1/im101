import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../main/header';

// Import images
import coffeeShopImage from '../image/z1.jpg';
import baristaImage from '../image/z2.jpg';
import restaurantImage from '../image/z3.jpg';
import coffeeTableImage from '../image/z4.jpg';
import coffeeTableImages from '../image/z5.jpg';


function HomePage() {
  // Array of imported background images
  const images = [
    coffeeShopImage,
    baristaImage,
    restaurantImage,
    coffeeTableImage,
    coffeeTableImages
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Set up the interval to change the background image
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <div>
        {/* Hero Section with Background Slideshow */}
        <section
          className="bg-cover bg-center h-screen"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
          }}
        >
          <div className="bg-black bg-opacity-60 h-full flex items-center justify-center">
            <div className="text-center text-white space-y-6 px-4">
              <h1 className="text-6xl font-extrabold">Welcome to Zorbox Cafe</h1>
              <p className="text-xl mt-4">
                Experience the perfect blend of coffee, comfort, and community. Dive into a
                seamless cafe management experience.
              </p>
              <Link to="/menu">
                <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg">
                  Explore Our Menu
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              What Makes Zorbox Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                  Cafe Management
                </h3>
                <p className="text-gray-600">
                  Keep your menu, orders, and customers in sync with our user-friendly
                  interface.
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Real-Time Orders</h3>
                <p className="text-gray-600">
                  Easily track customer orders and preparation times, ensuring top-notch
                  service.
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Payments Simplified</h3>
                <p className="text-gray-600">
                  Process payments quickly with multiple payment methods, including card and
                  cash.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cafe Highlights */}
        <section className="py-16 bg-yellow-500 text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Our Promise to You</h2>
            <div className="flex flex-wrap justify-center">
              <div className="max-w-md mx-4 my-4">
                <h3 className="text-2xl font-semibold mb-2">Freshly Brewed Every Day</h3>
                <p>
                  From our signature espresso to custom blends, we bring the best coffee to your
                  table.
                </p>
              </div>
              <div className="max-w-md mx-4 my-4">
                <h3 className="text-2xl font-semibold mb-2">Cozy & Inviting Ambience</h3>
                <p>
                  Whether you're working, catching up, or just relaxing, Zorbox Cafe is your
                  happy place.
                </p>
              </div>
              <div className="max-w-md mx-4 my-4">
                <h3 className="text-2xl font-semibold mb-2">Community Focused</h3>
                <p>
                  Join our events, meet like-minded people, and be part of the Zorbox community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto text-center">
            <p className="text-lg font-semibold">Zorbox Cafe &copy; 2024</p>
            <p>Your favorite destination for coffee and connections.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
