import Image from "next/image";
import { useState, useEffect } from "react";

const AdPopup = ({ adData, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 70000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg h-auto w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>
        <Image
          src={adData.imagePath}
          alt="Ad"
          className="w-full h-auto rounded-md mb-4"
        />
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {adData.title}
          </h2>
          <button
            className=" bg-red-500 p-2 rounded-full text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-gray-600 mb-4">{adData.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Location:</strong> {adData.location}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong> {adData.date.substring(0, 10)}
        </p>
      </div>
    </div>
  );
};

export default AdPopup;
