import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
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

  return (
    <div>
      {session?.user?.role === "Google User" ? (
        <div className="flex flex-col items-center justify-center">
          <Link href="/CreateEvent">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Create Event
            </button>
          </Link>

          <h1 className="text-center text-3xl font-semibold py-8">
            Events you have created!
          </h1>

          <div className="grid place-items-center mx-12 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data?.length > 0 ? (
              data.map((item) => (
                <div
                  key={item._id} // Use the unique event `_id` from the response
                  className="bg-black text-white min-w-full h-48 md:w-96 border-2 border-[#505052] rounded-lg my-4 grid place-items-center"
                >
                  <div className="flex items-center justify-center flex-wrap">
                    <div>
                      <Image
                        src="/star.jpeg"
                        width={120}
                        height={120}
                        alt="Event Image"
                      />
                    </div>
                    <div className="border-l-2 pl-2 max-w-fit">
                      <p>{item.title}</p>
                      <p>{item.description}</p>
                      <p>Organized By: {item.createdBy}</p>
                      <p>Date: {item.date}</p>
                      <p>Location: {item.location}</p>
                    </div>
                  </div>
                </div>
              ))
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
