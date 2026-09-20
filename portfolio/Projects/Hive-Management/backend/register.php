<?php
// register.php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_id = (int) ($_POST['event_id'] ?? 0);
    $name     = trim($_POST['name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $phone    = trim($_POST['phone'] ?? '');

    if ($event_id <= 0 || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '') {
        header('Location: ../event-details.html?error=validation');
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO registrations (event_id, name, email, phone) VALUES (?, ?, ?, ?)');
    $stmt->execute([$event_id, $name, $email, $phone]);

    header('Location: ../event-details.html?success=registered');
    exit;
}
