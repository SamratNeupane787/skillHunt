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
import { Button } from "@/components/ui/button";

function AdminDashboard() {
  const [ads, setAds] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

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
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/api/user");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchAds();
    fetchEvents();
    fetchUsers();
  }, []);

  const stopAd = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "inactive" }),
      });

      if (!response.ok) throw new Error("Failed to stop ad");

      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === id ? { ...ad, status: "inactive" } : ad
        )
      );
    } catch (error) {
      console.error("Error stopping ad:", error);
    }
  };

  const deleteAd = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ads?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete ad");

      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eventlisted?id=${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete event");

      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex h-screen bg-blue-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ads Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-blue-600 flex justify-between items-center px-6 py-4">
              <CardTitle className="text-white">Recent Ads</CardTitle>
              <button
                className="bg-white text-green-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
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
                      <TableHead>Title</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.slice(0, 5).map((ad) => (
                      <TableRow key={ad._id}>
                        <TableCell>{ad.title}</TableCell>
                        <TableCell>{ad.createdBy}</TableCell>
                        <TableCell
                          className={
                            ad.status === "inactive"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {ad.status}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => stopAd(ad._id)}>Stop</Button>
                          <Button onClick={() => deleteAd(ad._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No ads available.</p>
              )}
            </CardContent>
          </Card>

          {/* Events Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-green-600 px-6 py-4">
              <CardTitle className="text-white">Recent Events</CardTitle>
              <button
                className="bg-white text-green-600 px-3 py-1 rounded-md font-semibold hover:bg-gray-200 transition"
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
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, 5).map((event) => (
                      <TableRow key={event._id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>
                          {event.startDate}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteEvent(event._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No events available.</p>
              )}
            </CardContent>
          </Card>

          {/* Users Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-red-600 px-6 py-4">
              <CardTitle className="text-white">Users</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteUser(user._id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No users available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
