import type { Metadata } from "next";
import { Lora, Great_Vibes, Lato } from "next/font/google";
import { getGoogleVerification } from "@/lib/content";
import "./globals.css";

// TODO: replace with licensed Benton Modern D + Domestic Script woff2 when available.
const display = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const sans = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const googleCode = await getGoogleVerification();
  return {
    metadataBase: new URL("https://balanceandwellness.com"),
    title: {
      default: "Balance and Wellness — massage & bodywork",
      template: "%s · Balance and Wellness — massage & bodywork",
    },
    description:
      "Boutique massage and bodywork by clinical aromatherapist Mukti Panchal. Unhurried, one-guest-at-a-time sessions in Lostock Hall.",
    openGraph: {
      type: "website",
      siteName: "Balance and Wellness",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Balance and Wellness — massage & bodywork",
      description:
        "Boutique massage and bodywork by clinical aromatherapist Mukti Panchal. Unhurried, one-guest-at-a-time sessions in Lostock Hall.",
      images: ["/opengraph-image"],
    },
    icons: {
      icon: "/logo-light.svg",
      apple: "/Balance-2025.-logo.png",
    },
    ...(googleCode ? { verification: { google: googleCode } } : {}),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${sans.variable}`}
    >
      <body className="min-h-screen bg-cream text-teal antialiased">
        {children}
      </body>
    </html>
  );
}
