<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Connect to the MySQL database
$host = 'localhost';
$db = 'restaurant';
$user = 'root';
$pass = '';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$order_id = $data['order_id'];
$status = $data['status'];

$sql = "UPDATE order_items SET status = ? WHERE order_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $order_id);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = "Order status updated successfully.";
} else {
    $response['success'] = false;
    $response['message'] = "Failed to update order status.";
}

header('Content-Type: application/json');
echo json_encode($response);

$stmt->close();
$conn->close();
?>
