<?php
/**
 * Contact Form REST API Endpoint
 * Handles contact form submissions and sends emails to staff
 */

if (!defined('ABSPATH')) exit;

/**
 * Register contact form REST API endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('wpyvr/v1', '/contact', [
        'methods' => 'POST',
        'callback' => 'wpyvr_handle_contact_form',
        'permission_callback' => '__return_true', // Public endpoint
        'args' => [
            'name' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'email' => [
                'required' => true,
                'type' => 'string',
                'validate_callback' => function($value) {
                    return is_email($value);
                },
                'sanitize_callback' => 'sanitize_email',
            ],
            'phone' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'preferred_contact' => [
                'required' => false,
                'type' => 'string',
                'enum' => ['email', 'phone'],
                'default' => 'email',
            ],
            'subject' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'message' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ],
        ],
    ]);
});

/**
 * Handle contact form submission
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function wpyvr_handle_contact_form($request) {
    // Get sanitized parameters
    $name = $request->get_param('name');
    $email = $request->get_param('email');
    $phone = $request->get_param('phone');
    $preferred_contact = $request->get_param('preferred_contact');
    $subject = $request->get_param('subject');
    $message = $request->get_param('message');

    // Additional validation
    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error(
            'missing_fields',
            'Required fields are missing.',
            ['status' => 400]
        );
    }

    if (!is_email($email)) {
        return new WP_Error(
            'invalid_email',
            'Invalid email address.',
            ['status' => 400]
        );
    }

    // Get all Editor and Administrator users
    $staff_users = get_users([
        'role__in' => ['editor', 'administrator'],
        'fields' => ['user_email', 'display_name'],
    ]);

    if (empty($staff_users)) {
        return new WP_Error(
            'no_recipients',
            'No staff members found to send the email to.',
            ['status' => 500]
        );
    }

    // Prepare email recipients
    $recipients = [];
    foreach ($staff_users as $user) {
        if (!empty($user->user_email)) {
            $recipients[] = $user->user_email;
        }
    }

    if (empty($recipients)) {
        return new WP_Error(
            'no_recipients',
            'No valid staff email addresses found.',
            ['status' => 500]
        );
    }

    // Prepare email subject
    $email_subject = '[WPYVR Contact Form] ';
    if (!empty($subject)) {
        $email_subject .= sanitize_text_field($subject);
    } else {
        $email_subject .= 'New Contact Form Submission';
    }

    // Prepare email body
    $email_body = "New contact form submission received:\n\n";
    $email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    
    if (!empty($phone)) {
        $email_body .= "Phone: " . $phone . "\n";
    }
    
    if (!empty($preferred_contact)) {
        $preferred_label = $preferred_contact === 'email' ? 'Email' : 'Phone';
        $email_body .= "Preferred Contact Method: " . $preferred_label . "\n";
    }
    
    if (!empty($subject)) {
        $email_body .= "Subject: " . $subject . "\n";
    }
    
    $email_body .= "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body .= "Message:\n\n" . $message . "\n\n";
    $email_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body .= "Submitted: " . current_time('mysql') . "\n";
    $email_body .= "IP Address: " . wpyvr_get_client_ip() . "\n";

    // Email headers
    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: WPYVR Contact Form <noreply@wpyvr.org>',
        'Reply-To: ' . $name . ' <' . $email . '>',
    ];

    // Send email to all staff members
    $mail_sent = wp_mail($recipients, $email_subject, $email_body, $headers);

    if (!$mail_sent) {
        return new WP_Error(
            'email_failed',
            'Failed to send email. Please try again later.',
            ['status' => 500]
        );
    }

    // Log the submission (optional - for future analytics or spam prevention)
    do_action('wpyvr_contact_form_submitted', [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'preferred_contact' => $preferred_contact,
        'subject' => $subject,
        'message' => $message,
        'ip' => wpyvr_get_client_ip(),
        'timestamp' => current_time('timestamp'),
    ]);

    return new WP_REST_Response([
        'status' => 'success',
        'message' => 'Your message has been sent successfully.',
    ], 200);
}

/**
 * Get client IP address (with proxy support)
 * 
 * @return string
 */
function wpyvr_get_client_ip() {
    $ip_keys = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR',
    ];

    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                
                // Validate IP address
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }

    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'Unknown';
}

/**
 * Future: Add reCAPTCHA verification
 * 
 * @param string $token
 * @return bool
 */
function wpyvr_verify_recaptcha($token) {
    // TODO: Implement reCAPTCHA verification
    // $secret = get_option('wpyvr_recaptcha_secret');
    // if (empty($secret)) {
    //     return true; // Skip if not configured
    // }
    //
    // $response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
    //     'body' => [
    //         'secret' => $secret,
    //         'response' => $token,
    //     ],
    // ]);
    //
    // if (is_wp_error($response)) {
    //     return false;
    // }
    //
    // $body = json_decode(wp_remote_retrieve_body($response), true);
    // return isset($body['success']) && $body['success'] === true;
    
    return true; // Placeholder
}
