interface SmsApiResponse {
    success: boolean;
    data?: any;
    error?: {
        message: string;
    };
}

/**
 * Sends a single SMS message using the Whiteice API.
 * @param apiUrl The full endpoint URL of the SMS service (e.g., http://sms.whiteice.com.pk/services/send.php).
 * @param apiKey Your API key.
 * @param number The destination phone number.
 * @param message The text message to send.
 * @param isDemoMode If true, simulates a successful API call without making a real request.
 * @returns The API response for the sent message.
 * @throws An error if the API request fails or the API returns an error.
 */
export const sendSingleMessage = async (
    apiUrl: string,
    apiKey: string,
    number: string,
    message: string,
    isDemoMode: boolean = false
): Promise<any> => {
    if (isDemoMode) {
        console.log(`SMS Demo Mode: Simulating sending "${message}" to ${number}`);
        return new Promise(resolve => setTimeout(() => {
            resolve({
                ID: `demo-${Date.now()}`,
                number: number,
                message: message,
                status: "Sent (Demo Mode)",
            });
        }, 500));
    }
    
    const url = apiUrl; // The user now provides the full endpoint URL.
    
    // The API expects data in 'application/x-www-form-urlencoded' format.
    // URLSearchParams is the standard way to create this format.
    const postData = new URLSearchParams({
        number: number,
        message: message,
        key: apiKey,
        devices: '0', // Use the primary device as per docs for single message
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: postData.toString(),
        });

        if (!response.ok) {
            // Catches HTTP errors like 404, 500 etc.
            throw new Error(`HTTP Error Code: ${response.status}`);
        }
        
        // The API might return non-JSON on failure, so we handle that gracefully.
        const responseText = await response.text();
        try {
            const json: SmsApiResponse = JSON.parse(responseText);

            if (json.success && json.data?.messages?.[0]) {
                return json.data.messages[0];
            } else {
                throw new Error(json.error?.message || 'API returned an unknown error.');
            }
        } catch (e) {
            // This catches JSON parsing errors, which can happen if the server
            // returns an HTML error page or a plain text error.
            throw new Error(`Failed to parse API response: ${responseText}`);
        }

    } catch (error) {
        // Catches network errors (e.g., CORS, DNS failure) or errors thrown above.
        console.error("Error sending SMS:", error);
        if (error instanceof Error) {
             throw new Error(`Failed to send SMS: ${error.message}`);
        }
        throw new Error("An unknown error occurred while sending the SMS.");
    }
};