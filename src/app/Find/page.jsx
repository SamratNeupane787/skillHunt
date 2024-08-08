"use client";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
async function page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Find");
  }

  return (
    <div>
      {session?.user?.role === "Github User" ? (
        <div>
          <div>
            <h1 className=" text-center text-8xl">Ready to join event</h1>
          </div>
          <div className="flex items-center justify-center mt-8 ">
            <div>
              <input
                type="text"
                placeholder="Search Hackathon"
                className="flex items-center text-center justify-center border-2 border-cyan-400  mx-5 h-12 max-w-2xl rounded-full "
              />
            </div>
            <div className="flex items-center ">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                Find
              </button>
            </div>
          </div>
          <div>
            <h1 className=" text-center p-6">Showing 10 Hackahtons:</h1>
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
}

export default page;
