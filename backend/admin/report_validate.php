<?php
require_once "auth_check.php";
require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

$pdo->prepare("
  UPDATE reports 
  SET status='approved' 
  WHERE id=?
")->execute([$id]);

echo json_encode(["success" => true]);
