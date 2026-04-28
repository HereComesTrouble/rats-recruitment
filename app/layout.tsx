import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R.A.T.S. | Raiders' Authority on Temporary Storage",
  description:
    "A tongue-in-cheek ARC Raiders outfit providing inventory management services through decisive field audits.",
  openGraph: {
    title: "R.A.T.S. | Inventory Management for ARC Raiders",
    description:
      "Join the Raiders' Authority on Temporary Storage and help fellow raiders rediscover stash space.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
