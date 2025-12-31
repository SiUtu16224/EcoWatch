<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../config/db.php"; // sesuaikan path

$result = mysqli_query($conn, "
    SELECT 
        COUNT(*) AS total,
        SUM(status = 'verified') AS verified,
        SUM(status = 'pending') AS pending
    FROM reports
");

$data = mysqli_fetch_assoc($result);

echo json_encode([
    "total" => (int)$data['total'],
    "verified" => (int)$data['verified'],
    "pending" => (int)$data['pending'],
    "reward" => 3 // sementara / nanti bisa dihitung juga
]);
