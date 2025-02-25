"use client";


import React, { useEffect, useState } from "react";
import Layout from "../component/layout/layout";
import ProjectCard from "../component/projectcard/projectcard";
import "./project.css";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/project/api/get-all/", {
          method: "GET",
          headers: {
            Authorization: "Token 94f49923a1a0ec68639fcbb6083b58cae21a1e9d",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data.projects); // Update state with fetched projects
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout>
      <h1 className="main-heading">Projects</h1>
      <div className="filter-container">
        <div className="heading-container">
          <span className="table-heading">All Projects</span>
        </div>
        <div className="filtesr-container" style={{ display: "flex", gap: "10px" }}>
          <div className="project-status-field">
            <select name="status" className="dropdown">
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="add-new-container">
            <div className="add-new-btn">
              <img src="add.png" alt="Add Project" />
              <button>Add New Project</button>
            </div>
          </div>
        </div>
      </div>

      {/* Show loading indicator */}
      {loading && <p>Loading projects...</p>}

      {/* Show error message if fetch fails */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Render projects if successfully fetched */}
      <div className="projects-container">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              leaderName={project.leader ? project.leader.name : "No Leader"}
              deadline={project.deadline}
              designation={project.leader ? "Leader" : "No Designation"}
              date={project.created_at}
              tasks={project.total_tasks}
              leaderImg={project.leader ? project.leader.profile_pic : ""}
              projectImg="" // Add project image URL if available in the API
              members={project.team_members.map((member) => member.profile_pic)}
            />
          ))
        ) : (
          !loading && <p>No projects found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Project;