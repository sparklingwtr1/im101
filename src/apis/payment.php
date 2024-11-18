<?php
// payment.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // or specify the allowed origin
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");




// Get the JSON input from the request body
$input = json_decode(file_get_contents('php://input'), true);

// Check if input data is available
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'No input data provided']);
    exit;
}

// Database connection (configure your own credentials here)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "restaurant";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Extract data from the input
$customerId = $input['customerId'];
$totalAmount = $input['totalAmount'];
$orderDetails = $input['orderDetails'];
$billingDetails = $input['billingDetails'];
$paymentMethod = $input['paymentMethod'];

// Use transaction to ensure atomicity
$conn->begin_transaction();

try {
    // Insert data into `order` table
    $orderDate = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("INSERT INTO order_details (customer_id, order_date, total_price) VALUES (?, ?, ?)");
    $stmt->bind_param("isd", $customerId, $orderDate, $totalAmount);
    $stmt->execute();
    $orderId = $conn->insert_id;

    // Insert data into `order_item` table
    $stmt = $conn->prepare("INSERT INTO orderitems (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)");
    foreach ($orderDetails['items'] as $item) {
        $stmt->bind_param("isid", $orderId, $item['item_name'], $item['quantity'], $item['price']);
        $stmt->execute();
    }

    // Insert data into `billing` table
    $billingDate = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("INSERT INTO billing (order_id, customer_id, total_amount, date, address) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $orderId, $customerId, $totalAmount, $billingDate, $billingDetails['address']);
    $stmt->execute();
    $billingId = $conn->insert_id;

    // Insert data into `payment` table
    $paymentDate = date("Y-m-d H:i:s");
    $stmt = $conn->prepare("INSERT INTO payment (order_id, billing_id, customer_id, total_amount, date) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiids", $orderId, $billingId, $customerId, $totalAmount, $paymentDate);
    $stmt->execute();

    // Commit the transaction
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Payment processed successfully']);

} catch (Exception $e) {
    // Rollback transaction if an error occurs
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error processing payment: ' . $e->getMessage()]);
}

// Close connections
$stmt->close();
$conn->close();
?>
