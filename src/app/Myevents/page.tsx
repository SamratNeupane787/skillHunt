import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const page = async()=>{
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Find");
  }
  const userEmail = session?.user?.email;

  const res = await fetch(
    `http://localhost:3000/api/eventjoin?email=${userEmail}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  
  return (
    
    //  <div className=" mx-8 my-8 text-black  grid  grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3">
    //         {data?.length > 0 &&
    //           data.map((index) => (
    //             <div
    //               className=" bg-[#FCF5C7] text-black flex flex-col items-center justify-center border-[#505052] rounded-lg"
    //               key={index._id}
    //             >
    //               <div>
    //                 <Image
    //                   src="/logo.png"
    //                   width={120}
    //                   height={120}
    //                   alt="Event Image"
    //                 />
    //               </div>
    //               <div className=" pl-2 max-w-fit">
    //                 <p>{index.title}</p>
    //                 <p>Description: {index.description}</p>
    //                 <p>Organized By:{index.createdBy}</p>
    //                 <p>Date: {index.date.substring(0, 10)}</p>
    //                 <p>Location: {index.location} </p>
    //               </div>
    //               <div className="py-2">
    //                 <Link href={`/JoinEvent?eventId=${index._id}`}>
    //                   {" "}
    //                   <button
    //                     type="button"
    //                     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //                   >
    //                     Join Now
    //                   </button>
    //                 </Link>
    //               </div>
    //             </div>
    //           ))}
    //       </div>
      
    <div>pages</div>
  )
}

export default page

