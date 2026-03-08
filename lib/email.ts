import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "SwayMaps <noreply@swaymaps.com>";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to SwayMaps - Map your first dependency in 2 minutes",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">Welcome to SwayMaps, ${name}!</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          You just joined the fastest way to map dependencies across your systems, teams, and processes.
        </p>
        <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0 0 12px;">Get started in 3 steps:</h2>
        <ol style="font-size: 15px; color: #475569; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
          <li>Pick a template (Microservice Map, Org Chart, Data Flow...)</li>
          <li>Add your systems and connections</li>
          <li>Share with your team</li>
        </ol>
        <a href="${process.env.NEXTAUTH_URL || 'https://app.swaymaps.com'}"
           style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Create Your First Map
        </a>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          Need help? Reply to this email or visit our docs.
        </p>
      </div>
    `,
  });
}

export async function sendTrialReminderEmail(to: string, name: string, daysLeft: number) {
  if (!process.env.RESEND_API_KEY) return;

  const subject = daysLeft <= 2
    ? `${daysLeft} days left on your SwayMaps trial`
    : `Your SwayMaps trial: ${daysLeft} days remaining`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">
          ${daysLeft <= 2 ? 'Your trial is ending soon' : `${daysLeft} days left on your trial`}
        </h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px;">
          Hi ${name}, your SwayMaps Pro trial has ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining.
        </p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          ${daysLeft <= 2
            ? 'Add a payment method to keep your Pro features - your maps and data are safe either way.'
            : 'Make the most of your remaining trial days. Here\'s what you can try:'
          }
        </p>
        ${daysLeft > 2 ? `
        <ul style="font-size: 15px; color: #475569; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
          <li>AI-powered map generation</li>
          <li>Export maps as PNG/SVG/PDF</li>
          <li>Share maps with public links</li>
        </ul>
        ` : ''}
        <a href="${process.env.NEXTAUTH_URL || 'https://app.swaymaps.com'}"
           style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          ${daysLeft <= 2 ? 'Add Payment Method' : 'Open SwayMaps'}
        </a>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          Questions? Just reply to this email.
        </p>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Action needed: Update your SwayMaps payment method",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">Payment update needed</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px;">
          Hi ${name}, we couldn't process your latest SwayMaps payment.
        </p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          Please update your payment method within 7 days to keep your Pro/Team features active. Your maps and data are safe - you won't lose anything.
        </p>
        <a href="${process.env.NEXTAUTH_URL || 'https://app.swaymaps.com'}/?billing=true"
           style="display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: white; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Update Payment Method
        </a>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          Need help? Reply to this email and we'll sort it out.
        </p>
      </div>
    `,
  });
}

export async function sendCancellationEmail(to: string, name: string, accessUntil: Date) {
  if (!process.env.RESEND_API_KEY) return;

  const dateStr = accessUntil.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Your SwayMaps subscription has been canceled",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">We're sorry to see you go</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px;">
          Hi ${name}, your SwayMaps subscription has been canceled.
        </p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 16px;">
          You'll continue to have access to your Pro/Team features until <strong>${dateStr}</strong>. After that, your account will switch to the Free plan.
        </p>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          Your maps and data will always be safe - nothing gets deleted. You can resubscribe anytime.
        </p>
        <a href="${process.env.NEXTAUTH_URL || 'https://app.swaymaps.com'}"
           style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Resubscribe
        </a>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          Mind sharing why you canceled? Reply to this email - your feedback helps us improve.
        </p>
      </div>
    `,
  });
}

export async function sendInviteEmail(to: string, inviterName: string, workspaceName: string, inviteUrl: string) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${inviterName} invited you to ${workspaceName} on SwayMaps`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a; margin: 0 0 16px;">You've been invited!</h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
          ${inviterName} invited you to join the <strong>${workspaceName}</strong> workspace on SwayMaps - the visual dependency mapping platform.
        </p>
        <a href="${inviteUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
          Accept Invite
        </a>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
          This invite expires in 7 days. If you didn't expect this, you can ignore this email.
        </p>
      </div>
    `,
  });
}
