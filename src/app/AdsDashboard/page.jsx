"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api/ads";

export default function AdsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchAds();
    }
  }, [status]);

  async function fetchAds() {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}?createdBy=${session.user.email}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ads");
      }

      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      alert(error.message || "An error occurred while fetching ads.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAd(id) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete ad");
      }

      alert("Ad deleted successfully!");
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error("Error deleting ad:", error);
      alert(error.message || "An error occurred while deleting the ad.");
    }
  }

  async function saveAd() {
    if (!editingAd) return;

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update ad");
      }

      alert("Ad updated successfully!");
      setEditingAd(null);
      fetchAds();
    } catch (error) {
      console.error("Error updating ad:", error);
      alert(error.message || "An error occurred while updating the ad.");
    }
  }

  if (status === "loading") return <p>Loading...</p>;

  if (status !== "authenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Ads</h1>

      {editingAd ? (
        <div>
          <h2 className="text-xl mb-2">Edit Ad</h2>
          <input
            type="text"
            value={editingAd.title}
            onChange={(e) =>
              setEditingAd({ ...editingAd, title: e.target.value })
            }
            className="block w-full mb-2 p-2 border"
            placeholder="Ad Title"
          />
          <textarea
            value={editingAd.description}
            onChange={(e) =>
              setEditingAd({ ...editingAd, description: e.target.value })
            }
            className="block w-full mb-2 p-2 border"
            placeholder="Ad Description"
          />
          <div className="flex gap-2">
            <button
              onClick={saveAd}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingAd(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <p>Loading ads...</p>
          ) : ads?.length > 0 ? (
            ads.map((ad) => (
              <div key={ad._id} className="p-4 border rounded mb-4">
                <h2 className="font-bold text-lg">{ad.title}</h2>
                <p>{ad.description}</p>
                <p>
                  <strong>Location:</strong> {ad.location}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(ad.date).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditingAd(ad)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAd(ad._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
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
