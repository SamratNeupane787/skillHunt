"use client";
import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

async function page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Company");
  }
  console.log(session);

  return (
    <div>
      {session?.user?.role == "Google User" ? (
        <div>
          <h1>Create event!</h1>
        </div>
      ) : (
        <div>Login with google to host a event</div>
      )}
    </div>
  );
}

export default page;
