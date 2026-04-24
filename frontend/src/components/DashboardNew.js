import React, { useState } from "react";

function DashboardNew({ user, onLogout }) {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamp the landing page UI and UX flows for Q3 launch.",
      goalDate: "2026-12-31",
      goalTime: "23:59",
      isCompleted: false,
      isStatic: true,
    },
    {
      id: 2,
      name: "API Integration",
      description: "Connect payment gateway and third-party auth services.",
      goalDate: "2026-11-15",
      goalTime: "18:00",
      isCompleted: false,
      isStatic: true,
    },
    {
      id: 3,
      name: "Mobile App",
      description: "React Native app — sprint 2 in progress.",
      goalDate: "2026-10-01",
      goalTime: "12:00",
      isCompleted: false,
      isStatic: true,
    },
    {
      id: 4,
      name: "Data Pipeline",
      description: "ETL pipeline for analytics dashboard ingestion.",
      goalDate: "2026-09-20",
      goalTime: "09:00",
      isCompleted: false,
      isStatic: true,
    },
  ]);

  const staticTeamMembers = [
    { name: "Keiran Reyes", color: "#06b6d4" },
    { name: "May Joy Agunod", color: "#22c55e" },
    { name: "Karylle Dampiles", color: "#f59e0b" },
    { name: "Merdy Francisco", color: "#ef4444" },
    { name: "Julie Ann Salva", color: "#a855f7" },
  ];

  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    goalDate: "",
    goalTime: "",
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;

    setProjects([
      ...projects,
      {
        id: projects.length + 1,
        name: newProject.name,
        description: newProject.description || "No description provided",
        goalDate: newProject.goalDate,
        goalTime: newProject.goalTime,
        isCompleted: false,
        isStatic: false,
      },
    ]);

    setNewProject({ name: "", description: "", goalDate: "", goalTime: "" });
    setShowModal(false);
  };

  const handleCompleteGoal = (projectId) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, isCompleted: true } : p
    ));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, isCompleted: true });
    }
  };

  const handleCancelGoal = (projectId) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, goalDate: "", goalTime: "", isCompleted: false } : p
    ));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, goalDate: "", goalTime: "", isCompleted: false });
    }
  };

  const generateFileId = (file) => {
    return `${file.name}-${file.size}-${Date.now()}`;
  };

  const simulateFileUpload = (fileId) => {
    setUploadingFiles((prev) => ({ ...prev, [fileId]: "uploading" }));
    setTimeout(() => {
      setUploadingFiles((prev) => ({ ...prev, [fileId]: "complete" }));
    }, 2000);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
    if (["mp4", "mov", "avi"].includes(ext)) return "🎥";
    if (["pdf"].includes(ext)) return "📕";
    if (["doc", "docx"].includes(ext)) return "📄";
    if (["zip", "rar"].includes(ext)) return "🗜️";
    return "📁";
  };

  const getFileExtension = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "PNG";
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx"].includes(ext)) return "DOCX";
    if (["zip", "rar"].includes(ext)) return "ZIP";
    return ext.toUpperCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleRemoveFile = (projectId, fileId, e) => {
    e.stopPropagation();
    setProjectFiles((prev) => ({
      ...prev,
      [projectId]: prev[projectId].filter((f) => f.id !== fileId),
    }));
    setUploadingFiles((prev) => {
      const newState = { ...prev };
      delete newState[fileId];
      return newState;
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!selectedProject) return;
    const files = Array.from(e.dataTransfer.files);
    handleAddFiles(files);
  };

  const handleAddFiles = (files) => {
    if (!selectedProject) return;
    
    const fileArray = Array.from(files).map((file) => ({
      id: generateFileId(file),
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file,
    }));
    
    fileArray.forEach(file => {
      setProjectFiles((prev) => ({
        ...prev,
        [selectedProject.id]: [...(prev[selectedProject.id] || []), file],
      }));
      simulateFileUpload(file.id);
    });
  };

  const handleBrowseFiles = (e) => {
    if (!selectedProject) return;
    const files = Array.from(e.target.files);
    handleAddFiles(files);
    e.target.value = null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (selectedProject) {
    const deadline = new Date(
      `${selectedProject.goalDate || "2026-12-31"} ${selectedProject.goalTime || "23:59"}`
    );
    const now = new Date();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const projectFileList = projectFiles[selectedProject.id] || [];
    const isCompleted = selectedProject.isCompleted;
    const showTeamMembers = selectedProject.isStatic === true;

    return (
      <div style={{ padding: "2rem", color: "white", background: "#020617", minHeight: "100vh" }}>
        <button
          onClick={() => setSelectedProject(null)}
          style={{
            marginBottom: "1rem",
            background: "#475569",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>

        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 0",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem", color: "#22d3ee" }}>ProGit</span>
            <span style={{ color: "#64748b" }}>/</span>
            <span style={{ color: "#64748b" }}>Projects</span>
            <span style={{ color: "#64748b" }}>/</span>
            <span>{selectedProject.name}</span>
            <span style={{ color: "#64748b" }}>/</span>
            <span style={{ color: "#22d3ee" }}>Files</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#64748b", cursor: "pointer" }}>Dashboard</span>
            <span style={{ color: "#64748b", cursor: "pointer" }}>Projects</span>
            <div
              style={{
                background: "#0891b2",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {user?.name?.[0] || "U"}
            </div>
            <span>{user?.name || "john_doe"}</span>
            <button
              onClick={onLogout}
              style={{
                background: "#ef4444",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{selectedProject.name}</h1>
              <p style={{ color: "#64748b" }}>{selectedProject.description}</p>
            </div>

            {selectedProject.goalDate && !isCompleted && (
              <div style={{ marginBottom: "2rem", padding: "1rem", background: "#0f172a", borderRadius: "10px", borderLeft: "3px solid #06b6d4" }}>
                <div style={{ fontSize: "1rem", color: "#22d3ee", marginBottom: "0.5rem" }}>
                  Goal: {formatDate(selectedProject.goalDate)} at {selectedProject.goalTime}
                </div>
                <div style={{ fontSize: "1.2rem", color: "#22d3ee", marginBottom: "1rem" }}>
                  Countdown: {days}d {hours}h {minutes}m
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => handleCompleteGoal(selectedProject.id)}
                    style={{
                      background: "#22c55e",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ✓ Already Finished
                  </button>
                  <button
                    onClick={() => handleCancelGoal(selectedProject.id)}
                    style={{
                      background: "#ef4444",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    ✗ Cancel Goal
                  </button>
                </div>
              </div>
            )}

            {selectedProject.goalDate && isCompleted && (
              <div style={{ marginBottom: "2rem", padding: "1rem", background: "#0f172a", borderRadius: "10px", borderLeft: "3px solid #22c55e" }}>
                <div style={{ fontSize: "1rem", color: "#22c55e" }}>
                  ✓ Goal Completed! Great job!
                </div>
                <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.5rem" }}>
                  Original goal was set for {formatDate(selectedProject.goalDate)} at {selectedProject.goalTime}
                </div>
              </div>
            )}

            <div style={{ 
              background: "#0f172a", 
              borderRadius: "12px", 
              border: "1px solid #1e293b",
              marginBottom: "2rem"
            }}>
              <div style={{ padding: "1.5rem", borderBottom: "1px solid #1e293b" }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>File Upload</h2>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Attach files to this project. Supported: PDF, PNG, JPG, ZIP, DOCX, and more.
                </p>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  margin: "1.5rem",
                  padding: "2rem",
                  border: `2px dashed ${dragActive ? "#06b6d4" : "#334155"}`,
                  borderRadius: "12px",
                  background: dragActive ? "#1e293b" : "#020617",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
                <p style={{ color: "#94a3b8", marginBottom: "0.5rem" }}>Drag & drop files here</p>
                <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1rem" }}>or</p>
                <input
                  type="file"
                  multiple
                  id="file-upload-input"
                  style={{ display: "none" }}
                  onChange={handleBrowseFiles}
                />
                <label
                  htmlFor="file-upload-input"
                  style={{
                    display: "inline-block",
                    background: "#06b6d4",
                    color: "#022c22",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                  }}
                >
                  Browse Files
                </label>
                <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                  Max file size: 50 MB per file
                </p>
              </div>

              <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#94a3b8" }}>Uploaded Files</h3>
                
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1e293b", color: "#64748b", fontSize: "0.875rem" }}>
                        <th style={{ textAlign: "left", padding: "0.75rem 0.5rem" }}>File</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 0.5rem" }}>Size</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 0.5rem" }}>Status</th>
                        <th style={{ textAlign: "left", padding: "0.75rem 0.5rem" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectFileList.length === 0 ? (
                        <td>
                          <td colSpan="4" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                            No files uploaded yet
                          </td>
                        </td>
                      ) : (
                        projectFileList.map((file) => (
                          <tr key={file.id} style={{ borderBottom: "1px solid #1e293b" }}>
                            <td style={{ padding: "0.75rem 0.5rem" }}>
                              <span style={{ marginRight: "8px" }}>{getFileIcon(file.name)}</span>
                              <span style={{ fontSize: "0.875rem", marginLeft: "4px" }}>{getFileExtension(file.name)}</span>
                              <span style={{ color: "#94a3b8", marginLeft: "8px", fontSize: "0.875rem" }}>{file.name}</span>
                            </td>
                            <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.875rem" }}>
                              {formatFileSize(file.size)}
                            </td>
                            <td style={{ padding: "0.75rem 0.5rem" }}>
                              <span style={{
                                color: uploadingFiles[file.id] === "uploading" ? "#f59e0b" : "#22c55e",
                                fontSize: "0.875rem"
                              }}>
                                {uploadingFiles[file.id] === "uploading" ? "Uploading..." : "Complete"}
                              </span>
                            </td>
                            <td style={{ padding: "0.75rem 0.5rem" }}>
                              <button
                                onClick={(e) => handleRemoveFile(selectedProject.id, file.id, e)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {showTeamMembers ? (
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderTop: "3px solid #06b6d4",
                borderRadius: "10px",
                padding: "1rem",
                height: "fit-content",
              }}
            >
              <h3 style={{ marginBottom: "1rem" }}>Team Members</h3>
              {staticTeamMembers.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: m.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>{m.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderTop: "3px solid #06b6d4",
                borderRadius: "10px",
                padding: "1rem",
                height: "fit-content",
              }}
            >
              <h3 style={{ marginBottom: "1rem" }}>Team Members</h3>
              <div style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>
                No team members assigned yet
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "2px solid #06b6d4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem", color: "#22d3ee" }}>
            ProGit
          </span>
          <span style={{ color: "#64748b" }}>/ Dashboard</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Dashboard</span>
          <span>Project</span>
          <div
            style={{
              background: "#0891b2",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {user?.name?.[0] || "U"}
          </div>
          <span>{user?.name || "john_doe"}</span>
          <button
            onClick={onLogout}
            style={{
              background: "#ef4444",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          Welcome back, {user?.name || "john_doe"}.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              borderBottom: "2px solid #06b6d4",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            My Projects
          </h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#06b6d4",
              color: "#022c22",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            + New Project
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                cursor: "pointer",
                background: "#020617",
                border: "1px solid #0f172a",
                borderTop: `3px solid ${project.isCompleted ? "#22c55e" : "#06b6d4"}`,
                borderRadius: "10px",
                padding: "1.2rem",
              }}
            >
              <h3 style={{ margin: 0 }}>{project.name}</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                {project.description}
              </p>
              {project.goalDate && !project.isCompleted && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#22d3ee" }}>
                  Goal: {formatDate(project.goalDate)} at {project.goalTime}
                </div>
              )}
              {project.isCompleted && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#22c55e" }}>
                  ✓ Goal Completed!
                </div>
              )}
              {(projectFiles[project.id] || []).length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "4px" }}>
                    Files ({projectFiles[project.id].length}):
                  </div>
                  {(projectFiles[project.id] || []).slice(0, 2).map((file) => (
                    <div
                      key={file.id}
                      style={{
                        fontSize: "0.7rem",
                        color: "#22d3ee",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#0f172a",
                        padding: "4px 6px",
                        borderRadius: "6px",
                        marginTop: "4px",
                      }}
                    >
                      <span>
                        {getFileIcon(file.name)} {file.name}
                      </span>
                      <span style={{ color: "#64748b" }}>
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                  {(projectFiles[project.id] || []).length > 2 && (
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "4px" }}>
                      +{(projectFiles[project.id] || []).length - 2} more files
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              borderRadius: "12px",
              borderTop: "3px solid #06b6d4",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <h2 style={{ color: "white", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Create New Project
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Fill in the details to create a new project.
            </p>

            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
                minHeight: "80px",
              }}
            />
            <input
              type="date"
              placeholder="Goal Date"
              value={newProject.goalDate}
              onChange={(e) => setNewProject({ ...newProject, goalDate: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <input
              type="time"
              placeholder="Goal Time"
              value={newProject.goalTime}
              onChange={(e) => setNewProject({ ...newProject, goalTime: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1.5rem",
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "white",
              }}
            />

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={handleCreateProject}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#06b6d4",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardNew;