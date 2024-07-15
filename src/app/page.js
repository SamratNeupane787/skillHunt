import Image from "next/image";
import HeroSection from "./components/HeroSection/Herosection";
import Happening from "./components/Happening/Happening";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16">
      <HeroSection />
      <Happening />
    </main>
  );
}
