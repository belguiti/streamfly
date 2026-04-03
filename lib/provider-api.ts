/**
 * Gold Panel API wrapper (ver 1.81)
 * Base: https://8k.cms-only.ru/api/api.php
 */

const BASE_URL = 'https://8k.cms-only.ru/api/api.php'

function apiKey(): string {
    const key = (process.env.PROVIDER_API_KEY ?? '').trim()
    if (!key) throw new Error('PROVIDER_API_KEY is not set')
    return key
}

async function call(params: Record<string, string | number>): Promise<any> {
    const qs = new URLSearchParams({
        ...Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
        ),
        api_key: apiKey(),
    })
    const url = `${BASE_URL}?${qs.toString()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Provider API HTTP ${res.status}`)
    const data = await res.json()
    // API returns array with one object
    const obj = Array.isArray(data) ? data[0] : data
    if (obj?.status === 'false' || obj?.status === false) {
        throw new Error(obj?.message ?? 'Provider API error')
    }
    return obj
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface M3uDevice {
    userId: string
    username: string
    password: string
    /** Full M3U Plus URL returned by the API */
    url: string
    /** Xtream Codes server base URL (parsed from url) */
    serverUrl: string
    /** Xtream-format string: "serverUrl|username|password" */
    xtreamValue: string
}

export interface MagDevice {
    userId: string
    mac: string
    portalUrl: string
}

export interface ResellerInfo {
    username: string
    credits: number
    enabled: boolean
}

export interface Package {
    id: string
    name: string
}

export interface DeviceInfo {
    username: string
    password: string
    expire: string
    country: string
    userId: string
    serverUrl: string
    enabled: boolean
}

// ── Sub length helper ─────────────────────────────────────────────────────────

/** Maps plan duration_months to the API's sub param (1 | 3 | 6 | 12) */
export function durationToSub(months: number): 1 | 3 | 6 | 12 {
    if (months >= 12) return 12
    if (months >= 6)  return 6
    if (months >= 3)  return 3
    return 1
}

/** Parse server URL from the M3U url the API returns */
function parseServerFromUrl(m3uUrl: string): string {
    try {
        const u = new URL(m3uUrl)
        return `${u.protocol}//${u.host}`
    } catch {
        return ''
    }
}

/** Parse username & password from M3U URL query string */
function parseM3uCredentials(m3uUrl: string): { username: string; password: string } {
    try {
        const u = new URL(m3uUrl)
        return {
            username: u.searchParams.get('username') ?? '',
            password: u.searchParams.get('password') ?? '',
        }
    } catch {
        return { username: '', password: '' }
    }
}

// ── Exported API functions ────────────────────────────────────────────────────

/**
 * Create a new M3U device (called on every new purchase).
 * Returns parsed credentials ready to store.
 */
export async function createM3uDevice(opts: {
    packId: string | number
    sub: 1 | 3 | 6 | 12
    country?: string
    notes?: string
}): Promise<M3uDevice> {
    const params: Record<string, string | number> = {
        action: 'new',
        type: 'm3u',
        pack: opts.packId,
        sub: opts.sub,
    }
    if (opts.country) params.country = opts.country
    if (opts.notes)   params.notes   = opts.notes

    const data = await call(params)
    const rawUrl: string = data.url ?? ''
    const { username, password } = parseM3uCredentials(rawUrl)
    const serverUrl = parseServerFromUrl(rawUrl)

    return {
        userId:      String(data.user_id ?? ''),
        username,
        password,
        url:         rawUrl,
        serverUrl,
        xtreamValue: `${serverUrl}|${username}|${password}`,
    }
}

/**
 * Create a new MAG device (user must provide their MAC address).
 */
export async function createMagDevice(opts: {
    mac: string
    packId: string | number
    sub: 1 | 3 | 6 | 12
    country?: string
    notes?: string
}): Promise<MagDevice> {
    const params: Record<string, string | number> = {
        action: 'new',
        type: 'mag',
        user: opts.mac,
        pack: opts.packId,
        sub: opts.sub,
    }
    if (opts.country) params.country = opts.country
    if (opts.notes)   params.notes   = opts.notes

    const data = await call(params)
    return {
        userId:    String(data.user_id ?? ''),
        mac:       data.mac ?? opts.mac,
        portalUrl: data.url ?? '',
    }
}

/**
 * Renew an existing M3U device (called when admin activates a renewal).
 */
export async function renewM3uDevice(
    username: string,
    password: string,
    sub: 1 | 3 | 6 | 12,
): Promise<void> {
    await call({ action: 'renew', type: 'm3u', username, password, sub })
}

/**
 * Renew an existing MAG device.
 */
export async function renewMagDevice(mac: string, sub: 1 | 3 | 6 | 12): Promise<void> {
    await call({ action: 'renew', type: 'mag', mac, sub })
}

/**
 * List all available content packages (bouquets).
 */
export async function getPackages(): Promise<Package[]> {
    const data = await fetch(
        `${BASE_URL}?action=bouquet&api_key=${apiKey()}`,
        { cache: 'no-store' }
    )
    const json = await data.json()
    return (json as any[]).map(p => ({ id: String(p.id), name: p.name }))
}

/**
 * Get reseller account info (credits remaining, enabled status).
 */
export async function getResellerInfo(): Promise<ResellerInfo> {
    const data = await call({ action: 'reseller' })
    return {
        username: data.username ?? '',
        credits:  Number(data.credits ?? 0),
        enabled:  data.enabled === '1' || data.enabled === 1,
    }
}

/**
 * Get full info for an M3U device.
 */
export async function getDeviceInfo(username: string, password: string): Promise<DeviceInfo> {
    const data = await call({ action: 'device_info', username, password })
    return {
        username:  data.username ?? username,
        password:  data.password ?? password,
        expire:    data.expire ?? '',
        country:   data.country ?? '',
        userId:    String(data.user_id ?? ''),
        serverUrl: data.url ?? '',
        enabled:   data.enabled === '1' || data.enabled === 1,
    }
}

/**
 * Enable or disable a device by its provider user_id.
 */
export async function setDeviceStatus(
    userId: string,
    status: 'enable' | 'disable',
): Promise<void> {
    await call({ action: 'device_status', id: userId, status })
}
