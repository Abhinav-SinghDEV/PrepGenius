import type { Metadata } from "next";
import "./globals.css";
import SessionGate from "@/components/SessionGate";

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
      <body>
        <SessionGate>
          {children}
        </SessionGate>
      </body>
    </html>
  );
}