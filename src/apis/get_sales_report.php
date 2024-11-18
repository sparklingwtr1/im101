<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$host = "localhost";
$db = "restaurant";
$user = "root";
$pass = "";

// Create database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if the connection is successful
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Query to fetch distinct item_name and total sales from order_items where the status is 'Completed'
$query = "
    SELECT 
        item_name,
        SUM(price) AS total_sales
    FROM order_items
    WHERE status = 'Completed'
    GROUP BY item_name
    ORDER BY total_sales DESC
";

// Execute the query
$result = $conn->query($query);

$salesData = [];
if ($result->num_rows > 0) {
    // Fetch data and store in the salesData array
    while ($row = $result->fetch_assoc()) {
        $salesData[] = [
            'item_name' => $row['item_name'],
            'total_sales' => $row['total_sales'],
        ];
    }
}

// Return the data as JSON
echo json_encode($salesData);

// Close the connection
$conn->close();
?>
