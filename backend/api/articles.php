<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "../config/cors.php";
include "../config/db.php";

$category = $_GET['category'] ?? '';
$search = $_GET['search'] ?? '';

$sql = "SELECT articles.*, categories.name AS category 
        FROM articles
        JOIN categories ON articles.category_id = categories.id
        WHERE 1";

if ($category && $category !== "Semua") {
    $sql .= " AND categories.name='$category'";
}

if ($search) {
    $sql .= " AND articles.title LIKE '%$search%'";
}

$data = $conn->query($sql);
echo json_encode($data->fetch_all(MYSQLI_ASSOC));
