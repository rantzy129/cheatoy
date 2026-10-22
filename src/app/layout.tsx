import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070a10",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chameleon-cheats.tech"),
  title: {
    default: "Assault Fire PH Cheat, Wallhack & Aimbot | Chameleon",
    template: "%s | Chameleon Cheats",
  },
  description:
    "Explore Chameleon VIP for Assault Fire PH and Legacy: wallhack, chams, ESP, aimbot options, supported clients, setup details, and current plans.",
  authors: [{ name: "Chameleon Cheats" }],
  creator: "Chameleon Cheats",
  publisher: "Chameleon Cheats",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Assault Fire PH Cheat, Wallhack & Aimbot | Chameleon",
    description:
      "Chameleon VIP for Assault Fire PH and Legacy includes wallhack, player chams, health ESP, 2D boxes, and aimbot options. Check compatibility, setup, and plans.",
    url: "https://www.chameleon-cheats.tech",
    siteName: "Chameleon Cheats",
    images: [
      {
        url: "/proof.png",
        width: 1200,
        height: 630,
        alt: "Assault Fire Cheat Wallhack Proof Chameleon",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assault Fire PH Cheat, Wallhack & Aimbot | Chameleon",
    description: "Chameleon VIP for Assault Fire PH and Legacy: wallhack, player chams, ESP, aimbot options, compatibility, setup, and plans.",
    images: ["/proof.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "nCZr_L9KnBbgzvQC8tODSj8xZnlOaZS2hKwyCkFwox0",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Chameleon VIP - Assault Fire Cheat & Wallhack",
    operatingSystem: "Windows 10, Windows 11 (64-bit)",
    applicationCategory: "GameApplication",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PHP",
      lowPrice: "150",
      highPrice: "1000",
      offerCount: "5",
      availability: "https://schema.org/InStock",
    },
    description:
      "Windows loader for supported Assault Fire PH and Legacy clients, with wallhack, player chams, health ESP, 2D boxes, aimbot options, and an in-game menu.",
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="nCZr_L9KnBbgzvQC8tODSj8xZnlOaZS2hKwyCkFwox0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Structured data for the software listing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
