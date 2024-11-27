import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const SalesReportManagement = () => {
  const [salesData, setSalesData] = useState([]);
  const [bestSellingItem, setBestSellingItem] = useState('');  // State for best-selling item

  useEffect(() => {
    // Fetch sales data from the API
    axios.get('http://sparklingwater1.helioho.st/get_sales_report.php')
      .then(response => setSalesData(response.data))
      .catch(error => console.error("There was an error fetching sales data:", error));

    // Fetch the best-selling item from the API
    axios.get('http://sparklingwater1.helioho.st/getBestSellingItem.php')
      .then(response => setBestSellingItem(response.data.best_selling_item))
      .catch(error => console.error("There was an error fetching the best-selling item:", error));
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: salesData.map(item => item.item_name), // item names as labels
    datasets: [
      {
        label: 'Sales Amount (₱)',
        data: salesData.map(item => item.total_sales), // total sales for each item
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate the total sales
  const totalSales = salesData.reduce((total, item) => total + parseFloat(item.total_sales), 0).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sales Report Management</h2>

      {/* Display the Best-Selling Item */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-2xl font-semibold">Best-Selling Item:</h3>
        <p className="text-xl">{bestSellingItem || 'No data available'}</p>
      </div>

      {/* Sales Data Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {salesData.length > 0 ? (
          <>
            <div className="chart-container mb-4">
              <Line data={chartData} options={{ responsive: true }} />
            </div>
            <div className="mt-4 text-xl font-semibold">
              <p>Total Sales: ₱{totalSales}</p>
            </div>
          </>
        ) : (
          <p>No sales data available</p>
        )}
      </div>
    </div>
  );
};

export default SalesReportManagement;
