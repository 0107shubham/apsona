"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import RecoilContextProvider from "./Recoil/RecoilContextProvider";
const inter = Inter({ subsets: ["latin"] });
import ProtectedRoute from "./withAuth/page";
const metadata = {
  title: "Note Maker",
  description: "Develped by Shubham Tyagi",
};

const RootLayout = ({ children }) => {
  console.log("rootlauout");
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>{children}</RecoilContextProvider>
      </body>
    </html>
  );
};

export default ProtectedRoute(RootLayout);
