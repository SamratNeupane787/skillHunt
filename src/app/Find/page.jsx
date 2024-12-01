import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
const page = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Find");
  }

  const getdata = await fetch("http://localhost:3000/api/eventlisted");
  const result = await getdata.json();

  return (
    <div>
      {session?.user?.role === "Github User" ? (
        <div>
          <div>
            <h1 className=" text-center text-8xl">Ready to join event</h1>
          </div>

          <div className=" flex flex-row items-center justify-center pt-6 ">
            <h1 className=" text-center p-6">Showing 10 Hackathons:</h1>
            <Link href="/Myevents">
              <button className=" px-2 py-2 bg-blue-500 rounded-md">
                Joined events
              </button>
            </Link>
          </div>
          <div className=" mx-8 my-8 text-black  grid  grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3">
            {result?.length > 0 &&
              result.map((index) => (
                <div
                  className=" bg-[#FCF5C7] text-black flex flex-col items-center justify-center border-[#505052] rounded-lg"
                  key={index._id}
                >
                  <div>
                    <Image
                      src="/logo.png"
                      width={120}
                      height={120}
                      alt="Event Image"
                    />
                  </div>
                  <div className=" pl-2 max-w-fit">
                    <p>{index.title}</p>
                    <p>Description: {index.description}</p>
                    <p>Organized By:{index.createdBy}</p>
                    <p>Date: {index.date.substring(0, 10)}</p>
                    <p>Location: {index.location} </p>
                  </div>
                  <div className="py-2">
                    <Link href={`/JoinEvent?eventId=${index._id}`}>
                      {" "}
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Join Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className=" text-center text-8xl">
            You must be logged in with Github to Join event!
          </h1>
        </div>
      )}
    </div>
  );
};

export default page;
