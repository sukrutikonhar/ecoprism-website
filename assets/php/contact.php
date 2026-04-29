<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the name, email, and message from the form
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Send the email
    $to = 'sukruti.konhar@acumant.com';
    $subject = 'New message from contact form';
    $body = "Name: $name\nEmail: $email\nMessage: $message";

    if (mail($to, $subject, $body)) {
        // The email was sent successfully
        echo "Your message has been sent successfully!";
    } else {
        // The email was not sent successfully
        echo "There was an error sending your message. Please try again later.";
    }
}
?>
