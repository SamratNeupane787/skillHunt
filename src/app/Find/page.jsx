import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Find");
  }

  const getdata = await fetch("http://localhost:3000/api/eventlisted");
  const result = await getdata.json();

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "Upcoming";
    } else if (now >= start && now <= end) {
      return "Happening Now";
    } else {
      return "Ended";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {session?.user?.role === "Github User" ? (
        <div>
          {/* Header Section */}
          <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-10">
            <div className="container mx-auto text-center">
              <h1 className="text-5xl font-bold mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-lg">
                Join exciting hackathons and make memories!
              </p>
            </div>
          </header>

          {/* Event Actions */}
          <div className="flex flex-row items-center justify-center mt-6">
            <h2 className="text-2xl font-semibold mr-4">
              Showing 10 Hackathons:
            </h2>
            <Link href="/Myevents">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md">
                View Joined Events
              </button>
            </Link>
          </div>

          {/* Event Cards */}
          <div className="container mx-auto grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {result
              ?.filter(
                (event) =>
                  !isNaN(new Date(event.startDate)) &&
                  !isNaN(new Date(event.endDate))
              )
              .map((event) => {
                const eventStatus = getEventStatus(
                  event.startDate,
                  event.endDate
                );
                const statusClass =
                  eventStatus === "Happening Now"
                    ? "text-green-600"
                    : eventStatus === "Upcoming"
                    ? "text-blue-600"
                    : "text-red-600";

                return (
                  <div
                    className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition duration-300"
                    key={event._id}
                  >
                    {/* Image */}
                    <div className="flex justify-center mb-4">
                      <Image
                        src="/logo.png"
                        width={120}
                        height={120}
                        alt="Event Image"
                        className="rounded-full"
                      />
                    </div>

                    {/* Event Details */}
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.description}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Organizer:</span>{" "}
                        {event.createdBy}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Start:</span>{" "}
                        {new Date(event.startDate).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">End:</span>{" "}
                        {new Date(event.endDate).toLocaleString()}
                      </p>
                      <p className={`text-sm font-semibold ${statusClass}`}>
                        {eventStatus}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Location:</span>{" "}
                        {event.location}
                      </p>
                    </div>

                    {/* Join Button */}
                    {eventStatus === "Upcoming" ||
                    eventStatus === "Happening Now" ? (
                      <div className="mt-4">
                        <Link href={`/JoinEvent?eventId=${event._id}`}>
                          <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-md">
                            {eventStatus === "Happening Now"
                              ? "Join Now"
                              : "Register"}
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          className="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
                          disabled
                        >
                          Event Ended
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            You must be logged in with GitHub to join events!
          </h1>
        </div>
      )}
    </div>
  );
};

export default page;
