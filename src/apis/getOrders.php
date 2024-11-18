<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$host = 'localhost';
$dbname = 'restaurant';
$username = '';
$password = '';

// Create database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get email from request
$data = json_decode(file_get_contents("php://input"), true);
$email = isset($data['email']) ? $conn->real_escape_string($data['email']) : null;

if (!$email) {
    die(json_encode(['message' => 'Error: Email is required']));
}

// Step 1: Get the customer ID from the Customers table using the email
$customerQuery = "SELECT id FROM users WHERE email = ?";
$customerStmt = $conn->prepare($customerQuery);
$customerStmt->bind_param("s", $email);
$customerStmt->execute();
$customerResult = $customerStmt->get_result();

if ($customerResult->num_rows === 0) {
    die(json_encode(['message' => 'Error: Customer not found']));
}

$customerRow = $customerResult->fetch_assoc();
$customerId = $customerRow['customer_id'];

// Step 2: Fetch order details using customer_id
$orderQuery = "
    SELECT
        od.customer_id,
        od.order_id,
        od.total_price,
        od.order_date,
        b.date AS date,
        p.payment_method,
        oi.item_name,
        oi.quantity,
        oi.status
    FROM Orderdetails od
    JOIN Payments p ON p.order_id = od.order_id
    JOIN order_items oi ON oi.order_id = od.order_id
    JOIN Billings b ON b.order_id = od.order_id
    WHERE od.customer_id = ?
";

$orderStmt = $conn->prepare($orderQuery);
$orderStmt->bind_param("i", $customerId);
$orderStmt->execute();
$orderResult = $orderStmt->get_result();

$orders = [];

while ($row = $orderResult->fetch_assoc()) {
    $orders[] = [
        'customer_id' => $row['customer_id'],
        'order_id' => $row['order_id'],
        'total_price' => $row['total_price'],
        'order_date' => $row['order_date'],
        'billing_date' => $row['date'],
        'payment_method' => $row['payment_method'],
        'item_name' => $row['item_name'],
        'quantity' => $row['quantity'],
    ];
}

// Output the orders in JSON format
echo json_encode($orders);

// Close statements and connection
$customerStmt->close();
$orderStmt->close();
$conn->close();
?>
