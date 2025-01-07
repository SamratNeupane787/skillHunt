"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CreateAd = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleCreateAd = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !date || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("image", image);
    formData.append("createdBy", userEmail);

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Ad created successfully");
        router.push("/Company");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

  return (
    <form onSubmit={handleCreateAd} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-slate-500 px-8 py-2"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-slate-500 px-8 py-2"
        required
      ></textarea>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border border-slate-500 px-8 py-2"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-slate-500 px-8 py-2"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="border border-slate-500 px-8 py-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Create Ad
      </button>
    </form>
  );
};

export default CreateAd;
