"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { Fira_Code } from "next/font/google";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const socket = io("http://localhost:9002");

const firaCode = Fira_Code({ subsets: ["latin"] });

export default function Home() {
  const [repoURL, setURL] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState();
  const [deployPreviewURL, setDeployPreviewURL] = useState();

  const logContainerRef = useRef(null);
  const router = useRouter(); // Initialize the router

  const isValidURL = useMemo(() => {
    if (!repoURL || repoURL.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(repoURL), "Enter a valid GitHub Repository URL"];
  }, [repoURL]);

  const handleClickDeploy = useCallback(async () => {
    setLoading(true);
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

      // Redirect to the event page with the deploy URL
      window.open(`/Myevents?liveUrl=${encodeURIComponent(url)}`);
    }
  }, [projectId, repoURL, router]); // Add router to the dependency list

  const handleSocketIncomingMessage = useCallback((message) => {
    console.log(`[Incoming Socket Message]:`, typeof message, message);
    const { log } = JSON.parse(message);
    setLogs((prev) => [...prev, log]);
    logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    socket.on("message", handleSocketIncomingMessage);
    return () => {
      socket.off("message", handleSocketIncomingMessage);
    };
  }, [handleSocketIncomingMessage]);

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-500 to-blue-500 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <span className="flex justify-start items-center gap-4 mb-4">
          <Github className="text-4xl text-gray-700" />
          <Input
            disabled={loading}
            value={repoURL}
            onChange={(e) => setURL(e.target.value)}
            type="url"
            placeholder="Enter GitHub Repo URL"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </span>
        <Button
          onClick={handleClickDeploy}
          disabled={!isValidURL[0] || loading}
          className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {loading ? <span className="animate-spin">🔄</span> : "Deploy"}
        </Button>

        {deployPreviewURL && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
            <p>
              Preview URL{" "}
              <a
                target="_blank"
                className="text-teal-400 hover:text-teal-500"
                href={deployPreviewURL}
              >
                {deployPreviewURL}
              </a>
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div
            className={`${firaCode.className} text-sm text-green-500 mt-6 border border-green-500 rounded-lg p-6 h-72 overflow-y-auto bg-black`}
          >
            <pre className="flex flex-col gap-2">
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
    </main>
  );
}
