
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const data = await getServerSession(options);
  //     setSession(data);
  //   };
  //   fetchSession();
  // }, []);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <nav className="sm:text-md md:text-lg mx-12">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-lg ">
          <Link href="/" className=" tracking-wider text-[#1877F2]">
            <span className="sm:text-2xl md:text-4xl">S</span>KILL
            <span className="sm:text-2xl md:text-4xl">H</span>UNT
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-[#1877F2] gap-2">
            Home
          </Link>
          <Link href="/Find" className="hover:text-[#1877F2] gap-2">
            Hackathon
          </Link>
          <Link href="/Company" className="hover:text-[#1877F2] gap-2">
            Company
          </Link>
          <Link href="/Contact" className="hover:text-[#1877F2] gap-2">
            Contact Us
          </Link>
          {session ? (
            <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
          ) : (
            <Link href="/">About Us</Link>
          )}
        </div>
        <div className="md:hidden">
          <Image
            src="/ham.png"
            height={32}
            width={32}
            onClick={toggleMenu}
            alt="Menu Icon"
            className="cursor-pointer"
          />
        </div>
      </div>
      {open && (
        <div className="sm:bg-white shadow-lg w-[100%] h-[100%] md:hidden ">
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/" className="hover:text-[#1877F2] gap-2">
              Home
            </Link>
            <Link href="/Find" className="hover:text-[#1877F2] gap-2">
              Hackathon
            </Link>
            <Link href="/Company" className="hover:text-[#1877F2] gap-2">
              Company
            </Link>
            <Link href="/Contact" className="hover:text-[#1877F2] gap-2">
              Contact Us
            </Link>
            {session ? (
              <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
            ) : (
              <Link href="/">About Us</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
