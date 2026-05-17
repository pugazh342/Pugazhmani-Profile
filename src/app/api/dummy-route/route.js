// src/app/api/dummy-route/route.js
import { NextResponse } from "next/server";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "@/config/firebase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const payload = searchParams.get("payload") || "Unknown Command";
  
  // Extract user IP (Next.js provides this in headers in production)
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    // 1. Log to Firebase Realtime Database
    const rtdb = getDatabase(app);
    const logsRef = ref(rtdb, "threat_logs");
    await push(logsRef, {
      payload: payload,
      ip: ip,
      rule_id: "WOLF-WAF-01",
      severity: "CRITICAL",
      timestamp: new Date().toISOString(),
      action: "DROPPED"
    });

    // 2. Transmit Alert to Discord via Webhook
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (webhookUrl) {
      const discordAlert = {
        username: "WolfGuard Sentinel",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png", // Cool shield icon
        embeds: [
          {
            title: "🚨 WAF Intercept Alert",
            description: "Unauthorized payload execution attempted on edge perimeter.",
            color: 0xff0000, // Hex for Red
            fields: [
              { name: "Source IP", value: `\`${ip}\``, inline: true },
              { name: "Severity", value: "CRITICAL", inline: true },
              { name: "Payload Intercepted", value: `\`\`\`bash\n${payload}\n\`\`\``, inline: false },
              { name: "Action Taken", value: "Connection Dropped & Logged", inline: false }
            ],
            footer: { text: "Pugazhmani.SYS Telemetry Stream" },
            timestamp: new Date().toISOString()
          }
        ]
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordAlert),
      });
    }

    return NextResponse.json({ status: "BLOCKED", message: "Payload intercepted and reported to SOC." });
  } catch (error) {
    console.error("Alert Pipeline Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}