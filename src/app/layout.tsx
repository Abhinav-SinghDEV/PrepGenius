import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepGenius",
  description: "Welcome to PrepGenius",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}