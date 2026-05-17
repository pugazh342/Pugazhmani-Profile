import { NextResponse } from 'next/server';

// ==========================================
// 🚨 ACCESS CONTROL LISTS (ACL)
// ==========================================
// Note: Do not put "127.0.0.1" in the Whitelist right now, or you won't be able to test your own WAF locally!
const WHITELIST = ['203.0.113.10']; // IPs that completely bypass the WAF
const BLACKLIST = ['192.168.1.100', '10.0.0.50']; // IPs blocked instantly with zero processing

export async function middleware(request) {
  const url = request.nextUrl;
  
  // Skip static assets to save processing power
  if (url.pathname.startsWith('/_next') || url.pathname.match(/\.(jpeg|jpg|png|gif|svg|ico)$/)) {
    return NextResponse.next();
  }

  const fullPath = decodeURIComponent(url.pathname + url.search);
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "Unknown Device";

  // 1. ACL Check: Whitelist (Bypass everything)
  if (WHITELIST.includes(ip)) {
    return NextResponse.next();
  }

  // 2. ACL Check: Blacklist (Instant Drop)
  if (BLACKLIST.includes(ip)) {
    return new NextResponse(JSON.stringify({ error: "NETWORK_BANNED", message: "Your IP is permanently blacklisted." }), { status: 403 });
  }

  // 3. WAF Threat Signatures
  const threatSignatures = [
    { regex: /(%3C|<)script(%3E|>)/i, type: "XSS (Cross-Site Scripting)" },
    { regex: /UNION.+SELECT/i, type: "SQL Injection (SQLi)" },
    { regex: /(\.\.\/|\.\.\\)/i, type: "Path Traversal (LFI)" },
    { regex: /\.(env|git|bak|sql|php)$/i, type: "Sensitive File Scanner (Honeypot)" },
    { regex: /(wp-admin|phpmyadmin)/i, type: "Admin Panel Scanner (Honeypot)" }
  ];

  // 4. Scan the Request
  for (const signature of threatSignatures) {
    if (signature.regex.test(fullPath)) {
      
      // 5. Threat Detected! Gather Advanced IP Intelligence
      let geoData = { city: "Unknown", country: "Unknown", isp: "Unknown", lat: "0", lon: "0" };
      
      // We only fetch external IP data if it's a real IP (not local dev)
      if (ip !== "127.0.0.1" && ip !== "::1") {
        try {
          const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
          if (geoRes.ok) {
            const parsedGeo = await geoRes.json();
            if (parsedGeo.status === "success") {
              geoData = {
                city: parsedGeo.city,
                country: parsedGeo.country,
                isp: parsedGeo.isp,
                lat: parsedGeo.lat,
                lon: parsedGeo.lon
              };
            }
          }
        } catch (e) {
          console.error("GeoIP Fetch Failed");
        }
      }

      // 6. Construct the Advanced SOC Embed
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      
      if (webhookUrl) {
        const discordAlert = {
          username: "WolfGuard Global WAF",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/2092/2092663.png",
          embeds: [{
            title: "🚨 CRITICAL: Edge Perimeter Breach Prevented",
            description: "A malicious payload was intercepted. IP has been logged for review.",
            color: 0xff0000,
            fields: [
              { name: "Attacker IP", value: `\`${ip}\``, inline: true },
              { name: "Threat Vector", value: `**${signature.type}**`, inline: true },
              { name: "Target URL", value: `\`\`\`text\n${fullPath}\n\`\`\``, inline: false },
              { name: "🌍 Geo-Location", value: `${geoData.city}, ${geoData.country} (Lat: ${geoData.lat}, Lon: ${geoData.lon})`, inline: true },
              { name: "📡 Network/ISP", value: geoData.isp, inline: true },
              { name: "💻 Device Fingerprint", value: `\`\`\`text\n${userAgent}\n\`\`\``, inline: false },
            ],
            footer: { text: "Pugazhmani.SYS Telemetry Stream" },
            timestamp: new Date().toISOString()
          }]
        };

        // Fire webhook
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordAlert),
        });
      }

      // 7. Drop Connection
      return new NextResponse(
        JSON.stringify({ 
          error: "WAF_INTERCEPT", 
          message: "Request flagged as malicious. Telemetry logged." 
        }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};