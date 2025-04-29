"use client";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import Link from "next/link";
export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const currentDate = new Date();

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("http://localhost:3000/api/eventlisted");
      const data = await res.json();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className=" flex flex-row items-center justify-between p-6 bg-indigo-600 text-white">
            <div>
              <h1 className="text-3xl font-bold">Admin: User Events</h1>
              <p className="mt-2 text-indigo-100">
                Manage and view all user-created events
              </p>
            </div>
            <div>
              <button className=" text-white">
                <Link href="/Admin">Go to dashboard</Link>
              </button>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-indigo-200">
                  <th className="py-3 px-4 font-semibold text-indigo-600">
                    Event
                  </th>
                  <th className="py-3 px-4 font-semibold text-indigo-600">
                    Date
                  </th>
                  <th className="py-3 px-4 font-semibold text-indigo-600">
                    Location
                  </th>
                  <th className="py-3 px-4 font-semibold text-indigo-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => {
                  const eventDate = event.startDate
                  let status = "Coming Soon";
                  if (eventDate < currentDate) {
                    status = "Completed";
                  } else if (eventDate === currentDate.toDateString()) {
                    status = "Happening Now";
                  }

                  return (
                    <tr
                      key={event.id}
                      className={`${
                        index % 2 === 0 ? "bg-indigo-50" : "bg-white"
                      } hover:bg-indigo-100 transition-colors duration-200`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">
                          {event.title}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-700">
                          <CalendarDays className="h-5 w-5 mr-2 text-indigo-500" />
                          {event.createdAt}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                          {event.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                          {status}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
