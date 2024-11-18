import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { UserProvider } from "@/app/context/usercontext"
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "WatchList",
  description: "Helping you decide your next watch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body
        className={`bg-lessBlack`}
      >
        <Toaster position="top-center" reverseOrder={false} />
        <UserProvider>
          <Navbar/>
          {children}
          <Footer/>
        </UserProvider>
      </body>
    </html>
  );
}