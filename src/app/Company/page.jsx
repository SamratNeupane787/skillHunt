import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Company");
  }
  const userEmail = session?.user?.email;

  const res = await fetch(
    `http://localhost:3000/api/eventlisted?email=${userEmail}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  console.log(data);
  return (
    <div>
      {session?.user?.role === "Google User" ? (
        <div className="min-h-screen  flex flex-col gap-3">
          <div className=" flex flex-row gap-4 items-center justify-center pt-8">
            <Link href="/CreateEvent">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-3  rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
            <Link href="/AdsPage">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white mt-3 rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Ads
              </Button>
            </Link>

            <Link href="/AdsDashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white mt-3 rounded-full">
                <Plus className="mr-2 h-4 w-4" />
                Manage Ads
              </Button>
            </Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center mt-8">
              Events you have created!
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center">
            {data?.length > 0 ? (
              <div className="w-full pt-8">
                <div className="mx-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.map((item) => (
                    <Card
                      key={item._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="p-0">
                        <Image
                          src="/star.jpeg"
                          alt={item.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                      </CardHeader>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-xl mb-4">
                          {item.title}
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {item.location}
                          </p>
                          <p className="text-xs">
                            Organized by: {item.createdBy}
                          </p>
                          <p className="text-xs">
                            Description: {item.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <p>No events found</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-8xl">
          Login with Google to host an event
        </div>
      )}
    </div>
  );
};

export default Page;
