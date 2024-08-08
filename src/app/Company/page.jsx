"use client";
import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Image from "next/image";
import data from "./data.json";
async function page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Company");
  }
  console.log(session);

  return (
    <div>
      {session?.user?.role === "Google User" ? (
        <div className="flex flex-col items-center justify-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Create Event
          </button>

          <h1 className="text-center text-3xl font-semibold py-8">
            Events you have created!
          </h1>

          <div className="grid  place-items-center mx-12 gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((item) => (
              <div
                key={item.eventName}
                className="min-w-full h-48 md:w-96 border-2 border-[#505052] rounded-lg my-4 grid place-items-center"
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
                    <p>{item.eventName}</p>
                    <p>Organized By: {item.organizer}</p>
                    <p>Date: {item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-8xl">
          Login with Google to host an event
        </div>
      )}
    </div>
  );
}

export default page;
