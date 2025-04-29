"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [githubRepo, setGithubRepo] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [teamNames, setTeamNames] = useState({});
  const [submittedEvents, setSubmittedEvents] = useState({});
  const [userEmail, setUserEmail] = useState();

  const email = session?.user?.email || null;
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) {
      router.push("/api/auth/signin?callbackUrl=/Company");
      return;
    }
  
  }, [session, status, router]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/eventjoin?email=${email}`, {
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

        const teamNamesMap = {};
        fetchedEvents.forEach((event) => {
          teamNamesMap[event._id] = event.teamName || "";
        });
        setTeamNames(teamNamesMap);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userEmail]);

  useEffect(() => {
    const githubUrlFromParams = searchParams.get("githuburl");
    const liveUrlFromParams = searchParams.get("liveurl");

    if (githubUrlFromParams)
      setGithubRepo(decodeURIComponent(githubUrlFromParams));

    if (liveUrlFromParams) {
      let formattedLiveUrl = decodeURIComponent(liveUrlFromParams);
      if (!/^https?:\/\//.test(formattedLiveUrl)) {
        formattedLiveUrl = `http://${formattedLiveUrl}`;
      }
      setLiveUrl(formattedLiveUrl);
    }

    const storedSubmittedEvents =
      JSON.parse(localStorage.getItem("submittedEvents")) || {};
    setSubmittedEvents(storedSubmittedEvents);
  }, [searchParams]);

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) return null;
    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Happening Now";
    return "Ended";
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleDeployRedirect = (event) => {
    window.open(`/Deploy?eventId=${event._id}`, "_blank");
  };

  const handleSubmit = async (eventId) => {
    if (!githubRepo || !teamNames[eventId] || !liveUrl) {
      alert("Please fill all fields");
      return;
    }

    try {
      const submittedBy = session?.user?.email;
      if (!submittedBy) {
        alert("User email is missing.");
        return;
      }

      const response = await fetch("/api/submitprojects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          githubRepo,
          teamName: teamNames[eventId],
          liveUrl,
          submittedBy,
        }),
      });

      if (response.ok) {
        setSubmittedEvents((prev) => {
          const updated = { ...prev, [eventId]: true };
          localStorage.setItem("submittedEvents", JSON.stringify(updated));
          return updated;
        });

        alert("Project submitted successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert(
        "There was an error submitting the project. Please try again later."
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {events.length > 0 ? (
        <div className="w-full pt-8">
          <div className="mx-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((event) => getEventStatus(event.startDate, event.endDate))
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
                    selectedEvent={selectedEvent}
                    onEventClick={handleEventClick}
                    githubRepo={githubRepo}
                    liveUrl={liveUrl}
                    teamName={teamNames[event._id] || ""}
                    setGithubRepo={setGithubRepo}
                    setLiveUrl={setLiveUrl}
                    setTeamName={(name) =>
                      setTeamNames((prev) => ({ ...prev, [event._id]: name }))
                    }
                    isSubmitted={submittedEvents[event._id]}
                    handleSubmit={() => handleSubmit(event._id)}
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
      onClick={() => onEventClick(event)}
    >
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
          <p className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {event.description}
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
              onClick={() => handleDeployRedirect(event)}
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Deploy Now
            </button>

            <input
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="GitHub repo link"
            />
            <input
              type="text"
              value={teamName}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
              placeholder="Team Name"
            />
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Live project URL"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Submit Project
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Page;
