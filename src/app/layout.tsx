import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ==========================================
// 🕷️ STRICTLY TYPED GLOBAL SEO ENGINE
// ==========================================
export const metadata: Metadata = {
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

// ==========================================
// 🛡️ TYPED ROOT LAYOUT
// ==========================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
