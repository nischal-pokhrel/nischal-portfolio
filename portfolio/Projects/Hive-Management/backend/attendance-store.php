<?php
// attendance-store.php
require 'config.php';

if (!isset($_SESSION['branch_id'])) {
    header('Location: ../branch-login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_id = (int) ($_POST['event_id'] ?? 0);
    if ($event_id <= 0) {
        header('Location: ../branch-dashboard.html?error=attendance_event');
        exit;
    }

    $attendance = $_POST['attendance'] ?? []; // array reg_id => "present"

    // Clear previous attendance
    $pdo->prepare('DELETE FROM attendance WHERE event_id = ?')->execute([$event_id]);

    foreach ($attendance as $registration_id => $value) {
        $reg_id = (int) $registration_id;
        if ($reg_id > 0) {
            $stmt = $pdo->prepare('INSERT INTO attendance (event_id, registration_id, present) VALUES (?, ?, 1)');
            $stmt->execute([$event_id, $reg_id]);
        }
    }

    header('Location: ../branch-dashboard.html?success=attendance_saved');
    exit;
}
