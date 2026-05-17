import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ==========================================
// 🕷️ GLOBAL SEO & METADATA ENGINE
// ==========================================
export const metadata = {
  title: "Pugazhmani K. | Cybersecurity & AI Systems Engineer",
  description: "Professional portfolio of Pugazhmani K. featuring a live Edge WAF, real-time SOC telemetry pipeline, and decentralized AI implementations.",
  keywords: [
    "Pugazhmani K", 
    "Cybersecurity Engineer", 
    "SOC Analyst Portfolio", 
    "AI Systems Developer", 
    "Next.js WAF Middleware", 
    "Wazuh SIEM Monitoring", 
    "Ollama LLM Deployment",
    "Application Security India"
  ],
  authors: [{ name: "Pugazhmani K." }],
  creator: "Pugazhmani K.",
  metadataBase: new URL("https://pugazhmani-profile.vercel.app"),
  
  // OpenGraph tags control how your site looks when shared on LinkedIn / Twitter / Discord
  openGraph: {
    title: "Pugazhmani K. | Cybersecurity & AI Systems Engineer",
    description: "Explore my interactive security operations dashboard, automated edge firewall logs, and local AI tool builds.",
    url: "https://pugazhmani-profile.vercel.app",
    siteName: "Pugazhmani Security Operations Center",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pugazhmani K. | Cybersecurity & AI Systems Engineer",
    description: "Interactive application security intelligence platform and deployment logs.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      {/* We force a dark, industrial aesthetic. 
        bg-neutral-950 is a very deep, rich black/grey perfect for dashboards. 
      */}
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
