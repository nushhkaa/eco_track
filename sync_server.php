<?php
/**
 * Eco-Tracks Nepal - Simple Sync Server
 * Receives CSV uploads and saves them to an "uploads" directory.
 */

// Allow CORS for local dev testing
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

// Ensure uploads directory exists
$uploadDir = __DIR__ . '/uploads';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create uploads directory."]);
        exit;
    }
}

$schoolName = isset($_POST['schoolName']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', $_POST['schoolName']) : 'Unknown_School';
$monthYear = isset($_POST['monthYear']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', $_POST['monthYear']) : date('Y_m');

if (!isset($_FILES['csvFile'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No CSV file uploaded."]);
    exit;
}

$file = $_FILES['csvFile'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "File upload error code: " . $file['error']]);
    exit;
}

// Build final filename
$timestamp = date('Ymd_His');
$filename = "{$schoolName}_{$monthYear}_{$timestamp}.csv";
$destPath = $uploadDir . '/' . $filename;

if (move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode([
        "status" => "success",
        "message" => "Data synced to headquarters successfully!",
        "filename" => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
}
?>
