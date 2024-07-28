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
          <h1 className=" text-center text-8xl">Ready to join event</h1>
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
