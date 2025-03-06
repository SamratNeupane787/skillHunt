"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "../components/AdminSidebar/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function AdminDashboard() {
  const [ads, setAds] = useState([]);
  const [events, setEvents] = useState([]);
  const { data: session } = useSession();

  console.log(session);

  const router = useRouter();

  // useEffect(() => {
  //   if (email !== "samrat.neupane17013@gmail.com") {
  //     router.push("/");
  //   }
  // }, [session, router]);

  // if (!session || session.email !== "samrat.neupane17013@gmail.com") {
  //   return null; // Prevents flickering before redirect
  // }

  useEffect(() => {
    async function fetchAds() {
      try {
        const response = await fetch("http://localhost:3000/api/ads");
        if (!response.ok) throw new Error("Failed to fetch ads");
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    }

    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:3000/api/eventlisted");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchAds();
    fetchEvents();
  }, []);

  return (
    <div className="flex h-screen bg-blue-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-blue-600 flex justify-between items-center px-6 py-4">
              <CardTitle className="text-white">Recent Ads</CardTitle>
              <button
                className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
                onClick={() => (window.location.href = "/Admin/ads")}
              >
                View All
              </button>
            </CardHeader>
            <CardContent>
              {ads.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-blue-800">Title</TableHead>
                      <TableHead className="text-blue-800">User</TableHead>
                      <TableHead className="text-blue-800">
                        Created At
                      </TableHead>
                      <TableHead className="text-blue-800">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.slice(0, 5).map((ad) => (
                      <TableRow key={ad.id} className="hover:bg-blue-50">
                        <TableCell className="text-blue-700 font-medium">
                          {ad.title}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {ad.createdBy}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {ad.createdAt}
                        </TableCell>
                        <TableCell className="text-green-600">
                          {ad.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No ads available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-blue-600 flex justify-between items-center px-6 py-4">
              <CardTitle className="text-white">Recent Events</CardTitle>
              <button
                className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
                onClick={() => (window.location.href = "/Admin/hackathon")}
              >
                View All
              </button>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-blue-800">Title</TableHead>
                      <TableHead className="text-blue-800">User</TableHead>
                      <TableHead className="text-blue-800">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, 5).map((event) => (
                      <TableRow key={event.id} className="hover:bg-blue-50">
                        <TableCell className="text-blue-700 font-medium">
                          {event.title}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {event.createdBy}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {event.createdAt.substring(0, 10)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No events available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
