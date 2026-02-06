import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Audit Assistant",
  description: "AI-powered RAG assistant for audit and compliance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
