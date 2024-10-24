<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");


// Database connection details
$host = 'localhost';
$dbname = 'restaurant';
$username = '';
$password = '';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the payment data from the request
$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    error_log('Received invalid JSON data');
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}
// Log received data for debugging
error_log(print_r($data, true));

// Make sure you are accessing the correct keys
$customerId = isset($data['customerId']) ? $data['customerId'] : null;
$orderDetails = isset($data['orderDetails']) ? $data['orderDetails'] : null;
$billingDetails = isset($data['billingDetails']) ? $data['billingDetails'] : null;
$paymentMethod = isset($data['paymentMethod']) ? $data['paymentMethod'] : null;

if (!$customerId || !$orderDetails || !$billingDetails || !$paymentMethod) {
    error_log('Missing required payment data');
    echo json_encode(['success' => false, 'message' => 'Missing required payment data']);
    exit;
}

// Start a transaction
$conn->begin_transaction();

try {
    // Insert into orders table
    $orderSql = "INSERT INTO orders (customer_id, order_date, total_price) VALUES (?, NOW(), ?)";
    $stmt = $conn->prepare($orderSql);
    $stmt->bind_param("id", $customerId, $totalAmount);
    $stmt->execute();
    $orderId = $stmt->insert_id;

    // Insert into billing table
    $billingSql = "INSERT INTO billing (order_id, customer_id, total_amount, date) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($billingSql);
    $stmt->bind_param("iid", $orderId, $customerId, $totalAmount);
    $stmt->execute();
    $billingId = $stmt->insert_id;

    // Insert into payment table
    $paymentSql = "INSERT INTO payment (order_id, billing_id, customer_id, total_amount, date, mode_of_payment) VALUES (?, ?, ?, ?, NOW(), ?)";
    $stmt = $conn->prepare($paymentSql);
    $stmt->bind_param("iiids", $orderId, $billingId, $customerId, $totalAmount, $paymentMethod);
    $stmt->execute();

    // Insert each ordered item into order_items table
    foreach ($orderDetails['items'] as $item) {
        $itemId = $conn->real_escape_string($item['item_id']);
        $quantity = $conn->real_escape_string($item['quantity']);
        $price = $conn->real_escape_string($item['price']);

        $itemSql = "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($itemSql);
        $stmt->bind_param("iiid", $orderId, $itemId, $quantity, $price);
        $stmt->execute();
    }

    // Commit the transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Payment processed successfully']);
} catch (Exception $e) {
    // Rollback the transaction if any error occurs
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error processing payment: ' . $e->getMessage()]);
}

// Close the connection
$conn->close();
?>
