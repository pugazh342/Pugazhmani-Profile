export default async function sitemap() {
  const baseUrl = "https://pugazhmani-profile.vercel.app";

  // Base core application endpoints
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/cli`, lastModified: new Date() },
    { url: `${baseUrl}/sandbox`, lastModified: new Date() },
    { url: `${baseUrl}/blogs`, lastModified: new Date() },
  ];
}
