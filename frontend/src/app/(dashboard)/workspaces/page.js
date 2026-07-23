"use client";

import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import api from "@/services/api";
import "@/styles/workspace.css";
import { useEffect, useState } from "react";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchWorkspaces = async () => {
    try {
      const response = await api.get("/workspaces");
      setWorkspaces(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkspaces();
  }, []);
  if (loading) {
    return <h1>Loaidng...</h1>;
  }

  if (workspaces.length === 0) {
    return (
      <div className="workspace-page">
        <div className="workspace-header">
          <h1> workspcaces </h1>
          <button>+ Create workspace</button>
        </div>
        <div>
          <h3>No workspace found</h3>
        </div>
      </div>
    );
  }
  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <h1>Workspace</h1>
        <button>+ Create workspace</button>
      </div>
      <p>------------------------------</p>
      <div>
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace._id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}
