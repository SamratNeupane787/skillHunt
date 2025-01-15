import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function UnderDevelopment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h1
          className={`${montserrat.className} text-4xl font-bold text-blue-600 mb-4`}
        >
          Under Development
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/Myevents"
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
          >
            Go BACK
          </a>
        </div>
      </div>
    </div>
  );
}
