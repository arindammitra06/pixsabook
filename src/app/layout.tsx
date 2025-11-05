import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import "./globals.css";
import BaseLayout from "@/components/BaseLayout.component";

export const metadata: Metadata = {
  title: "Pixsabook Cloud Albums - Memories for a Lifetime",
  description: "Pixsabook is a cloud photo album service that helps you store, organize, and share your precious memories with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        
      </head>
      <body className="antialiased">
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
