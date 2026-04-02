import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Aajao - Plan anything. Without the WhatsApp chaos.",
  description: "Plan anything. Without the WhatsApp chaos.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: [
      { url: "/brand/aajao-ball-icon.png", sizes: "32x32", type: "image/png" },
      {
        url: "/brand/aajao-ball-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [{ url: "/brand/aajao-ball-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Aajao - Plan anything. Without the WhatsApp chaos.",
    description: "Plan anything. Without the WhatsApp chaos.",
    siteName: "Aajao",
    type: "website",
    images: [
      {
        url: "/brand/aajao-share-card.png",
        width: 1200,
        height: 1200,
        alt: "Aajao logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aajao - Plan anything. Without the WhatsApp chaos.",
    description: "Plan anything. Without the WhatsApp chaos.",
    images: ["/brand/aajao-share-card.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
}
