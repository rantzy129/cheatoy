import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chameleon-cheats.vercel.app"),
  title: {
    default: "Assault Fire Cheat & Wallhack — Undetected AFPH Chams, Health & 2D Box | Chameleon",
    template: "%s | Chameleon Cheats",
  },
  description:
    "The #1 undetected Assault Fire cheat and wallhack for AFPH. Chameleon VIP provides direct-memory Wallhack, Chams, real-time Health ESP, dynamic 2D Box, and full in-game menu control toggled by [INSERT].",
  keywords: [
    "assault fire cheat",
    "assault fire wallhack",
    "assault fire cheats",
    "assault fire ph cheat",
    "assault fire ph wallhack",
    "assault fire chams",
    "assault fire esp",
    "assault fire health esp",
    "assault fire 2d box",
    "assault fire menu insert",
    "assault fire ph chams",
    "af ph wallhack",
    "af ph cheat",
    "assault fire hack",
    "assault fire reborn cheat",
    "chameleon cheats",
    "undetected assault fire cheat",
    "assault fire philippines cheat",
  ],
  authors: [{ name: "Chameleon Cheats" }],
  creator: "Chameleon Cheats",
  publisher: "Chameleon Cheats",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Assault Fire Cheat & Wallhack (AFPH) — Chameleon VIP Suite",
    description:
      "Dominate Assault Fire PH with Chameleon VIP. 100% Undetected Wallhack, customizable Chams, real-time Health ESP, dynamic 2D Box, and interactive in-game menu with [INSERT].",
    url: "https://chameleon-cheats.vercel.app",
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
    title: "Assault Fire Cheat & Wallhack — Chameleon VIP",
    description: "Undetected Assault Fire PH Wallhack, Chams, Health ESP, and 2D Box with [INSERT] in-game menu.",
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
      lowPrice: "500",
      highPrice: "2500",
      offerCount: "4",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
      worstRating: "1",
    },
    description:
      "Premier undetected Assault Fire cheat and wallhack. Features direct-memory Wallhack, customizable player Chams, real-time Health ESP, dynamic 2D Box hitboxes, and an interactive in-game menu toggled by INSERT.",
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best Assault Fire cheat and wallhack?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chameleon VIP is the premier undetected Assault Fire cheat and wallhack for Assault Fire PH. It provides direct-memory Wallhack, dual-tone Chams, real-time Health ESP, dynamic 2D Box hitboxes, zero FPS drop, and full in-game menu control toggled by pressing INSERT.",
        },
      },
      {
        "@type": "Question",
        name: "How do I control the cheat modules in-game?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Press the INSERT key on your keyboard while in-game to toggle the floating VIP menu overlay. From there, you have complete control to toggle Wallhack, Chams, Health bars, and 2D Box indicators in real time.",
        },
      },
      {
        "@type": "Question",
        name: "Is this Assault Fire wallhack undetected?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Chameleon VIP uses external memory virtualization without modifying core game files, keeping it 100% undetected by the official Assault Fire PH anti-cheat.",
        },
      },
      {
        "@type": "Question",
        name: "How do I download and activate the Assault Fire cheat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Log in with your Discord account, choose your VIP pass (7 Days, 15 Days, 1 Month, or Lifetime), pay via GCash QR Ph, and your license key will be instantly activated in your profile.",
        },
      },
    ],
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
        {/* Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
