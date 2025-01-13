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
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const router = useRouter();

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          createdBy: session?.user?.name,
          location,
          date,
          email: session?.user?.email,
        }),
      });

      if (res.ok) {
        router.push("/Company");
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please try again.",
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
