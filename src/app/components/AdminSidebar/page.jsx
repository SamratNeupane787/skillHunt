import Link from "next/link";
import { Home, BarChart2, FileText, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-800 h-screen shadow-md">
      <div className="flex items-center justify-center h-16 border-b border-blue-700">
        <h2 className="text-2xl font-semibold text-white">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <Link
          href="/admin"
          className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors"
        >
          <Home className="mr-3" />
          Dashboard
        </Link>
        <Link
          href="/Admin/ads"
          className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors"
        >
          <BarChart2 className="mr-3" />
          Ads
        </Link>
        <Link
          href="/Admin/hackathon"
          className="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors"
        >
          <FileText className="mr-3" />
          Events
        </Link>
      </nav>
    </div>
  );
}
