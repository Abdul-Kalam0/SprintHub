import api from "@/services/api";

export default function WorkspaceCard({ workspace }) {
  console.log(workspace);

  return (
    <div className="workspace-list">
      <h2>Project Name: {workspace.name}</h2>
      <p>Project description: {workspace.description}</p>
      <p>Projects: {workspace.projects}</p>
      <p>Members: {workspace.members}</p>
    </div>
  );
}
