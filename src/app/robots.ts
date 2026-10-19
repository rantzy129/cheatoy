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
    sitemap: "https://chameleon-cheats.vercel.app/sitemap.xml",
  };
}
