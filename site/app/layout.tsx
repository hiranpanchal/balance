import type { Metadata } from "next";
import { Lora, Great_Vibes, Lato } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://balanceandwellness.com"),
  title: {
    default: "Balance and Wellness — massage & bodywork",
    template: "%s · Balance and Wellness — massage & bodywork",
  },
  description:
    "Boutique massage and bodywork in Bristol by clinical aromatherapist Mukti Panchal. Unhurried, one-guest-at-a-time sessions.",
  openGraph: {
    type: "website",
    siteName: "Balance and Wellness",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

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
