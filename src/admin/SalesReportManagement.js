import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const SalesReportManagement = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch sales data from the API
    axios.get('http://localhost/get_sales_report.php')
      .then(response => setSalesData(response.data))
      .catch(error => console.error("There was an error fetching sales data:", error));
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
    <div>
      <h2 className="text-2xl mb-4">Sales Report Management</h2>
      <p>Sales data based on completed items:</p>

      <div className="mt-4">
        {salesData.length > 0 ? (
          <>
            <Line data={chartData} options={{ responsive: true }} />
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
