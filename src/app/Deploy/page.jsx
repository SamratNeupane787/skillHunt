"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

const Deploy = () => {
  const [repoURL, setRepoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [deployPreviewURL, setDeployPreviewURL] = useState("");
  const router = useRouter();

  const handleClickDeploy = useCallback(async () => {
    if (!repoURL) {
      alert("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:9000/project`, {
        gitURL: repoURL,
        slug: projectId,
      });

      if (data && data.data) {
        const { projectSlug, url } = data.data;
        setProjectId(projectSlug);
        setDeployPreviewURL(url);
        console.log(`Subscribing to logs:${projectSlug}`);
        socket.emit("subscribe", `logs:${projectSlug}`);

        // Navigate to Myevents page with repoURL and deployPreviewURL
        // Now we will ensure it opens in the same tab with query params
        router.push(
          `/Myevents?githuburl=${encodeURIComponent(
            repoURL
          )}&liveurl=${encodeURIComponent(url)}`
        );
      }
    } catch (error) {
      console.error("Deployment error:", error);
      alert("Failed to deploy project");
    } finally {
      setLoading(false);
    }
  }, [repoURL, projectId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🚀 Deploy Your Project
        </h1>

        <input
          type="text"
          value={repoURL}
          onChange={(e) => setRepoURL(e.target.value)}
          placeholder="Enter GitHub repo URL"
          className="p-3 w-full text-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          onClick={handleClickDeploy}
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Deploying...
            </span>
          ) : (
            "Deploy"
          )}
        </button>
      </div>
    </div>
  );
};

export default Deploy;
