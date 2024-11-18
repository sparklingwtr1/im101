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

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Fetch order details, items, and payment information
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = [];

    // Get order details
    $orderDetailsStmt = $pdo->query("SELECT * FROM orderdetails");
    $data['orderdetails'] = $orderDetailsStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get order items
    $orderItemsStmt = $pdo->query("SELECT * FROM order_items");
    $data['order_items'] = $orderItemsStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get payment details
    $paymentStmt = $pdo->query("SELECT * FROM payment");
    $data['payment'] = $paymentStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
    exit();
}

// Delete an employee by ID
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $employeeId = $_DELETE['employee_id'];

    if (!empty($employeeId)) {
        $stmt = $pdo->prepare("DELETE FROM employees WHERE employee_id = :employee_id");
        $stmt->bindParam(':employee_id', $employeeId, PDO::PARAM_INT);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Employee deleted successfully."]);
        } else {
            echo json_encode(["error" => "Failed to delete employee."]);
        }
    } else {
        echo json_encode(["error" => "Employee ID is required."]);
    }
    exit();
}

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit();
}
?>
