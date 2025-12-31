<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php"; // pastikan path ini BENAR

// Ambil JSON dari body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Debug kalau mau cek
// file_put_contents("debug.txt", $raw);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        "message" => "Email atau password kosong"
    ]);
    exit;
}

// Cari user berdasarkan email
$stmt = $conn->prepare("SELECT id, name, email, password, reward FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        "message" => "Email atau password salah"
    ]);
    exit;
}

// LOGIN BERHASIL
echo json_encode([
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email'],
    "reward" => $user['reward']
]);
