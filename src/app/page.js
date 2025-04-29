"use client";
import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection/Herosection";
import Happening, {
  InfiniteMovingCardsDemo,
} from "./components/Happening/Happening";
import Student from "./components/studentSection/Student";
import Company from "./components/companySection/Company";
import AdPopup from "./components/Adpopup/Adpopup";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);

  useEffect(() => {
    async function fetchAds() {
      try {
        const response = await fetch("/api/ads");
        if (!response.ok) throw new Error("Failed to fetch ads");

        const data = await response.json();
        console.log("Fetched Ads:", data);

        // ✅ Only include ads that are active
        const activeAds = data.filter((ad) => ad.status === "active");

        if (activeAds.length > 0) {
          setAds(activeAds);
          const randomAd =
            activeAds[Math.floor(Math.random() * activeAds.length)];
          setCurrentAd(randomAd);
        } else {
          setCurrentAd(null);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    }

    fetchAds();
  }, []);

  const closePopup = () => {
    setCurrentAd(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16 overflow-hidden">
      {currentAd && <AdPopup adData={currentAd} onClose={closePopup} />}
      <HeroSection />
      <InfiniteMovingCardsDemo />
      <Student />
      <Company />
    </main>
  );
}
