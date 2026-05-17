// src/security/rules.js

export const FIREWALL_RULES = [
  {
    id: "WOLF-SQLI-001",
    name: "Classic SQL Injection Pattern",
    severity: "CRITICAL",
    // Detects common SQL injection indicators (' OR 1=1, UNION SELECT, comment symbols, etc.)
    regex: /(%27)|(')|(--)|(%23)|(#)|(UNION\s+SELECT|SELECT\s+.*\s+FROM|INSERT\s+INTO|UPDATE\s+.*SET|DELETE\s+FROM)/i
  },
  {
    id: "WOLF-XSS-002",
    name: "Cross-Site Scripting Signature",
    severity: "CRITICAL",
    // Detects script tag injections, html frame modifications, or javascript handlers
    regex: /(<script.*?>)|(<\/script>)|(javascript:)|(onerror\s*=)|(onload\s*=)|(<iframe.*?>)/i
  },
  {
    id: "WOLF-TRAVERSAL-003",
    name: "Directory Path Traversal Attempt",
    severity: "HIGH",
    // Tracks localized file inclusion attacks (e.g., ../../ or system file words)
    regex: /(\.\.\/)|(\.\.\\)|(\/etc\/passwd)|(boot\.ini)/i
  },
  {
    id: "WOLF-BOT-004",
    name: "Malicious Automated Scanner/User-Agent",
    severity: "MEDIUM",
    // Flags common command-line scanning frameworks
    regex: /(nmap|dirbuster|nikto|sqlmap|w3af|acunetix|gobuster)/i
  }
];