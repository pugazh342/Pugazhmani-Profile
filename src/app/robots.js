export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/cli", "/sandbox", "/blogs"],
      disallow: ["/admin/", "/api/auth/"], // Defensive measure: hides CMS configurations from public search bots
    },
    sitemap: "https://pugazhmani-profile.vercel.app/sitemap.xml",
  };
}
