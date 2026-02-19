import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthWrapper from "./components/AuthWrapper";
import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LuxeStore | Premium E-Commerce",
  description: "Shop the best products online with style",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 text-gray-900`}
      >
        <AuthProvider>
          <AuthWrapper>
            <ShopProvider>
              <Toaster position="bottom-right" />
              <Header />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </ShopProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
