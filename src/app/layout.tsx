import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daivajna Samaja — Community Portal",
  description: "Preserving our Roots, Nurturing our Future. The official digital sanctuary for the Daivajna Samaja community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
