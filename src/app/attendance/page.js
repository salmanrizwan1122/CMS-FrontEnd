"use client";
import React, { useEffect, useState } from "react";
import Layout from "../component/layout/layout";
import AttendenceTable from "../component/attendencetable/attendence";
import "./attendance.css";
import { API_BASE_URL } from "../network/url";

const AttendanceData = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null); // Store summary separately

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in session storage.");
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Token ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch(`${API_BASE_URL}attendence/api/get-all/`, {
          method: "GET",
          headers: myHeaders
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const result = await response.json();
        setAttendanceRecords(result.attendance_records || []);
        setSummary(result.daily_summary || {});
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Layout>
      <h1 className="main-heading">Attendance</h1>
      {loading ? <p>Loading...</p> :
        <>
          <div className="attendance-container">
            <StatCard title="Present" value={summary.total_present || 0} />
            <StatCard title="Late Login" value={summary.total_late || 0} />
            <StatCard title="Absent" value={summary.total_absent || 0} />
          </div>
          <div className="table-container">
           


            <div className="table-data">
              <AttendenceTable data={attendanceRecords} />
            </div>
          </div>
        </>
      }
    </Layout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <div className="card-content">
      <div className="card-img">
        <img src="employee.png" alt={title} />
      </div>
      <div className="card-stats">
        <span className="card-title">{title}</span>
        <span className="card-value">{value}</span>
      </div>
    </div>
  </div>
);

// Reusable Search Bar Component
const SearchBar = ({ placeholder }) => (
  <div className="search-field">
    <img src="search.png" alt="Search" />
    <input type="text" placeholder={placeholder} className="search-bar" />
  </div>
);

export default AttendanceData;
