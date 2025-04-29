"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#1877F2]">
          Skill <span className="text-black">Hunt</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-[#1877F2]">
            Home
          </Link>
          <Link href="/Find" className="hover:text-[#1877F2]">
            Hackathon
          </Link>
          <Link href="/Company" className="hover:text-[#1877F2]">
            Company
          </Link>
          <Link href="/Contact" className="hover:text-[#1877F2]">
            Contact Us
          </Link>
          <Link
            href={session ? "/api/auth/signout?callbackUrl=/" : "/About"}
            className="hover:text-[#1877F2]"
          >
            {session ? "Logout" : "About Us"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Menu
            height={32}
            width={32}
            onClick={toggleMenu}
            alt="Menu Icon"
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="bg-white md:hidden shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/" className="hover:text-[#1877F2]">
              Home
            </Link>
            <Link href="/Find" className="hover:text-[#1877F2]">
              Hackathon
            </Link>
            <Link href="/Company" className="hover:text-[#1877F2]">
              Company
            </Link>
            <Link href="/Contact" className="hover:text-[#1877F2]">
              Contact Us
            </Link>
            <Link
              href={session ? "/api/auth/signout?callbackUrl=/" : "/About"}
              className="hover:text-[#1877F2]"
            >
              {session ? "Logout" : "About Us"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
