<?php
// branch-events-store.php
require 'config.php';

if (!isset($_SESSION['branch_id'])) {
    header('Location: ../branch-login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $branch_id   = $_SESSION['branch_id'];
    $title       = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $date        = $_POST['date'] ?? '';
    $time        = $_POST['time'] ?? '';
    $venue       = trim($_POST['venue'] ?? '');

    if ($title === '' || $description === '' || $date === '' || $time === '' || $venue === '') {
        header('Location: ../branch-dashboard.html?error=event_validation');
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO events (branch_id, title, description, date, time, venue) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$branch_id, $title, $description, $date, $time, $venue]);

    header('Location: ../branch-dashboard.html?success=event_created');
    exit;
}
