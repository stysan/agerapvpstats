<?php

function sendGenericRequest(string $url): string {
    require_once __DIR__ . '/config.php';

    $ch = curl_init($agerapvp_api_url . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-Api-Key: ' . $API_SECRET,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        throw new RuntimeException("cURL error: $curlError");
    }

    if ($httpCode !== 200) {
        throw new RuntimeException("API request failed with status $httpCode: $response");
    }

    return $response;
}