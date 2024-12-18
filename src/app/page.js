"use client";
import Image from "next/image";
import HeroSection from "./components/HeroSection/Herosection";

import Happening, {
  InfiniteMovingCardsDemo,
} from "./components/Happening/Happening";
import Student from "./components/studentSection/Student";
import Company from "./components/companySection/Company";
export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16 overflow-hidden">
      <HeroSection />
      <InfiniteMovingCardsDemo />
      <Student />
      <Company />
    </main>
  );
}
