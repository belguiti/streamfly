import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

const FROM = `${process.env.RESEND_FROM_NAME ?? 'Streamtly'} <${process.env.RESEND_FROM_EMAIL ?? 'support@streamtly.com'}>`

function buildEmailHtml(toName: string, body: string, subject: string): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.streamtly.com'
    const year = new Date().getFullYear()
    const safeBody = body
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>')

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#080818;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080818;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header banner with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,#2d2a72 50%,#0f172a 100%);border-radius:16px 16px 0 0;padding:40px 40px 36px;text-align:center;border:1px solid rgba(99,102,241,0.35);border-bottom:none;">
              <!-- Wordmark -->
              <p style="margin:0 0 20px;font-size:30px;font-weight:900;letter-spacing:-0.5px;color:#ffffff;">
                Stream<span style="color:#22C55E;">tly</span>
              </p>
              <!-- Support badge -->
              <span style="display:inline-block;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);color:#4ADE80;font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 18px;border-radius:100px;text-transform:uppercase;">
                &#9679;&nbsp; Support Reply
              </span>
            </td>
          </tr>

          <!-- Gradient accent line -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#4338CA,#22C55E,#8B5CF6);border-left:1px solid rgba(99,102,241,0.35);border-right:1px solid rgba(99,102,241,0.35);"></td>
          </tr>

          <!-- Main body -->
          <tr>
            <td style="background:#0F0F23;padding:40px 40px 36px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">
                Hi ${toName} 👋
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#64748B;">
                Here's a message from the Streamtly support team.
              </p>

              <!-- Message card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#13132A;border:1px solid rgba(99,102,241,0.2);border-left:4px solid #4338CA;border-radius:8px;padding:24px 28px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#4338CA;text-transform:uppercase;">Message</p>
                    <p style="margin:0;font-size:15px;color:#CBD5E1;line-height:1.8;">${safeBody}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#4338CA 0%,#5B50E8 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.5px;">
                      Visit Streamtly &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.25),transparent);"></td>
                </tr>
              </table>

              <!-- Reply note -->
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;text-align:center;">
                Simply reply to this email — we'll get back to you shortly.<br/>
                Or reach us directly at
                <a href="mailto:support@streamtly.com" style="color:#818CF8;text-decoration:none;">support@streamtly.com</a>
              </p>

            </td>
          </tr>

          <!-- Feature pills strip -->
          <tr>
            <td style="background:#0A0A1C;padding:20px 40px;border:1px solid rgba(99,102,241,0.35);border-top:none;border-bottom:none;text-align:center;">
              <span style="display:inline-block;background:rgba(67,56,202,0.12);border:1px solid rgba(67,56,202,0.25);color:#818CF8;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">
                &#127916; 4K Streaming
              </span>
              <span style="display:inline-block;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#4ADE80;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">
                &#128286; 18,000+ Channels
              </span>
              <span style="display:inline-block;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);color:#A78BFA;font-size:11px;font-weight:600;padding:5px 14px;border-radius:100px;margin:3px;">
                &#9889; Instant Access
              </span>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#07071A;border:1px solid rgba(99,102,241,0.35);border-top:1px solid rgba(99,102,241,0.15);border-bottom:none;border-radius:0;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#334155;">Streamtly Support Team</p>
              <p style="margin:0 0 14px;font-size:12px;color:#1E293B;">
                &copy; ${year} Streamtly. All rights reserved.
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="${siteUrl}/privacy" style="color:#4338CA;text-decoration:none;margin:0 8px;">Privacy</a>
                <span style="color:#1E293B;">&middot;</span>
                <a href="${siteUrl}/terms" style="color:#4338CA;text-decoration:none;margin:0 8px;">Terms</a>
                <span style="color:#1E293B;">&middot;</span>
                <a href="${siteUrl}/contact" style="color:#4338CA;text-decoration:none;margin:0 8px;">Contact</a>
              </p>
            </td>
          </tr>

          <!-- Bottom rounded cap -->
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

export async function POST(req: NextRequest) {
    // Verify admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, to, toName, subject, body } = await req.json()
    if (!id || !to || !subject || !body) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send reply email
    const { error: sendError } = await resend.emails.send({
        from: FROM,
        to: [to],
        subject,
        html: buildEmailHtml(toName, body, subject),
    })

    if (sendError) {
        console.error('reply send error:', sendError)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Mark message as read after replying
    await supabaseAdmin.from('contact_messages').update({ read: true }).eq('id', id)

    return NextResponse.json({ success: true })
}
