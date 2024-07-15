import React from "react";
import Image from "next/image";
import data from "./data.json";
function Happening() {
  return (
    <div>
      <div className=" font-semibold font-mono pt-6 text-center">
        <h1 className=" text-7xl text-[#1877F2] ">Happening Now!</h1>
      </div>
      <div className=" grid  gap-4 place-items-center py-12 sm:grid-cols-1 md:grid-cols-3">
        {data?.map((item) => {
          return (
            <div className=" w-full md:w-96 border-2 border-[#505052] rounded-lg px-8 py-8">
              <div className=" flex items-center justify-center flex-wrap">
                <div>
                  <Image src="/chat.png" width={120} height={120} />
                </div>
                <div className="border-l-2 pl-2 max-w-fit">
                  <p>{item.eventName}</p>
                  <p>Organized By:{item.organizer}</p>
                  <p>Date:{item.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Happening;
