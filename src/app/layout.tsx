import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import Navbar from "@/components/Navbar";
import CompareDock from "@/components/CompareDock";
import { CompareProvider } from "@/context/CompareContext";
export const metadata: Metadata = { title: "Specwise — iPhone technical index", description: "A detailed iPhone specification and comparison database." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><CompareProvider><Navbar />{children}<CompareDock /></CompareProvider></body></html>; }
