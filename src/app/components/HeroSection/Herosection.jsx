import React from "react";
import Image from "next/image";
function Herosection() {
  return (
    <div className=" grid  place-items-center gap-6  sm:grid-cols-1 pt-16 md:grid-cols-2  ">
      <div className=" grid  gap-2 place-items-start md:mx-8">
        <div className=" font-bold  font-mono ">
          <h1 className=" text-[#1877F2] text-6xl md:text-8xl">
            Learn, <br /> Build <br />
            Grow
          </h1>
        </div>
        <div className="py-8">
          <p className=" text-lg tracking-normal font-mono md:text-2xl ">
            <span className=" underline text-[#1877f2] font-semibold tracking-wider">
              SkillHunt
            </span>{" "}
            is a platform for tech ethusiast to participate in hackathon ,
            promote their companies through organizing or hosting hackathon
          </p>
        </div>
      </div>
      <div>
        <Image src="/heroImg.png" alt="Hero Image" height={520} width={520} />
      </div>
    </div>
  );
}

export default Herosection;
