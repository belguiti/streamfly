import { Resend } from 'resend'
import { readFileSync } from 'fs'

// Load .env.prod
const env = readFileSync('.env.prod', 'utf-8')
for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '').replace(/\\n/g, '')
}

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Streamtly <support@streamtly.com>'
const SITE_URL = 'https://www.streamtly.com'
const WHATSAPP = 'https://wa.me/message/STREAMTLYSUPPORT'
const year = new Date().getFullYear()

const SERVER   = 'http://bored78441.wd.onvitv.online'
const USERNAME = '79013c05fe'
const PASSWORD = '04fdefcd01'
const M3U      = `${SERVER}/get.php?username=${USERNAME}&password=${PASSWORD}&type=m3u`
const M3U_PLUS = `${SERVER}/get.php?username=${USERNAME}&password=${PASSWORD}&type=m3u_plus`
const EPG      = `${SERVER}/xmltv.php?username=${USERNAME}&password=${PASSWORD}`
const PORTAL   = `${SERVER}/c/`

function row(label, val, mono = false, isLink = false) {
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(99,102,241,0.1);width:130px;vertical-align:top;">
        <span style="font-size:11px;font-weight:700;letter-spacing:1px;color:#818CF8;text-transform:uppercase;">${label}</span>
      </td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(99,102,241,0.1);vertical-align:top;">
        ${isLink
          ? `<a href="${val}" style="font-size:13px;color:#4ADE80;word-break:break-all;font-family:'Courier New',monospace;">${val}</a>`
          : `<span style="font-size:${mono?'13px':'14px'};color:#ffffff;word-break:break-all;font-family:${mono?"'Courier New',monospace":'inherit'};">${val}</span>`
        }
      </td>
    </tr>`
}

function buildEmail() {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#080818;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080818;padding:48px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e1b4b 0%,#2d2a72 50%,#0f172a 100%);border-radius:16px 16px 0 0;padding:40px 40px 36px;text-align:center;border:1px solid rgba(99,102,241,0.35);border-bottom:none;">
            <p style="margin:0 0 20px;font-size:30px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">Stream<span style="color:#22C55E;">tly</span></p>
            <span style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#4ADE80;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
              ✓&nbsp; Your Access Details are Ready
            </span>
          </td>
        </tr>

        <!-- Accent line -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#4338CA,#22C55E,#8B5CF6);border-left:1px solid rgba(99,102,241,0.35);border-right:1px solid rgba(99,102,241,0.35);"></td></tr>

        <!-- Body -->
        <tr>
          <td style="background:#0F0F23;padding:40px 40px 36px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;">

            <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">Hi there 👋</p>
            <p style="margin:0 0 20px;font-size:14px;color:#64748B;">Thank you so much for your patience and for choosing Streamtly!</p>

            <!-- Apology banner -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:linear-gradient(135deg,#1c1000,#1a0e00);border:1px solid rgba(251,191,36,0.25);border-left:4px solid #F59E0B;border-radius:8px;padding:20px 24px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#FCD34D;">We sincerely apologize for the delay.</p>
                  <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.7;">
                    We experienced a brief technical issue that delayed sending your credentials.
                    Your subscription is fully active and your access details are below.
                    We appreciate your patience and are sorry for any inconvenience caused.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Xtream Codes -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background:#13132A;border:1px solid rgba(99,102,241,0.2);border-left:4px solid #4338CA;border-radius:8px;padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#818CF8;text-transform:uppercase;">👤 Xtream Codes / App Login</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('Server URL', SERVER, true, true)}
                    ${row('Username',   USERNAME, true)}
                    ${row('Password',   PASSWORD, true)}
                  </table>
                </td>
              </tr>
            </table>

            <!-- M3U -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="background:#0d1f12;border:1px solid rgba(34,197,94,0.2);border-left:4px solid #22C55E;border-radius:8px;padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#22C55E;text-transform:uppercase;">🎬 M3U / M3U Plus Links</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('M3U',      M3U,      true, true)}
                    ${row('M3U Plus', M3U_PLUS, true, true)}
                  </table>
                </td>
              </tr>
            </table>

            <!-- EPG + Portal -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#130d1f;border:1px solid rgba(139,92,246,0.2);border-left:4px solid #8B5CF6;border-radius:8px;padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#A78BFA;text-transform:uppercase;">📅 EPG &amp; Portal</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('EPG URL',    EPG,    true, true)}
                    ${row('Portal URL', PORTAL, true, true)}
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA buttons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td align="center" style="padding-bottom:12px;">
                  <a href="${SITE_URL}/guides" style="display:inline-block;background:linear-gradient(135deg,#166534,#15803d);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.5px;">
                    📖 View Setup Guides →
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <a href="${WHATSAPP}" style="display:inline-block;background:linear-gradient(135deg,#14532d,#16a34a);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.5px;">
                    💬 WhatsApp Support →
                  </a>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.25),transparent);"></td></tr>
            </table>

            <!-- Support note -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#0d0d20;border:1px solid rgba(99,102,241,0.15);border-radius:8px;padding:16px 20px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:13px;color:#94A3B8;">Need help installing on your device?</p>
                  <p style="margin:0;font-size:13px;color:#64748B;">
                    Message us on
                    <a href="${WHATSAPP}" style="color:#4ADE80;font-weight:700;text-decoration:none;">WhatsApp</a>
                    — we'll guide you step by step. You can also visit our
                    <a href="${SITE_URL}/guides" style="color:#818CF8;text-decoration:none;">setup guides</a>
                    for Firestick, Smart TV, Android, iOS and more.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Feature pills -->
        <tr>
          <td style="background:#0A0A1C;padding:20px 40px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;text-align:center;">
            <span style="display:inline-block;background:rgba(67,56,202,0.12);border:1px solid rgba(67,56,202,0.25);color:#818CF8;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">🎬 4K Streaming</span>
            <span style="display:inline-block;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#4ADE80;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">📺 35,000+ Channels</span>
            <span style="display:inline-block;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);color:#A78BFA;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">⚡ Instant Access</span>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#07071A;border:1px solid rgba(99,102,241,0.35);border-top:1px solid rgba(99,102,241,0.15);padding:28px 40px;text-align:center;">
            <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#334155;">Streamtly Support Team</p>
            <p style="margin:0 0 14px;font-size:12px;color:#1E293B;">© ${year} Streamtly. All rights reserved.</p>
            <p style="margin:0;font-size:12px;">
              <a href="${SITE_URL}/privacy" style="color:#4338CA;text-decoration:none;margin:0 8px;">Privacy</a>
              <span style="color:#1E293B;">·</span>
              <a href="${SITE_URL}/terms" style="color:#4338CA;text-decoration:none;margin:0 8px;">Terms</a>
              <span style="color:#1E293B;">·</span>
              <a href="${SITE_URL}/contact" style="color:#4338CA;text-decoration:none;margin:0 8px;">Contact</a>
            </p>
          </td>
        </tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#4338CA,#22C55E,#8B5CF6);border-radius:0 0 16px 16px;border:1px solid rgba(99,102,241,0.35);border-top:none;"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function send(to) {
    const r = await resend.emails.send({
        from: FROM,
        to: [to],
        subject: '✅ Your Streamtly Access Details are Ready — Sorry for the Wait!',
        html: buildEmail(),
    })
    console.log(`Sent to ${to}:`, r)
}

// Send test first, then customer
await send('azdinebelwwiti@gmail.com')
await send('nicoalemanes@gmail.com')
