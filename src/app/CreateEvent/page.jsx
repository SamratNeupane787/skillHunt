"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CreateEvent() {
  const { toast } = useToast();
  const { data: session } = useSession();

  const username = session?.user?.name;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState("software");
  const [createdBy, setCreatedBy] = useState("");

  const router = useRouter();

  const getCurrentDateTime = () => {
    const now = new Date();
    const localISOTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !location ||
      !startDate ||
      !endDate ||
      !categories
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (new Date(startDate) < new Date()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Start date cannot be in the past",
      });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "End date must be after the start date",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/event", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          createdBy: session?.user?.name,
          location,
          startDate,
          endDate,
          email: session?.user?.email,
          categories,
        }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Event created successfully!",
        });
        router.push("/Company");
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event",
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Event</CardTitle>
              <CardDescription>
                Fill in the details to create a new event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter event description"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    min={getCurrentDateTime()} 
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    min={startDate || getCurrentDateTime()}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter event location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categories">Category</Label>
                  <select
                    id="categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="software">Software</option>
                    <option value="hardware">Hardware</option>
                    <option value="ui/ux">UI/UX</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="createdBy">Organizer</Label>
                  <Input
                    id="createdBy"
                    value={createdBy || username}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    placeholder={session?.user?.email || "Enter organizer name"}
                    disabled
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 text-white">
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
