"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [liveUrl, setLiveUrl] = useState(""); // To store the live URL

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/api/auth/signin?callbackUrl=/Company");
      return;
    }

    const fetchEvents = async () => {
      const res = await fetch(`/api/eventjoin?email=${session.user.email}`, {
        cache: "no-store",
      });
      const joinedEvents = await res.json();

      const eventDetailsPromises = joinedEvents.map(async (event) => {
        const eventRes = await fetch(
          `/api/eventlisted?eventId=${event.eventId}`,
          { cache: "no-store" }
        );
        const eventDetails = await eventRes.json();
        return { ...event, ...eventDetails };
      });

      setEvents(await Promise.all(eventDetailsPromises));
    };

    fetchEvents();
  }, [session, status, router]);

  const handleDeploy = () => {
    router.push("/Deploy");
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Happening Now";
    return "Ended";
  };

  // Capture the live URL from the query params when redirected back
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const liveUrlFromParams = urlParams.get("liveUrl");

    if (liveUrlFromParams) {
      setLiveUrl(decodeURIComponent(liveUrlFromParams)); // Set live URL if exists in the query params
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {events.length > 0 ? (
        <div className="w-full pt-8">
          <div className="mx-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter(
                (event) =>
                  !isNaN(new Date(event.startDate)) &&
                  !isNaN(new Date(event.endDate))
              )
              .map((event) => {
                const eventStatus = getEventStatus(
                  event.startDate,
                  event.endDate
                );

                return (
                  <EventCard
                    key={event._id}
                    event={event}
                    eventStatus={eventStatus}
                    userEmail={session.user.email}
                    liveUrl={liveUrl} // Pass liveUrl to EventCard
                  />
                );
              })}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </div>
  );
};

const EventCard = ({ event, eventStatus, userEmail, liveUrl }) => {
  const [githubRepo, setGithubRepo] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the project is submitted
  const router = useRouter();

  const handleSubmit = async () => {
    if (!githubRepo || !teamName || !liveUrl) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/submitprojects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          githubRepo,
          teamName,
          liveUrl,
          submitedBy: userEmail,
        }),
      });

      if (response.ok) {
        alert("Project submitted successfully!");
        setIsSubmitted(true); // Set isSubmitted to true when submission is successful
        setGithubRepo("");
        setTeamName("");
      } else {
        alert("Failed to submit project");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <Image
          src="/placeholder.png"
          alt={event.title || "Event Image"}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4">{event.title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(event.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.location}
          </p>
          <p className="text-xs">
            Organized by: {event.createdBy || "Unknown"}
          </p>
          <p className="text-xs">
            Description: {event.description || "No description"}
          </p>
          <p className="text-xs font-semibold">
            Status:{" "}
            <span
              className={
                eventStatus === "Happening Now"
                  ? "text-green-600"
                  : eventStatus === "Upcoming"
                  ? "text-blue-600"
                  : "text-red-600"
              }
            >
              {eventStatus}
            </span>
          </p>
        </div>

        {eventStatus === "Happening Now" && !isSubmitted && (
          <div className="mt-4">
            <button
              onClick={() => {
                router.push("/Deploy");
              }}
              className="w-full mb-2 bg-gradient-to-r from-red-400 to-blue-500 text-white py-2 rounded-md hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-md"
            >
              Deploy Project
            </button>
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="mb-2 p-2 border rounded-md w-full"
              placeholder="Add GitHub repo link"
            />
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mb-2 p-2 border rounded-md w-full"
              placeholder="Enter Team Name"
            />
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => {}}
              className="mb-2 p-2 border rounded-md w-full"
              placeholder="Live URL"
              disabled
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        )}

        {/* Hide deploy and submit buttons after project is submitted */}
        {isSubmitted && (
          <p className="text-center text-green-500 mt-4">Project Submitted!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;