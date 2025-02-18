import React from "react";
import Layout from "../component/layout/layout";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./attendance.css"; // Import external CSS

const AttendanceData = () => {
  return (
    <Layout>
      <h1 className="main-heading">Attendence</h1>
      <div className="attendance-container">
        <div className="stat-card">
          <div className="card-content">
            <div className="card-img">
              <img src="employee.png" alt="Employee Data" />
            </div>
            <div>

              <div className="card-stats">
                <span className="card-title">Present</span>
                <span className="card-value">45</span>
              </div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-content">
            <div className="card-img">
              <img src="employee.png" alt="Employee Data" />
            </div>
            <div className="card-stats">
              <span className="card-title">Late Login</span>
              <span className="card-value">10</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-content">
            <div className="card-img">
              <img src="employee.png" alt="Employee Data" />
            </div>
            <div className="card-stats">
              <span className="card-title">Uninformed</span>
              <span className="card-value">10</span>
            </div>

          </div>
        </div>
        <div className="stat-card">
          <div className="card-content">
            <div className="card-img">
              <img src="employee.png" alt="Employee Data" />
            </div>
            <div className="card-stats">
              <span className="card-title">Absent</span>
              <span className="card-value">5</span>
            </div>

          </div>
        </div>
        <div className="stat-card">
          <div className="card-content">
            <div className="card-img">
              <img src="employee.png" alt="Employee Data" />
            </div>
            <div className="card-stats">
              <span className="card-title">permission</span>
              <span className="card-value">5</span>
            </div>

          </div>
        </div>
      </div>
      <div className="table-container">
      <div className="search-bar-container">
          <div className="heading-container">
                <span className="table-heading">Attendance Details</span>
          </div>
          <div className="search-container">
            <div className="search-field">
              <img src="search.png" alt="Search" />
              <input type="text" placeholder="Search by name" className="search-bar" />
            </div>
            <div className="search-field">
              <img src="search.png" alt="Search" />
              <input type="text" placeholder="Search by department" className="search-bar" />
            </div>
            <div className="search-field">
              <img src="search.png" alt="Search" />
              <input type="text" placeholder="Search by email" className="search-bar" />
            </div>
          </div>
        </div>
        </div>
    </Layout>
  );
};

export default AttendanceData;
