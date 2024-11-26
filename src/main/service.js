import React from 'react';
import Header from '../main/header';

const ServicePage = () => {
    return (
        <>
        <Header/>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-gray-50">
            {/* Header Section */}
            <header className="text-center py-16 bg-gradient-to-br from-gray-200 to-gray-50 shadow-lg rounded-lg mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Our Services</h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    Discover a range of services crafted to enhance your dining experience, whether you're with us or at home.
                </p>
            </header>

            {/* Section Template */}
            <div className="space-y-16">
                {/* Dining Section */}
                <section className="border-l-4 border-gray-600 pl-6">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">In-Restaurant Dining</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Enjoy a cozy and welcoming atmosphere at our restaurant. Whether you're dining solo, with family, or friends, our staff will make sure you have a wonderful experience.
                    </p>
                </section>

                {/* Delivery Section */}
                <section className="border-l-4 border-gray-600 pl-6">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">Home Delivery</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Craving your favorite dish but don't feel like leaving the house? We got you covered! Our fast and reliable delivery service will bring your food right to your doorstep. Simply place an order online or through our app!
                    </p>
                </section>

                {/* Catering Services */}
                <section className="border-l-4 border-gray-600 pl-6">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">Catering</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Hosting an event? Let us handle the food! Our catering service offers a variety of menu options to suit any occasion. Whether it’s a corporate event, wedding, or birthday party, we’ll make it a delicious experience!
                    </p>
                </section>

                {/* Special Offers */}
                <section className="border-l-4 border-gray-600 pl-6">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">Special Offers</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Check out our latest promotions and discounts! We regularly update our special offers to give you the best value for your money. Stay tuned for more!
                    </p>
                </section>

                {/* Contact for Catering */}
                <section className="bg-gradient-to-br from-gray-50 to-gray-200 p-8 rounded-lg shadow-md border border-gray-300">
                    <h2 className="text-4xl font-semibold text-gray-800 mb-4">Contact Us for Catering</h2>
                    <p className="text-lg text-gray-700 mb-4">For inquiries about our catering service, reach out to us at:</p>
                    <div className="space-y-2">
                        <p className="text-lg text-gray-700">
                            Email: <a href="mailto:catering@yourrestaurant.com" className="text-gray-800 hover:underline">catering@yourrestaurant.com</a>
                        </p>
                        <p className="text-lg text-gray-700">
                            Phone: <a href="tel:+1234567890" className="text-gray-800 hover:underline">(123) 456-7890</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
        </>
    );
};

export default ServicePage;
