"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client";
import { Github } from "lucide-react";
import { Fira_Code } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socket = io("http://localhost:9000");
const firaCode = Fira_Code({ subsets: ["latin"] });

export default function Deploy() {
  const [repoURL, setRepoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [deployPreviewURL, setDeployPreviewURL] = useState("");
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (projectId) {
      console.log(`🔗 Listening for logs on: logs:${projectId}`);

      socket.on(`logs:${projectId}`, (logMessage) => {
        console.log("📩 Received Log:", logMessage);
        setLogs((prevLogs) => [...prevLogs, logMessage]);

        // Auto-scroll to latest log
        logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => {
        socket.off(`logs:${projectId}`);
      };
    }
  }, [projectId]);

  const handleClickDeploy = useCallback(async () => {
    if (!repoURL) {
      alert("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setLogs([]); // Clear logs on new deployment

    try {
      const { data } = await axios.post(`http://localhost:9000/project`, {
        gitURL: repoURL,
        slug: projectId,
      });

      if (data && data.data) {
        const { projectSlug, url } = data.data;
        setProjectId(projectSlug);
        setDeployPreviewURL(url);

        console.log(`📡 Subscribing to logs:${projectSlug}`);
        socket.emit("subscribe", `logs:${projectSlug}`);

        window.open(
          `/Myevents?githuburl=${encodeURIComponent(repoURL)}&liveurl=${encodeURIComponent(url)}`,
          "_blank"
        );
      }
    } catch (error) {
      console.error("❌ Deployment error:", error);
      alert("Failed to deploy project");
    } finally {
      setLoading(false);
    }
  }, [repoURL, projectId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">🚀 Deploy Your Project</h1>

        <div className="flex items-center gap-2">
          <Github className="text-4xl" />
          <Input
            type="url"
            value={repoURL}
            onChange={(e) => setRepoURL(e.target.value)}
            placeholder="Enter GitHub repo URL"
            disabled={loading}
            className="p-3 w-full text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <Button
          onClick={handleClickDeploy}
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Deploying...
            </span>
          ) : (
            "Deploy"
          )}
        </Button>

        {deployPreviewURL && (
          <div className="mt-3 bg-slate-900 py-4 px-2 rounded-lg">
            <p>
              Preview URL{" "}
              <a
                target="_blank"
                className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg"
                href={deployPreviewURL}
              >
                {deployPreviewURL}
              </a>
            </p>
          </div>
        )}

        {/* Logs Section */}
        {logs.length > 0 && (
          <div
            className={`${firaCode.className} text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
          >
            <pre className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <code
                  ref={logs.length - 1 === i ? logContainerRef : undefined}
                  key={i}
                >{`> ${log}`}</code>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
