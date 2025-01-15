"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const JoinEventPage = () => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [eventId, setEventId] = useState(null);
  const { data: session } = useSession();

  const userEmail = session?.user?.email;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdParam = urlParams.get("eventId");
    setEventId(eventIdParam);

    if (eventIdParam) {
      const fetchEventData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/eventlisted?eventId=${eventIdParam}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch event data");
          }
          const data = await response.json();
          console.log(data);
          setEventData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }
  }, []);

  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/eventjoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.email,
          eventId,
          teamName,
          eventTitle: eventData?.title,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Event joined successfully:", result.message);
        alert("Event joined successfully");
        router.push("/Find");
      } else {
        alert(result.message || "Failed to join event");
      }
    } catch (err) {
      console.error("An error occurred. Please try again.", err);
    }
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="  h-screen">
      <h1 className="text-3xl font-semibold text-center pt-6">
        Join {eventData?.title}
      </h1>
      {eventData ? (
        <div className="text-center grid grid-cols-2 place-items-center gap-4 pt-8">
          <div className="grid gap-6">
            <h1 className="text-2xl font-serif">Event details</h1>
            <p className="tracking-normal text-xl">
              Description: {eventData.description}
            </p>
            <p className="tracking-normal text-xl">
              Location: {eventData.location}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Starting from:</span>{" "}
              {new Date(eventData.startDate).toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Ending At:</span>{" "}
              {new Date(eventData.endDate).toLocaleString()}
            </p>
          </div>
          <div className="max-w-md w-full mx-auto p-6 space-y-6 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center">
              Team Registration
            </h2>
            <div className="space-y-2 flex flex-col items-center justify-center">
              <label className="text-lg font-medium">Team name</label>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="px-3 h-[2.8rem] border-gray-400 rounded-lg border-2"
                placeholder="Enter your team name"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col items-center justify-center">
              <label className="text-lg font-medium">Email</label>
              <input
                value={userEmail}
                className="px-3 h-[2.8rem] border-gray-400 rounded-lg border-2"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="w-1/2 rounded-lg bg-blue-600 h-[2.3rem] text-white"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <p>No event data available.</p>
      )}
    </div>
  );
};

export default JoinEventPage;
