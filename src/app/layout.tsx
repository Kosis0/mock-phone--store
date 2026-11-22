import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import Navbar from "@/components/Navbar";
import CompareDock from "@/components/CompareDock";
import Footer from "@/components/Footer";
import { CompareProvider } from "@/context/CompareContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Specwise — The Complete iPhone Technical Index (2019–2026)",
  description:
    "Verified specifications, studio hardware photography, regional model identifiers, and side-by-side comparisons for all 34 iPhone models from iPhone 11 to iPhone 18 Pro Max and iPhone Duo.",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('specwise-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <CompareProvider>
            <Navbar />
            {children}
            <Footer />
            <CompareDock />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
