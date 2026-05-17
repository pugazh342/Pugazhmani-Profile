import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pugazhmani | Security Engineering & AI",
  description: "Advanced Portfolio & Unified Security Platform. Protected by custom edge firewalls.",
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