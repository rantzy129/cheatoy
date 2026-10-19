import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chameleon Cheats — Assault Fire PH Chams & Wallhack",
  description:
    "The most reliable, lightweight, and undetected Chams and Wallhack for Assault Fire PH. Instant activation, custom colors, and zero FPS drop.",
  keywords: [
    "Assault Fire PH",
    "Assault Fire Chams",
    "Assault Fire Wallhack",
    "Chameleon Cheats",
    "AF PH ESP",
    "Undetected Chams",
  ],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
