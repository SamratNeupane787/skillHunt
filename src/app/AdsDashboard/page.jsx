"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAds();
    }
  }, [status]);

  async function fetchAds() {
    try {
      const response = await fetch(`/api/ads?createdBy=${session.user.email}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  }

  async function deleteAd(id) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      const response = await fetch(`/api/ads?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        alert("Ad deleted successfully!");
        setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  }

  async function saveAd() {
    try {
      const response = await fetch(`/api/ads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAd),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Ad updated successfully!");
        setEditingAd(null);
        fetchAds();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating ad:", error);
    }
  }

  if (status === "loading") return <p>Loading...</p>;

  if (status !== "authenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Ads</h1>

      {editingAd ? (
        <div>
          <h2>Edit Ad</h2>
          <input
            type="text"
            value={editingAd.title}
            onChange={(e) =>
              setEditingAd({ ...editingAd, title: e.target.value })
            }
          />
          <textarea
            value={editingAd.description}
            onChange={(e) =>
              setEditingAd({ ...editingAd, description: e.target.value })
            }
          ></textarea>
          {/* Add fields for date, location, and image */}
          <button onClick={saveAd}>Save</button>
          <button onClick={() => setEditingAd(null)}>Cancel</button>
        </div>
      ) : (
        <div>
          {ads?.length > 0 ? (
            ads?.map((ad) => (
              <div key={ad._id} className="p-4 border rounded mb-4">
                <h2 className="font-bold">{ad.title}</h2>
                <p>{ad.description}</p>
                <p>Location: {ad.location}</p>
                <p>Date: {ad.date}</p>
                <button onClick={() => setEditingAd(ad)}>Edit</button>
                <button onClick={() => deleteAd(ad._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No ads found.</p>
          )}
        </div>
      )}
    </div>
  );
}
