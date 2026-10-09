import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Small Things Lab", description: "Small, useful browser tools for study and experiments." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant"><body>{children}</body></html>; }
