"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "libs/utils";

export default function CreateAd() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(null); // Make sure date is initialized as null
  const [image, setImage] = useState(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("status");

    if (paymentStatus === "Completed") {
      setIsPaymentSuccessful(true);
    }

    const storedData = JSON.parse(localStorage.getItem("adFormData"));
    if (storedData) {
      setTitle(storedData.title || "");
      setDescription(storedData.description || "");
      setLocation(storedData.location || "");
      setDate(storedData.date ? new Date(storedData.date) : null);
      setImage(storedData.image || null);
    }
  }, []);

  const handlePaymentRedirect = () => {
    if (!title || !description || !location || !date || !image) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all fields",
      });
      return;
    }

    const adFormData = {
      title,
      description,
      location,
      date: date ? date.toISOString() : "",
      image,
    };

    localStorage.setItem("adFormData", JSON.stringify(adFormData));
    router.push("/Khalti");
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();

    if (!title || !description || !location || !date || !image) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all fields",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date.toISOString());
    formData.append("image", image);
    formData.append("createdBy", userEmail || "");

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Ad created successfully");
        router.push("/Company");
      } else {
        const errorData = await res.json();
        alert(`Ad creation failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Ads creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Ad</CardTitle>
              <CardDescription>
                Fill in the details to create a new advertisement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAd} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className=" bg-black text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {image ? image.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                {!isPaymentSuccessful ? (
                  <Button
                    type="button"
                    className="w-full bg-blue-700 text-white"
                    onClick={handlePaymentRedirect}
                  >
                    Pay with Khalti
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-blue-700 text-white"
                  >
                    Create Advertisement
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
