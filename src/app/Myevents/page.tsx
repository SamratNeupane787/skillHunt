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
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected event
  const [githubRepo, setGithubRepo] = useState(""); // GitHub URL
  const [liveUrl, setLiveUrl] = useState(""); // Live URL
  const [teamName, setTeamName] = useState(""); // Team Name
  const [submittedEvents, setSubmittedEvents] = useState({}); // Track submission for each event

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
    };

    fetchEvents();
  }, [session, status, router]);

  useEffect(() => {
    const githubUrlFromParams = searchParams.get("githuburl");
    const liveUrlFromParams = searchParams.get("liveurl");

    if (githubUrlFromParams && liveUrlFromParams) {
      setGithubRepo(decodeURIComponent(githubUrlFromParams));
      setLiveUrl(decodeURIComponent(liveUrlFromParams));
    }

    // Load previously submitted events from localStorage
    const storedSubmittedEvents =
      JSON.parse(localStorage.getItem("submittedEvents")) || {};
    setSubmittedEvents(storedSubmittedEvents);
  }, [searchParams]);

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Happening Now";
    return "Ended";
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set selected event when the card is clicked
  };

  const handleDeployRedirect = (event) => {
    window.open(`/Deploy?eventId=${event._id}`, "_blank");
  };

  const handleSubmit = async (eventId) => {
    if (!githubRepo || !teamName || !liveUrl) {
      alert("Please fill all fields");
      return;
    }

    // Mark the event as submitted
    setSubmittedEvents((prev) => {
      const updated = { ...prev, [eventId]: true };

      // Persist the submission status in localStorage
      localStorage.setItem("submittedEvents", JSON.stringify(updated));

      return updated;
    });
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
                  selectedEvent={selectedEvent}
                  onEventClick={handleEventClick} // Event card click handler
                  githubRepo={githubRepo}
                  liveUrl={liveUrl}
                  teamName={teamName}
                  setGithubRepo={setGithubRepo}
                  setLiveUrl={setLiveUrl}
                  setTeamName={setTeamName}
                  isSubmitted={submittedEvents[event._id]} // Check if event is submitted
                  handleSubmit={() => handleSubmit(event._id)} // Pass eventId to handle submission
                  handleDeployRedirect={handleDeployRedirect}
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
  selectedEvent,
  onEventClick,
  githubRepo,
  liveUrl,
  teamName,
  setGithubRepo,
  setLiveUrl,
  setTeamName,
  isSubmitted,
  handleSubmit,
  handleDeployRedirect,
}) => {
  const isSelected = selectedEvent?._id === event._id;

  return (
    <Card
      className="overflow-hidden shadow-lg transition-shadow cursor-pointer"
      onClick={() => onEventClick(event)} // Trigger the event selection
    >
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

        {isSelected && eventStatus === "Happening Now" && !isSubmitted && (
          <div className="mt-4 space-y-4">
            <button
              onClick={() => handleDeployRedirect(event)} // Open /Deploy page in new tab
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-md transition duration-300 shadow-md hover:from-blue-600 hover:to-green-600"
            >
              Deploy Now
            </button>
          </div>
        )}

        {isSelected && eventStatus === "Happening Now" && !isSubmitted && (
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="GitHub repo link"
            />
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Team Name"
            />
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Live project URL"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md transition duration-300 shadow-md hover:from-green-500 hover:to-blue-600"
            >
              Submit Project
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
