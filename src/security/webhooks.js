// src/security/webhooks.js

export async function triggerThreatWebhook(incidentData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("⚠️ Firewall Warning: DISCORD_WEBHOOK_URL environment variable is missing.");
    return;
  }

  // Structure a clean Discord Rich Embed layout for the mobile/desktop notification
  const payload = {
    embeds: [
      {
        title: `🚨 Firewall Breach Prevented [${incidentData.severity}]`,
        color: incidentData.severity === "CRITICAL" ? 15158332 : 15105570, // Red for critical, orange for high
        fields: [
          { name: "Rule ID", value: `\`${incidentData.rule_id}\``, inline: true },
          { name: "Rule Name", value: incidentData.rule_name, inline: true },
          { name: "Attacker IP", value: `\`${incidentData.ip}\``, inline: true },
          { name: "Target URL", value: `\`${incidentData.url}\`` },
          { name: "User Agent", value: `\`${incidentData.userAgent}\`` }
        ],
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    // Fire the webhook completely asynchronously in the background
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("❌ Failed to forward firewall alert to webhook:", error);
  }
}