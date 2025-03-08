import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LateralGPT - AI-Powered Talent Search",
  description:
    "Find the perfect candidates for your team with LateralGPT, an AI-powered talent search platform that helps you discover qualified professionals based on your specific requirements.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
