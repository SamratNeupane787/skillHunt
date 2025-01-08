"use client";
import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection/Herosection";
import Happening, {
  InfiniteMovingCardsDemo,
} from "./components/Happening/Happening";
import Student from "./components/studentSection/Student";
import Company from "./components/companySection/Company";
import AdPopup from "./components/Adpopup/Adpopup"; // Import the AdPopup component

export default function Home() {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);

  useEffect(() => {
    async function fetchAds() {
      const response = await fetch("/api/ads"); // Fetch ads from your backend
      const data = await response.json();
      if (data && data.ads && data.ads.length > 0) {
        setAds(data.ads); // Store ads in state
        setCurrentAd(data.ads[0]); // Show the most recent ad
      }
    }

    fetchAds();
  }, []);

  const closePopup = () => {
    setCurrentAd(null); // Close the popup when the button is clicked
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16 overflow-hidden">
      {currentAd && <AdPopup adData={currentAd} onClose={closePopup} />}{" "}
      {/* Display the ad popup */}
      <HeroSection />
      <InfiniteMovingCardsDemo />
      <Student />
      <Company />
    </main>
  );
}
