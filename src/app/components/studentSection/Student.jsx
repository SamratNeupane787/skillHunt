import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
function Student() {
  return (
    <div className=" py-8">
      <h1 className="text-[#de4f4f]  px-8 font-mono font-bold text-center sm: text-5xl md:text-6xl">
        Build Team,Compete
      </h1>
      <div className=" grid  place-items-center px-12  gap-8 sm:grid-cols-1 md:grid-cols-2">
        <div>
          <Image src="/coding.png" height={520} width={520} />
        </div>
        <div className="sm:text-5xl md:text-6xl">
          <h1 className="font-semibold font-mono text-[#5480ba] sm:text-3xl md:text-5xl  ">
            Compete and Win!
          </h1>
          <p className="pt-4 font-mono sm:text-4xl md:text-3xl">
            <span className="py-4">1) Build a team</span>
            <br />
            <span className="py-4">2) Compete in tournament</span>
            <br />
            <span className="py-4">3) Win the Prize!</span>
            <br />
          </p>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full  w-36 mt-7 sm:text-xl md:text-2xl ">
            <Link href="/Student">Find</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Student;
