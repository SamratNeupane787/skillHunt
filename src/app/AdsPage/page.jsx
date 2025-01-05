"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const CreatEvent = () => {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [createdBy, setcreatedBy] = useState("");

  const router = useRouter();
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !date) {
      alert("fill all the area");
      return;
    }
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          createdBy: session?.user?.name,
          location,
          date,
        }),
      });
      if (res.ok) {
        router.push("/Company");
      } else {
        throw new Error("failed to create event");
      }
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <div>
      <form onSubmit={handleCreateEvent} className=" flex flex-col gap-3">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="border border-slate-500 px-8 py-2"
          placeholder="Title"
        />
        <input
          onChange={(e) => setdescription(e.target.value)}
          value={description}
          className="border border-slate-500 px-8 py-2"
          placeholder="description"
        />

        <input
          onChange={(e) => setDate(e.target.value)}
          value={date}
          className="border border-slate-500 px-8 py-2"
          placeholder="date"
        />
        <input
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          className="border border-slate-500 px-8 py-2"
          placeholder="Location"
        />
        <input
          onChange={(e) => setcreatedBy(e.target.value)}
          value={createdBy || username}
          className="border border-slate-500 px-8 py-2"
          placeholder={`${username}`}
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreatEvent;
