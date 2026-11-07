import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import { StoreProvider } from "@/components/context/StoreContext";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vibbe Shop - Modern E-commerce Store",
  description: "Vibbe Shop is a modern e-commerce store for gents.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>

        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
        </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
