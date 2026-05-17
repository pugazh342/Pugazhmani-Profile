// src/security/webhooks.js

export async function triggerThreatWebhook(incidentData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  // 1. Dispatch the Discord Alert (If configured)
  if (webhookUrl && webhookUrl.startsWith("http")) {
    const payload = {
      embeds: [{
        title: `🚨 Firewall Breach Prevented [${incidentData.severity}]`,
        color: incidentData.severity === "CRITICAL" ? 15158332 : 15105570,
        fields: [
          { name: "Rule ID", value: `\`${incidentData.rule_id}\``, inline: true },
          { name: "Attacker IP", value: `\`${incidentData.ip}\``, inline: true },
          { name: "Target URL", value: `\`${incidentData.url}\`` }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Discord Webhook Error:", err));
  }

  // 2. Fire the threat data to our internal Next.js API to log it into Firebase Database
  try {
    // Note: In production, you'll want to use an absolute URL here based on the environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/security/log-threat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incidentData)
    });
  } catch (dbError) {
    console.error("Internal Database Logging Error:", dbError);
  }
}