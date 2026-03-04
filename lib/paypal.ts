const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

/**
 * Get a PayPal OAuth2 access token using client credentials.
 */
async function getAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID!
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(`PayPal OAuth Error: ${JSON.stringify(data)}`)
    }
    return data.access_token
}

/**
 * Create a PayPal subscription for the given plan.
 */
export async function createPayPalSubscription(
    paypalPlanId: string,
    userId: string,
    planId: string,
    email: string,
    returnUrl: string,
    cancelUrl: string
): Promise<{ approvalUrl: string; subscriptionId: string }> {
    const token = await getAccessToken()

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            plan_id: paypalPlanId,
            subscriber: {
                email_address: email,
            },
            custom_id: JSON.stringify({ userId, planId }),
            application_context: {
                brand_name: 'Stream4U',
                locale: 'en-US',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                return_url: returnUrl,
                cancel_url: cancelUrl,
            },
        }),
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(`PayPal Create Subscription Error: ${JSON.stringify(data)}`)
    }

    const approvalLink = data.links?.find((link: any) => link.rel === 'approve')
    if (!approvalLink) {
        throw new Error('PayPal subscription approval link not found')
    }

    return {
        approvalUrl: approvalLink.href,
        subscriptionId: data.id,
    }
}

/**
 * Verify a PayPal webhook event signature.
 */
export async function verifyWebhookSignature(
    headers: Record<string, string>,
    body: string
): Promise<boolean> {
    const token = await getAccessToken()

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            auth_algo: headers['paypal-auth-algo'],
            cert_url: headers['paypal-cert-url'],
            transmission_id: headers['paypal-transmission-id'],
            transmission_sig: headers['paypal-transmission-sig'],
            transmission_time: headers['paypal-transmission-time'],
            webhook_id: process.env.PAYPAL_WEBHOOK_ID!,
            webhook_event: JSON.parse(body),
        }),
    })

    const data = await response.json()
    return data.verification_status === 'SUCCESS'
}

/**
 * Get subscription details from PayPal.
 */
export async function getPayPalSubscription(subscriptionId: string): Promise<any> {
    const token = await getAccessToken()

    const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to get PayPal subscription: ${response.statusText}`)
    }

    return response.json()
}
