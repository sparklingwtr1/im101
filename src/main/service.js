import React from 'react';
import Header from '../main/header';
const ServicePage = () => {
    return (
        <>
        <Header/>
        
        <div className="max-w-7xl mx-auto p-6">
            {/* Header Section */}
            <header className="text-center py-12 bg-gray-100">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
                <p className="text-lg text-gray-600">Experience the best of our restaurant with a variety of services tailored for you!</p>
            </header>

            {/* Dining Section */}
            <section className="my-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">In-Restaurant Dining</h2>
                <p className="text-lg text-gray-700">
                    Enjoy a cozy and welcoming atmosphere at our restaurant. Whether you're dining solo, with family, or friends, our staff will make sure you have a wonderful experience.
                </p>
            </section>

            {/* Delivery Section */}
            <section className="my-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Home Delivery</h2>
                <p className="text-lg text-gray-700">
                    Craving your favorite dish but don't feel like leaving the house? We got you covered! 
                    Our fast and reliable delivery service will bring your food right to your doorstep. 
                    Simply place an order online or through our app!
                </p>
            </section>

            {/* Catering Services */}
            <section className="my-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Catering</h2>
                <p className="text-lg text-gray-700">
                    Hosting an event? Let us handle the food! Our catering service offers a variety of menu options to suit any occasion. 
                    Whether it’s a corporate event, wedding, or birthday party, we’ll make it a delicious experience!
                </p>
            </section>

            {/* Special Offers */}
            <section className="my-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Special Offers</h2>
                <p className="text-lg text-gray-700">
                    Check out our latest promotions and discounts! We regularly update our special offers to give you the best value for your money. Stay tuned for more!
                </p>
            </section>

            {/* Contact for Catering */}
            <section className="bg-gray-50 p-8 rounded-lg my-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Contact Us for Catering</h2>
                <p className="text-lg text-gray-700 mb-2">For inquiries about our catering service, reach out to us at:</p>
                <p className="text-lg text-gray-700">Email: <a href="mailto:catering@yourrestaurant.com" className="text-blue-500">catering@yourrestaurant.com</a></p>
                <p className="text-lg text-gray-700">Phone: <a href="tel:+1234567890" className="text-blue-500">(123) 456-7890</a></p>
            </section>
        </div>
    </>
    );
};

export default ServicePage;
