"use client";
import React, { useEffect, useState, useCallback } from "react";
import Layout from "../component/layout/layout";
import LeavesTable from "../component/leavestable/leaves"; // Ensure this component is correctly handling leave data
import "./leave.css";
import { API_BASE_URL } from "../network/url";

const LeavesData = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_leaves: 0,
    pending_leaves: 0,
    accepted_leaves: 0,
    rejected_leaves: 0
  });

  const fetchLeaves = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch(`${API_BASE_URL}leave/api/get-all/`, {
        method: "GET",
        headers: myHeaders
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leave data");
      }

      const result = await response.json();

      setLeaveRecords(result.leaves || []);
      setSummary({
        total_leaves: result.total_leaves || 0,
        pending_leaves: result.pending_leaves || 0,
        accepted_leaves: result.accepted_leaves || 0,
        rejected_leaves: result.rejected_leaves || 0
      });

    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <Layout>
      <h1 className="main-heading">Leaves</h1>
      {loading ? <p>Loading...</p> :
        <>
          <div className="leave-container">
            <StatCard title="Total Leaves" value={summary.total_leaves} />
            <StatCard title="Pending Leaves" value={summary.pending_leaves} />
            <StatCard title="Accepted Leaves" value={summary.accepted_leaves} />
            <StatCard title="Rejected Leaves" value={summary.rejected_leaves} />
          </div>
          <div className="table-container">
            <div className="table-data">
              <LeavesTable data={leaveRecords} fetchLeaves={fetchLeaves} />
            </div>
          </div>
        </>
      }
    </Layout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="leave-stat-card">
    <div className="leave-card-content">
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

export default LeavesData;
