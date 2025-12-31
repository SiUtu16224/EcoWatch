<?php
header("Content-Type: application/json");
require_once "../config/db.php";

$sql = "SELECT id, title, description, points_required, image, stock 
        FROM rewards 
        WHERE stock > 0
        ORDER BY points_required ASC";

$result = $conn->query($sql);

$rewards = [];

while ($row = $result->fetch_assoc()) {
  $rewards[] = $row;
}

echo json_encode($rewards);
