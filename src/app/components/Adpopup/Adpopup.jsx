// components/AdPopup.js
import { useState, useEffect } from 'react';

const AdPopup = ({ adData, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000); // Close after 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{adData.title}</h2>
        <p>{adData.description}</p>
        <img src={adData.imagePath} alt="Ad Image" />
        <p>{adData.location}</p>
        <p>{adData.date}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AdPopup;
