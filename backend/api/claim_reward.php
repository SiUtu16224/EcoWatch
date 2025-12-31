<?php
header("Content-Type: application/json");
require_once "../config/database.php";

/* contoh auth sederhana (sesuaikan dgn sistem login kamu) */
$user_id   = $_POST["user_id"] ?? null;
$reward_id = $_POST["reward_id"] ?? null;

if (!$user_id || !$reward_id) {
  http_response_code(400);
  echo json_encode(["message" => "Data tidak lengkap"]);
  exit;
}

/* ambil user */
$user = $conn->query("SELECT points FROM users WHERE id=$user_id")->fetch_assoc();

/* ambil reward */
$reward = $conn->query("SELECT points_required, stock FROM rewards WHERE id=$reward_id")->fetch_assoc();

if (!$user || !$reward) {
  http_response_code(404);
  echo json_encode(["message" => "User atau reward tidak ditemukan"]);
  exit;
}

if ($user["points"] < $reward["points_required"]) {
  http_response_code(403);
  echo json_encode(["message" => "Poin tidak cukup"]);
  exit;
}

if ($reward["stock"] <= 0) {
  http_response_code(403);
  echo json_encode(["message" => "Reward habis"]);
  exit;
}

/* transaksi */
$conn->begin_transaction();

$conn->query("
  UPDATE users 
  SET points = points - {$reward["points_required"]} 
  WHERE id=$user_id
");

$conn->query("
  UPDATE rewards 
  SET stock = stock - 1 
  WHERE id=$reward_id
");

$conn->query("
  INSERT INTO reward_claims (user_id, reward_id) 
  VALUES ($user_id, $reward_id)
");

$conn->commit();

echo json_encode(["message" => "Reward berhasil ditukarkan 🎉"]);
