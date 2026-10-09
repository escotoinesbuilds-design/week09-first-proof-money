import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First-Proof Funding Dashboard",
  description:
    "A fictional pilot dashboard for reviewing verified paid-start outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
