import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "./sw-register";

export const metadata: Metadata = { title: "Small Things Lab", description: "Small, useful browser tools for study and experiments.", manifest: "./manifest.webmanifest" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant"><body>{children}<ServiceWorkerRegistration /></body></html>; }
