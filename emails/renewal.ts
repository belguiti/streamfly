interface RenewalEmailParams {
    userName: string
    planName: string
    endDate: string
    promoCode: string
    discountPercent: number
    renewUrl: string
}

export function renewalEmailHtml({
    userName,
    planName,
    endDate,
    promoCode,
    discountPercent,
    renewUrl,
}: RenewalEmailParams): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Streamtly subscription is ending soon</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0a0f1a;
    font-family: 'Inter', Arial, sans-serif;
    color: #c0ccda;
    -webkit-font-smoothing: antialiased;
  }

  .wrapper {
    max-width: 600px;
    margin: 40px auto;
    background: #111827;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* Animated gradient header */
  .header {
    background: linear-gradient(135deg, #0a0f1a 0%, #1a1040 50%, #0a1a2a 100%);
    padding: 48px 40px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .header::before {
    content: '';
    position: absolute;
    top: -60px; left: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 3s ease-in-out infinite;
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
    border-radius: 50%;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
  }

  .logo {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -1px;
    color: #ffffff;
    position: relative;
    z-index: 1;
  }

  .logo span {
    background: linear-gradient(90deg, #00d4ff, #00e5a0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-badge {
    display: inline-block;
    margin-top: 16px;
    padding: 6px 16px;
    background: rgba(251,191,36,0.15);
    border: 1px solid rgba(251,191,36,0.3);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    color: #fbbf24;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    z-index: 1;
  }

  .body {
    padding: 40px;
  }

  h1 {
    font-size: 26px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.3;
    margin-bottom: 16px;
  }

  .plan-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px 24px;
    margin: 24px 0;
  }

  .plan-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .plan-row:last-child { border-bottom: none; }

  .plan-label { font-size: 13px; color: #8899aa; }
  .plan-value { font-size: 13px; font-weight: 700; color: #ffffff; }
  .plan-value.danger { color: #f87171; }

  /* Promo code box */
  .promo-box {
    background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,229,160,0.08));
    border: 2px dashed rgba(0,212,255,0.4);
    border-radius: 16px;
    padding: 28px 24px;
    text-align: center;
    margin: 28px 0;
    position: relative;
    overflow: hidden;
  }

  .promo-box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.03), rgba(0,229,160,0.03));
    border-radius: 14px;
  }

  .promo-label {
    font-size: 11px;
    font-weight: 700;
    color: #8899aa;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .promo-code {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 6px;
    color: #ffffff;
    font-family: 'Courier New', monospace;
    background: linear-gradient(90deg, #00d4ff, #00e5a0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    z-index: 1;
  }

  .promo-discount {
    margin-top: 8px;
    font-size: 14px;
    color: #00e5a0;
    font-weight: 700;
  }

  /* CTA Button */
  .cta-wrap { text-align: center; margin: 32px 0; }

  .cta-btn {
    display: inline-block;
    padding: 18px 48px;
    background: linear-gradient(90deg, #00d4ff, #00e5a0);
    border-radius: 100px;
    font-size: 16px;
    font-weight: 900;
    color: #0a0f1a;
    text-decoration: none;
    letter-spacing: 0.3px;
    box-shadow: 0 8px 32px rgba(0,212,255,0.25);
    transition: transform 0.2s;
  }

  .steps {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px 24px;
    margin: 24px 0;
  }

  .steps-title {
    font-size: 12px;
    font-weight: 700;
    color: #8899aa;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 14px;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 6px 0;
  }

  .step-num {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0,212,255,0.15);
    border: 1px solid rgba(0,212,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
    color: #00d4ff;
  }

  .step-text {
    font-size: 13px;
    color: #c0ccda;
    line-height: 1.5;
    padding-top: 2px;
  }

  .footer {
    padding: 24px 40px;
    border-top: 1px solid rgba(255,255,255,0.05);
    text-align: center;
  }

  .footer p { font-size: 11px; color: #555; line-height: 1.8; }
  .footer a { color: #8899aa; text-decoration: underline; }
</style>
</head>
<body>
<div class="wrapper">

  <!-- Header -->
  <div class="header">
    <div class="logo">Stream<span>tly</span></div>
    <div class="header-badge">⚡ Subscription Renewal Notice</div>
  </div>

  <!-- Body -->
  <div class="body">
    <h1>Hey ${userName}, your subscription ends in 7 days!</h1>
    <p style="font-size:15px; line-height:1.7; color:#8899aa; margin-bottom:8px;">
      We hope you've been enjoying Streamtly. Your <strong style="color:#fff">${planName}</strong> plan
      expires on <strong style="color:#f87171">${endDate}</strong>.
    </p>
    <p style="font-size:15px; line-height:1.7; color:#8899aa;">
      Renew today and enjoy <strong style="color:#00e5a0">${discountPercent}% off</strong> your next
      subscription — as a thank you for being a valued member.
    </p>

    <!-- Plan Info -->
    <div class="plan-box">
      <div class="plan-row">
        <span class="plan-label">Current Plan</span>
        <span class="plan-value">${planName}</span>
      </div>
      <div class="plan-row">
        <span class="plan-label">Expiry Date</span>
        <span class="plan-value danger">${endDate}</span>
      </div>
      <div class="plan-row">
        <span class="plan-label">Your Loyalty Discount</span>
        <span class="plan-value" style="color:#00e5a0;">${discountPercent}% OFF</span>
      </div>
    </div>

    <!-- Promo Code -->
    <div class="promo-box">
      <div class="promo-label">Your exclusive renewal code</div>
      <div class="promo-code">${promoCode}</div>
      <div class="promo-discount">Save ${discountPercent}% on any plan</div>
    </div>

    <!-- CTA -->
    <div class="cta-wrap">
      <a href="${renewUrl}" class="cta-btn">Renew My Subscription →</a>
    </div>

    <!-- How to use -->
    <div class="steps">
      <div class="steps-title">How to use your code</div>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">Click <strong style="color:#fff">Renew My Subscription</strong> above or visit streamtly.com/pricing</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">Choose any subscription plan and proceed to checkout</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">Enter <strong style="color:#00d4ff; font-family:monospace; letter-spacing:2px">${promoCode}</strong> in the promo code field</div>
      </div>
    </div>

    <p style="font-size:12px; color:#555; text-align:center; margin-top:24px;">
      This code expires 30 days from today. One use per account.
    </p>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>
      You received this email because you have an active Streamtly subscription.<br />
      Questions? Contact us at <a href="mailto:support@streamtly.com">support@streamtly.com</a><br />
      © ${new Date().getFullYear()} Streamtly. All rights reserved.
    </p>
  </div>

</div>
</body>
</html>`
}

export function renewalEmailText({
    userName, planName, endDate, promoCode, discountPercent, renewUrl,
}: RenewalEmailParams): string {
    return `Hi ${userName},

Your Streamtly ${planName} subscription expires on ${endDate}.

Renew now and save ${discountPercent}% with your exclusive code:

  ${promoCode}

Visit ${renewUrl} to renew your subscription.

— The Streamtly Team`
}
