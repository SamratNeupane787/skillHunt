"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SubmittedProjectsPage = ({ params }) => {
  const { eventId } = params;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/submitprojects?eventId=${eventId}`);
        const data = await res.json();

        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [eventId]);

  if (loading) return <p>Loading submitted projects...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-6">Submitted Projects</h1>
      {projects.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {projects.map((proj) => (
            <li key={proj._id} className="p-4 border rounded-md shadow-md">
              <h2 className="font-semibold">{proj.teamName}</h2>
              <p>
                GitHub Repo:{" "}
                <a
                  href={proj.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {proj.githubRepo}
                </a>
              </p>
              <p>Submitted by: {proj.submitedBy}</p>
              <p>Submitted by: {proj.teamName}</p>
              <p>Live url: {proj.liveUrl}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No projects submitted yet.</p>
      )}
    </div>
  );
};

export default SubmittedProjectsPage;
