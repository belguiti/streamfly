const TELEGRAM_API = 'https://api.telegram.org'

function botToken(): string {
    return (process.env.TELEGRAM_BOT_TOKEN ?? '').trim()
}

function chatId(): string {
    return (process.env.TELEGRAM_CHAT_ID ?? '').trim()
}

export async function sendTelegramMessage(text: string): Promise<void> {
    const token = botToken()
    const chat  = chatId()
    if (!token || !chat) {
        console.warn('[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping')
        return
    }
    try {
        await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML' }),
        })
    } catch (err) {
        console.error('[Telegram] Failed to send message:', err)
    }
}

// ── Alert builders ────────────────────────────────────────────────────────────

const PROVIDER_ICON: Record<string, string> = {
    paypal:      '🅿️ PayPal',
    stripe:      '💳 Stripe',
    nowpayments: '₿ Crypto',
    manual:      '🔧 Manual',
}

const DEVICE_LABEL: Record<string, string> = {
    smart_tv:     'Smart TV',
    android_box:  'Android Box',
    android_phone:'Android Phone',
    iphone_ipad:  'iPhone / iPad',
    windows_mac:  'Windows / Mac',
    mag_device:   'MAG Device',
    enigma2:      'Enigma2',
    other:        'Other',
}

export async function sendNewSubscriptionAlert(opts: {
    userEmail: string
    planName: string
    amountCents: number
    provider: string
    status: 'active' | 'pending_activation'
    expiresAt?: string | null
    deviceType?: string | null
    providerUsername?: string | null
}) {
    const statusIcon = opts.status === 'active' ? '✅ Active' : '⏳ Pending Activation'
    const expires = opts.expiresAt
        ? new Date(opts.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—'

    const lines = [
        '🎉 <b>New Subscription!</b>',
        '',
        `👤 <b>User:</b> ${opts.userEmail}`,
        `📦 <b>Plan:</b> ${opts.planName} ($${(opts.amountCents / 100).toFixed(2)})`,
        `${PROVIDER_ICON[opts.provider] ?? opts.provider}`,
        `📊 <b>Status:</b> ${statusIcon}`,
        `📅 <b>Expires:</b> ${expires}`,
    ]

    if (opts.deviceType) lines.push(`🖥️ <b>Device:</b> ${DEVICE_LABEL[opts.deviceType] ?? opts.deviceType}`)
    if (opts.providerUsername) lines.push(`🔑 <b>Username:</b> <code>${opts.providerUsername}</code>`)

    await sendTelegramMessage(lines.join('\n'))
}

export async function sendProvisionFailedAlert(opts: {
    userEmail: string
    planName: string
    provider: string
    error?: string
}) {
    const text = [
        '🚨 <b>Provisioning Failed!</b>',
        '',
        `👤 <b>User:</b> ${opts.userEmail}`,
        `📦 <b>Plan:</b> ${opts.planName}`,
        `${PROVIDER_ICON[opts.provider] ?? opts.provider}`,
        opts.error ? `❌ <b>Error:</b> ${opts.error}` : '',
        '',
        '⚠️ Manual activation required at /admin/orders',
    ].filter(Boolean).join('\n')

    await sendTelegramMessage(text)
}
