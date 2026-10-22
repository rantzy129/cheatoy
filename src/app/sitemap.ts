import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.chameleon-cheats.tech";
  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
