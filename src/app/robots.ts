import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/", "/gate14", "/gate14/"],
      },
    ],
    sitemap: "https://www.chameleon-cheats.tech/sitemap.xml",
  };
}
