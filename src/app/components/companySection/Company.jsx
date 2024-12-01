import React from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
function Student() {
  return (
    <div className=" py-8">
      <h1 className="text-[#1877F2] text-7xl font-mono font-bold text-center">
        Host and <span className="text-[#125216]">Promote</span>
      </h1>
      <div className=" grid  place-items-center px-12  gap-8 sm:grid-cols-1 md:grid-cols-2">
        <div>
          <h1 className=" sm:hidden md:text-5xl pb-7 font-semibold font-mono text-[#5480ba]">
            Promote your Company
          </h1>
          <p className="pt-4  text-2xl font-mono">
            1) Signup <br /> 2) List Event <br />
            3) And Done!
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full  w-36 mt-7 sm:text-xl md:text-2xl ">
            <Link href="/Company">Host</Link>
          </button>
        </div>
        <div>
          <Image src="/coding.png" height={520} width={520} />
        </div>
      </div>
    </div>
  );
}

export default Student;
