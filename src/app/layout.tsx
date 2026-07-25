import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Zengo - Premium Japanese Learning Suite",
  description: "The official platform for the Woxsen Japan Centre, connecting students through language learning, events, internships, and community."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          precedence="default"
        />
      </head>
      <body className="theme-zen has-banner">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
