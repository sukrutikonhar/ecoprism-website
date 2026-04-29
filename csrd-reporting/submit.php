<?php
// API endpoint to store company data
$api_url = "https://ecoprismapiapi.azure-api.net/Entity/SaveParentEntitiesPaymentMode";
print_r($_POST);
// Get form data
$company_name = $_POST['company_name'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// Call API to store company data
$data = [
    "company_name" => $company_name,
    "email" => $email,
    "phone" => $phone,
    "payment_status" => false
];

$options = [
    "http" => [
        "header"  => "Content-Type: application/json",
        "method"  => "POST",
        "content" => json_encode($data),
    ]
];

// $context  = stream_context_create($options);
// $response = file_get_contents($api_url, false, $context);
// $result = json_decode($response, true);

// if (!$result || !isset($result['company_id'])) {
//     die("Error storing data.");
// }

// $company_id = $result['company_id'];  // Get company ID from API response

// // Redirect to Stripe payment link with company_id in return URL
// $payment_url = "https://buy.stripe.com/test_aEUaHWaC6aSHaRi6oo";
// $success_url = "https://yourdomain.com/success.php?company_id=$company_id";

// header("Location: $payment_url?redirect_url=" . urlencode($success_url));
exit();
?>
