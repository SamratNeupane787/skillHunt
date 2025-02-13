"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Clock } from "lucide-react";

export default function AdminEventsPage() {
  const [ads, setAds] = useState([]);
  const currentDate = new Date();
  useEffect(() => {
    async function fetchAds() {
      const res = await fetch("http://localhost:3000/api/ads");
      const data = await res.json();
      setAds(data);
    }
    fetchAds();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className=" flex flex-row items-center justify-between p-6 bg-indigo-600 text-white">
            <div>
              <h1 className="text-3xl font-bold">
                Admin: Ads Created by Users
              </h1>
              <p className="mt-2 text-indigo-100">
                Manage and view all user-created ads
              </p>
            </div>
            <div>
              <button className=" text-white">
                <Link href="/Admin">Go to dashboard</Link>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
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
                  {ads.map((ads, index) => {
                    const eventDate = new Date(ads.date);
                    let status = "Coming Soon";
                    if (eventDate < currentDate) {
                      status = "Completed";
                    } else if (
                      eventDate.toDateString() === currentDate.toDateString()
                    ) {
                      status = "Happening Now";
                    }

                    return (
                      <tr
                        key={ads.id}
                        className={`${
                          index % 2 === 0 ? "bg-indigo-50" : "bg-white"
                        } hover:bg-indigo-100 transition-colors duration-200`}
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">
                            {ads.title}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-gray-700">
                            <CalendarDays className="h-5 w-5 mr-2 text-indigo-500" />
                            {ads.date.substring(0, 10)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-gray-700">
                            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                            {ads.createdBy}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-gray-700">
                            <Clock
                              className={`${
                                ads.status === "active"
                                  ? "text-green-500"
                                  : "text-red-600"
                              } hover:bg-indigo-100 transition-colors duration-200`}
                            />
                            <span className=" ml-3">{ads.status}</span>
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
    </div>
  );
}
