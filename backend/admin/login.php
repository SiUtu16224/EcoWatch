<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "../config/db.php";
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
  http_response_code(400);
  echo json_encode(["message" => "Data kosong"]);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password'])) {
  http_response_code(401);
  echo json_encode(["message" => "Login gagal"]);
  exit;
}

$_SESSION['admin'] = $admin['id'];

echo json_encode([
  "id" => $admin['id'],
  "username" => $admin['username']
]);
