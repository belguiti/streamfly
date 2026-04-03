import crypto from 'crypto'

const BASE_URL = 'https://api.nowpayments.io/v1'
const API_KEY = (process.env.NOWPAYMENTS_API_KEY ?? '').trim()

export interface NowPaymentsInvoice {
    id: string
    token_id: string
    invoice_url: string
    order_id: string
}

/** Create a hosted invoice page and return the URL to redirect the user to */
export async function createInvoice(params: {
    priceAmount: number
    orderId: string          // e.g. "userId__planId__timestamp"
    orderDescription: string
    ipnCallbackUrl: string
    successUrl: string
    cancelUrl: string
}): Promise<NowPaymentsInvoice> {
    const res = await fetch(`${BASE_URL}/invoice`, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price_amount: params.priceAmount,
            price_currency: 'usd',
            order_id: params.orderId,
            order_description: params.orderDescription,
            ipn_callback_url: params.ipnCallbackUrl,
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            is_fixed_rate: true,
            is_fee_paid_by_user: false,
        }),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`NOWPayments invoice error ${res.status}: ${text}`)
    }

    return res.json()
}

/** Verify IPN signature: HMAC-SHA512(sortedJsonBody, IPN_SECRET) == x-nowpayments-sig */
export function verifyIpnSignature(rawBody: string, signature: string): boolean {
    const secret = (process.env.NOWPAYMENTS_IPN_SECRET ?? '').trim()
    if (!secret) return false

    // Sort JSON keys alphabetically as required by NOWPayments
    const parsed = JSON.parse(rawBody)
    const sorted = Object.keys(parsed)
        .sort()
        .reduce((acc: Record<string, unknown>, key) => { acc[key] = parsed[key]; return acc }, {})

    const hmac = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(sorted))
        .digest('hex')

    return hmac === signature
}

/** Payment statuses that mean "successfully paid" */
export const PAID_STATUSES = new Set(['confirmed', 'finished'])
