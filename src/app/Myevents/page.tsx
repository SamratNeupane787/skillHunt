"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState([]);
  const [liveUrl, setLiveUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOngoingEvent, setHasOngoingEvent] = useState(false); // New state to track ongoing event

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
          {
            cache: "no-store",
          }
        );
        const eventDetails = await eventRes.json();
        return { ...event, ...eventDetails };
      });

      const fetchedEvents = await Promise.all(eventDetailsPromises);
      setEvents(fetchedEvents);

      // Check if any event is "Happening Now" for this user
      const hasActiveEvent = fetchedEvents.some(
        (event) =>
          getEventStatus(event.startDate, event.endDate) === "Happening Now"
      );
      setHasOngoingEvent(hasActiveEvent);
    };

    fetchEvents();
  }, [session, status, router]);

  useEffect(() => {
    const liveUrlFromParams = searchParams.get("liveUrl");
    if (liveUrlFromParams) {
      setLiveUrl(decodeURIComponent(liveUrlFromParams));
    }
  }, [searchParams]);

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Happening Now";
    return "Ended";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {events.length > 0 ? (
        <div className="w-full pt-8">
          <div className="mx-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
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
                  liveUrl={liveUrl}
                  setLoading={setLoading}
                  loading={loading}
                  hasOngoingEvent={hasOngoingEvent} // Pass new state
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

const EventCard = ({
  event,
  eventStatus,
  userEmail,
  liveUrl,
  setLoading,
  loading,
  hasOngoingEvent,
}) => {
  const [githubRepo, setGithubRepo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (eventId) => {
    if (!githubRepo || !event.teamName || !liveUrl) {
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
          eventId,
          githubRepo,
          teamName: event.teamName,
          liveUrl,
          submitedBy: userEmail,
        }),
      });

      if (response.ok) {
        alert("Project submitted successfully!");
        setIsSubmitted(true);
        setGithubRepo("");
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
    <Card className="overflow-hidden shadow-lg transition-shadow">
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

        {/* Only allow project submission if user has no other ongoing event */}
        {eventStatus === "Happening Now" && !isSubmitted && (
          <div className="mt-4">
            <button
              onClick={() =>
                router.push(
                  `/Deploy?githuburl=${encodeURIComponent(githubRepo)}`
                )
              }
              className={`w-full mb-2 bg-gradient-to-r from-red-400 to-blue-500 text-white py-2 rounded-md 
              transition duration-300 shadow-md ${
                hasOngoingEvent
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-green-500 hover:to-blue-600"
              }`}
              disabled={hasOngoingEvent}
            >
              Deploy Project
            </button>

            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="mb-2 p-2 border rounded-md w-full"
              placeholder="GitHub repo link"
              disabled={hasOngoingEvent}
            />

            <button
              onClick={() => handleSubmit(event._id)}
              className={`w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md transition duration-300 shadow-md
              ${
                loading || hasOngoingEvent
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-green-500 hover:to-blue-600"
              }`}
              disabled={loading || hasOngoingEvent}
            >
              {loading ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        )}

        {isSubmitted && (
          <p className="text-center text-green-500 mt-4">Project Submitted!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
