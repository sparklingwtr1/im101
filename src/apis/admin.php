<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection details
$host = 'localhost';     // Replace with your MySQL server host
$db = 'restaurant';   // Replace with your database name
$user = 'root';          // Replace with your MySQL username
$pass = '';              // Replace with your MySQL password

// Connect to the MySQL database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}

// Process the login request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    $email = filter_var($input['employeeId'], FILTER_SANITIZE_EMAIL);
    $password = $input['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(["error" => "Email and password are required."]);
        exit();
    }

    // Check if email ends with the required domain
    if (!str_ends_with($email, '@pos.employee.nene')) {
        echo json_encode(["error" => "Email must end with @pos.employee.nene"]);
        exit();
    }

    // Query to check if the user exists and validate password
    $stmt = $pdo->prepare("SELECT * FROM employees WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if employee exists and password matches
    if ($employee && password_verify($password, $employee['password'])) {
        echo json_encode(["success" => true, "message" => "Login successful"]);
    } else {
        echo json_encode(["error" => "Invalid credentials. Please try again."]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>
