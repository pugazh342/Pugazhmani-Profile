// src/security/scanner.js
import { FIREWALL_RULES } from './rules';

export function inspectRequest(request) {
  const url = decodeURIComponent(request.url || '');
  const userAgent = request.headers.get('user-agent') || '';
  
  // Combine strings to make a unified text block for fast scanning
  const inspectionPayload = `${url} ${userAgent}`;

  // Evaluate the inbound request metadata against every compiled pattern rule
  for (const rule of FIREWALL_RULES) {
    if (rule.regex.test(inspectionPayload)) {
      return {
        isMalicious: true,
        ruleTriggered: rule.id,
        ruleName: rule.name,
        severity: rule.severity
      };
    }
  }

  return { isMalicious: false };
}