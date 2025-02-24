import React from "react";
import Layout from "../component/layout/layout";
import ProjectCard from "../component/projectcard/projectcard";
import "./project.css";

const Project = () => {
  const projects = [
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    {
      title: "Clinic Management",
      description:
        "A clinic management project streamlines patient records, appointments, and billing processes to improve operational efficiency.",
      leaderName: "Sophie Headrick",
      deadline: "Deadline",
      designation: "Project Leader",
      date: "20 July 2021",
      tasks: "06/10",
      leaderImg: "/man.png",
      projectImg: "/man.png",
      members: ["/man.png", "/man.png", "/man.png","/man.png","/man.png" ], // Add member images
    },
    
  ];

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
              <option value="Rejected">Rejected</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
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
      <div className="projects-container">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </Layout>
  );
};

export default Project;
