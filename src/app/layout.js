import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../app/components/navbar/Navabar.jsx";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SkillHunt",
  description: "Where talent meets opportunities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
