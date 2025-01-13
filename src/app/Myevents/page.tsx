import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const Page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Company");
  }

  const userEmail = session?.user?.email;

  const res = await fetch(
    `http://localhost:3000/api/eventjoin?email=${userEmail}`,
    {
      cache: "no-store",
    }
  );
  const joinedEvents = await res.json();

  const eventDetailsPromises = joinedEvents.map(async (event) => {
    const eventRes = await fetch(
      `http://localhost:3000/api/eventlisted?eventId=${event.eventId}`,
      {
        cache: "no-store",
      }
    );
    const eventDetails = await eventRes.json();
    return { ...event, ...eventDetails };
  });

  const events = await Promise.all(eventDetailsPromises);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className=" pt-4 text-3xl font-semibold">
        You have joined {events.length} events
      </h1>
      {events.length > 0 ? (
        <div className="w-full pt-8">
          <div className="mx-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
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
                      {new Date(event.date).toLocaleDateString("en-US", {
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </div>
  );
};

export default Page;
