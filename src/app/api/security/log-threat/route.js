// src/app/api/security/log-threat/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';

export async function POST(request) {
  try {
    // Parse the incoming threat payload from the firewall
    const incidentData = await request.json();

    if (!incidentData || !incidentData.ip) {
      return NextResponse.json({ error: "Invalid payload format." }, { status: 400 });
    }

    // 1. Log the full threat event to the 'threat_logs' collection for your dashboard charts
    await adminDb.collection('threat_logs').add({
      ...incidentData,
      timestamp: new Date().toISOString(),
      status: 'BLOCKED_BY_FIREWALL'
    });

    // 2. Add the attacker's IP directly to the active 'ip_blacklist'
    await adminDb.collection('ip_blacklist').doc(incidentData.ip).set({
      ip: incidentData.ip,
      reason: incidentData.rule_name,
      severity: incidentData.severity,
      banned_at: new Date().toISOString(),
      active: true
    });

    return NextResponse.json({ success: true, message: "Threat successfully recorded to SOC database." });

  } catch (error) {
    console.error("❌ Firebase Database Write Error:", error);
    return NextResponse.json({ error: "Failed to log threat to database." }, { status: 500 });
  }
}