document.getElementById('paymentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const loader = document.getElementById("loader");
    const submitBtn = document.getElementById("submitBtn");
    // Show loader and disable button
    loader.style.display = "flex";
    submitBtn.disabled = true;
    let userEmail = document.getElementById('form_email').value; 
    const formData = {
        fullName: document.getElementById('form_name').value,
        phoneNumber: document.getElementById('form_phone').value,
        companyName: document.getElementById('form_company').value,
        country: document.getElementById('form_country').value,
        revenue: document.getElementById('form_revenue').value,
        numberOfEmployees: document.getElementById('form_employees').value,
        sector: "",
        subscription: "",
        adminName: "",
        authenticationType: "B2C Tenant",
        authenticatedDomains: [""],
        tenants: [""],
        enabledFeatures: ["CSRD"],
        userEmail: userEmail,
    };

    const stripe = Stripe('pk_test_51QvutSFSvUAvN8F3RDlD6HPoYVhEz3y9LzIFT9jlVrWRSjaDWgv8fanIi0FcxzpHJspEKmvppATvBG3hRwrucg7o001lLp8Zko');

    $.ajax({
        url: "https://ecoprismapi.azurewebsites.net/create-company-frontend",
        type: "POST",
        contentType: "application/json",
        dataType: "json",  // Ensures the response is parsed as JSON
        data: JSON.stringify(formData),
        success: function (response) {
            // Check if the response indicates success
            console.log(response.success);
            if (response && response.success === true) {
                // Proceed to the next API call since no company_id is needed
                $.ajax({
                    url: "https://ecoprismapi.azurewebsites.net/create-checkout-session",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(formData),
                    success: function (response1) {
                        if (response1 && response1.sessionUrl) { 
                            window.location.href = response1.sessionUrl;  // Redirect user to Stripe Checkout
                        } else {
                            // Hide loader and enable button
                            loader.style.display = "none";
                            submitBtn.disabled = false;
                            alert("Error: Unable to create payment session.");
                        }
                    },
                    error: function (xhr, status, error) {
                        // Hide loader and enable button
                        loader.style.display = "none";
                        submitBtn.disabled = false;
                        console.error("AJAX Error:", error);
                        alert("Failed to submit. Check the console for details.");
                    }
                });
            } else {
                // Hide loader and enable button
                loader.style.display = "none";
                submitBtn.disabled = false;
                alert("Company already registered with this email id.");
            }
        },
        error: function (xhr, status, error) {
            // Hide loader and enable button
            loader.style.display = "none";
            submitBtn.disabled = false;
            console.error("AJAX Error:", error);
            alert("Failed to submit. Check the console for details.");
        }
    });
});