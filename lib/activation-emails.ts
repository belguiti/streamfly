import { resend } from '@/lib/resend'

const FROM = `${process.env.RESEND_FROM_NAME ?? 'Streamtly'} <${process.env.RESEND_FROM_EMAIL ?? 'support@streamtly.com'}>`
const ADMIN_EMAIL = 'azdinebelwwiti@gmail.com'
const SITE_URL = 'https://www.streamtly.com'

// ─── Credential parser ────────────────────────────────────────────────────────
// Admin enters credentials in the pool using this format:
//   account type  → "http://server:port|username|password"
//   activation_code → plain code string
//   note          → free text / link

interface XtreamCreds {
    kind: 'xtream'
    serverUrl: string
    username: string
    password: string
    m3uUrl: string
    m3uPlusUrl: string
    epgUrl: string
    portalUrl: string
}
interface SimpleCreds { kind: 'code'; value: string }
interface TextCreds   { kind: 'text'; value: string }
type ParsedCreds = XtreamCreds | SimpleCreds | TextCreds

function parseCreds(type: string, value: string): ParsedCreds {
    if (type === 'account' && value.includes('|')) {
        const [rawServer, username = '', password = ''] = value.split('|').map(s => s.trim())
        const serverUrl = rawServer.replace(/\/$/, '')
        const u = encodeURIComponent(username)
        const p = encodeURIComponent(password)
        return {
            kind: 'xtream',
            serverUrl,
            username,
            password,
            m3uUrl:     `${serverUrl}/get.php?username=${u}&password=${p}&type=m3u`,
            m3uPlusUrl: `${serverUrl}/get.php?username=${u}&password=${p}&type=m3u_plus`,
            epgUrl:     `${serverUrl}/xmltv.php?username=${u}&password=${p}`,
            portalUrl:  `${serverUrl}/c/`,
        }
    }
    if (type === 'activation_code') return { kind: 'code', value }
    return { kind: 'text', value }
}

// ─── Credential HTML block ────────────────────────────────────────────────────
function buildCredentialsHtml(creds: ParsedCreds): string {
    const row = (label: string, val: string, mono = false, isLink = false) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(99,102,241,0.1);width:130px;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;letter-spacing:1px;color:#818CF8;text-transform:uppercase;">${label}</span>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(99,102,241,0.1);vertical-align:top;">
          ${isLink
            ? `<a href="${val}" style="font-size:13px;color:#4ADE80;word-break:break-all;font-family:'Courier New',monospace;">${val}</a>`
            : `<span style="font-size:${mono ? '13px' : '14px'};color:#ffffff;word-break:break-all;font-family:${mono ? "'Courier New',monospace" : 'inherit'};">${val}</span>`
          }
        </td>
      </tr>`

    if (creds.kind === 'xtream') {
        return `
      <!-- Xtream / User-Pass section -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="background:#13132A;border:1px solid rgba(99,102,241,0.2);border-left:4px solid #4338CA;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#818CF8;text-transform:uppercase;">&#128100; Xtream Codes / App Login</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('Server URL', creds.serverUrl, true, true)}
              ${row('Username',   creds.username, true)}
              ${row('Password',   creds.password, true)}
            </table>
          </td>
        </tr>
      </table>

      <!-- M3U section -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="background:#0d1f12;border:1px solid rgba(34,197,94,0.2);border-left:4px solid #22C55E;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#22C55E;text-transform:uppercase;">&#127916; M3U / M3U Plus Links</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('M3U',      creds.m3uUrl,     true, true)}
              ${row('M3U Plus', creds.m3uPlusUrl, true, true)}
            </table>
          </td>
        </tr>
      </table>

      <!-- EPG + Portal section -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="background:#130d1f;border:1px solid rgba(139,92,246,0.2);border-left:4px solid #8B5CF6;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#A78BFA;text-transform:uppercase;">&#128198; EPG &amp; Portal</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('EPG URL',    creds.epgUrl,   true, true)}
              ${row('Portal URL', creds.portalUrl, true, true)}
            </table>
          </td>
        </tr>
      </table>`
    }

    // Simple code or text
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="background:#0d1f12;border:1px solid rgba(34,197,94,0.3);border-left:4px solid #22C55E;border-radius:8px;padding:24px 28px;text-align:center;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#22C55E;text-transform:uppercase;">&#128273; Your Activation Code</p>
            <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:3px;font-family:'Courier New',monospace;word-break:break-all;">${creds.value}</p>
          </td>
        </tr>
      </table>`
}

// ─── Shared layout ────────────────────────────────────────────────────────────
function baseLayout(headerContent: string, bodyContent: string): string {
    const year = new Date().getFullYear()
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#080818;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080818;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,#2d2a72 50%,#0f172a 100%);border-radius:16px 16px 0 0;padding:40px 40px 36px;text-align:center;border:1px solid rgba(99,102,241,0.35);border-bottom:none;">
              <p style="margin:0 0 20px;font-size:30px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">
                Stream<span style="color:#22C55E;">tly</span>
              </p>
              ${headerContent}
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#4338CA,#22C55E,#8B5CF6);border-left:1px solid rgba(99,102,241,0.35);border-right:1px solid rgba(99,102,241,0.35);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0F0F23;padding:40px 40px 36px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Feature pills -->
          <tr>
            <td style="background:#0A0A1C;padding:20px 40px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;text-align:center;">
              <span style="display:inline-block;background:rgba(67,56,202,0.12);border:1px solid rgba(67,56,202,0.25);color:#818CF8;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">&#127916; 4K Streaming</span>
              <span style="display:inline-block;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#4ADE80;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">&#128286; 18,000+ Channels</span>
              <span style="display:inline-block;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);color:#A78BFA;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">&#9889; Instant Access</span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#07071A;border:1px solid rgba(99,102,241,0.35);border-top:1px solid rgba(99,102,241,0.15);padding:28px 40px;text-align:center;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#334155;">Streamtly Support Team</p>
              <p style="margin:0 0 14px;font-size:12px;color:#1E293B;">&copy; ${year} Streamtly. All rights reserved.</p>
              <p style="margin:0;font-size:12px;">
                <a href="${SITE_URL}/privacy" style="color:#4338CA;text-decoration:none;margin:0 8px;">Privacy</a>
                <span style="color:#1E293B;">&middot;</span>
                <a href="${SITE_URL}/terms" style="color:#4338CA;text-decoration:none;margin:0 8px;">Terms</a>
                <span style="color:#1E293B;">&middot;</span>
                <a href="${SITE_URL}/contact" style="color:#4338CA;text-decoration:none;margin:0 8px;">Contact</a>
              </p>
            </td>
          </tr>

          <!-- Bottom cap -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#4338CA,#22C55E,#8B5CF6);border-radius:0 0 16px 16px;border:1px solid rgba(99,102,241,0.35);border-top:none;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Exported email functions ─────────────────────────────────────────────────

/** Email to client when code is successfully provisioned */
export async function sendActivationSuccessEmail(
    toEmail: string,
    userName: string,
    planName: string,
    codeValue: string,
    codeType: string,
) {
    const creds = parseCreds(codeType, codeValue)

    const header = `
      <span style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#4ADE80;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
        &#10003;&nbsp; Order Confirmed
      </span>`

    const body = `
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">Hi ${userName} &#128075;</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748B;">Thank you for choosing Streamtly! Your subscription is active — here are all your access details.</p>

      <!-- Plan badge -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#13132A;border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:16px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#818CF8;text-transform:uppercase;">Your Plan</p>
            <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#ffffff;">${planName}</p>
          </td>
        </tr>
      </table>

      ${buildCredentialsHtml(creds)}

      <!-- CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/app" style="display:inline-block;background:linear-gradient(135deg,#166534 0%,#15803d 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.5px;">
              Go to My Dashboard &rarr;
            </a>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.25),transparent);"></td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;text-align:center;">
        Need help getting started? Contact us at
        <a href="mailto:support@streamtly.com" style="color:#818CF8;text-decoration:none;">support@streamtly.com</a>
      </p>`

    await resend.emails.send({
        from: FROM,
        to: [toEmail],
        subject: '✅ Your Streamtly Access Details are Ready!',
        html: baseLayout(header, body),
    })
}

/** Email to client when pool is empty — code will arrive in 1-2 hours */
export async function sendActivationDelayEmail(
    toEmail: string,
    userName: string,
    planName: string,
) {
    const header = `
      <span style="display:inline-block;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);color:#FCD34D;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
        &#9203;&nbsp; Processing Your Order
      </span>`

    const body = `
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">Hi ${userName} &#128075;</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748B;">Thank you for your purchase! We've received your order and it's being processed.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#13132A;border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:16px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#818CF8;text-transform:uppercase;">Your Plan</p>
            <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#ffffff;">${planName}</p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:linear-gradient(135deg,#1c1700 0%,#1a1500 100%);border:1px solid rgba(251,191,36,0.25);border-left:4px solid #F59E0B;border-radius:8px;padding:24px 28px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#F59E0B;text-transform:uppercase;">&#8987; Estimated Delivery</p>
            <p style="margin:0 0 12px;font-size:24px;font-weight:900;color:#FCD34D;">1 – 2 Hours</p>
            <p style="margin:0;font-size:14px;color:#CBD5E1;line-height:1.7;">
              Due to high demand, we're preparing a fresh batch of access credentials.
              Your complete access details will be sent to this email address as soon as they're ready.
              <br/><br/>
              <strong style="color:#ffffff;">You don't need to do anything</strong> — sit back and we'll take care of the rest.
            </p>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/contact" style="display:inline-block;background:linear-gradient(135deg,#4338CA 0%,#5B50E8 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.5px;">
              Contact Support &rarr;
            </a>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.25),transparent);"></td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;text-align:center;">
        Questions? We're here at
        <a href="mailto:support@streamtly.com" style="color:#818CF8;text-decoration:none;">support@streamtly.com</a>
      </p>`

    await resend.emails.send({
        from: FROM,
        to: [toEmail],
        subject: '⏳ Your Streamtly Order is Being Processed',
        html: baseLayout(header, body),
    })
}

/** Email to client when admin activates a renewal */
export async function sendRenewalConfirmationEmail(
    toEmail: string,
    userName: string,
    planName: string,
    newPeriodEnd: string,
) {
    const header = `
      <span style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#4ADE80;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
        &#10003;&nbsp; Subscription Renewed
      </span>`

    const body = `
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">Hi ${userName} &#128075;</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748B;">Great news — your Streamtly subscription has been successfully renewed!</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background:#0d1f12;border:1px solid rgba(34,197,94,0.2);border-left:4px solid #22C55E;border-radius:8px;padding:24px 28px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#22C55E;text-transform:uppercase;">Plan Renewed</p>
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#ffffff;">${planName}</p>
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#22C55E;text-transform:uppercase;">Active Until</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">${newPeriodEnd}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 28px;font-size:14px;color:#64748B;line-height:1.7;">
        Your existing credentials remain the same — no changes needed. Simply continue streaming as before.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/app" style="display:inline-block;background:linear-gradient(135deg,#166534 0%,#15803d 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.5px;">
              Go to My Dashboard &rarr;
            </a>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.25),transparent);"></td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;text-align:center;">
        Need help? Contact us at
        <a href="mailto:support@streamtly.com" style="color:#818CF8;text-decoration:none;">support@streamtly.com</a>
      </p>`

    await resend.emails.send({
        from: FROM,
        to: [toEmail],
        subject: '🎉 Your Streamtly Subscription Has Been Renewed!',
        html: baseLayout(header, body),
    })
}

/** Alert email to admin when activation pool is empty */
export async function sendAdminPoolEmptyAlert(planName: string, customerEmail: string) {
    const header = `
      <span style="display:inline-block;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#FCA5A5;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
        &#9888; Admin Alert
      </span>`

    const body = `
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">Activation Pool Empty &#128680;</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748B;">A customer just completed a purchase but no activation codes are available.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:linear-gradient(135deg,#1f0a0a 0%,#1a0808 100%);border:1px solid rgba(239,68,68,0.25);border-left:4px solid #EF4444;border-radius:8px;padding:24px 28px;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#EF4444;text-transform:uppercase;">Details</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#94A3B8;width:120px;">Plan</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;">${planName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#94A3B8;">Customer</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#94A3B8;">Action</td>
                <td style="padding:6px 0;font-size:13px;font-weight:700;color:#FCA5A5;">Add codes to pool &amp; manually activate</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/admin/orders" style="display:inline-block;background:linear-gradient(135deg,#991B1B 0%,#DC2626 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.5px;">
              Go to Admin Panel &rarr;
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;text-align:center;">
        The customer has been notified that their access details will arrive within 1–2 hours.
      </p>`

    await resend.emails.send({
        from: FROM,
        to: [ADMIN_EMAIL],
        subject: `🚨 [Action Required] Activation Pool Empty — ${planName}`,
        html: baseLayout(header, body),
    })
}
