"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const getStatusStyle = (status) => {
  switch (status) {
    case "Present":
      return { background: '#00C30740', color: "black" };
    case "Absent":
      return { backgroundColor: "#FF00004D", color: "black" };
    default:
      return { backgroundColor: "#607D8B", color: "black" };
  }
};

const getProductionStyle = (hours) => {
  const numericHours = parseFloat(hours);
  return numericHours >= 8
    ? { background: "#00C30740", color: "black" }
    : { backgroundColor: "#FF00004D", color: "black" };
};

const columns = [
  { field: "user_id", headerName: "Emp ID", headerClassName: "super-app-theme--header"  },
  {
    field: "username",
    headerName: "Name",
    headerClassName: "super-app-theme--header",
    flex: 2,
    renderCell: (params) => (
      <Box display="flex" gap={2} alignItems="center">
        <Avatar
          src={params.row.profile_pic || "/man.png"}
          alt={params.value}
        />
        <Box>
          <Typography variant="body1" fontWeight={500} >
            {params.value}
          </Typography>
          <Typography variant="body2" color="gray" fontSize={'12px'}>
            {params.row.designation || "N/A"}
          </Typography>
        </Box>
      </Box>
    ),
  },
  { field: "date", headerClassName: "super-app-theme--header", headerName: "Date", flex: 1 },
  {
    field: "status",
    headerClassName: "super-app-theme--header",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={params.value}
        sx={{ ...getStatusStyle(params.value), borderRadius: "5px", height: "25px" }}
      />
    ),
  },
  { field: "punch_in_time", headerClassName: "super-app-theme--header", headerName: "Check In", flex: 1 },
  { field: "punch_out_time", headerClassName: "super-app-theme--header", headerName: "Check Out", flex: 1 },
  { field: "late_minutes", headerClassName: "super-app-theme--header", headerName: "Late" },
  {
    field: "total_hours_day",
    headerClassName: "super-app-theme--header",
    headerName: "Production Hours",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={params.value}
        sx={{ ...getProductionStyle(params.value), borderRadius: "5px", height: "25px" }}
      />
    ),
  },
];

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const AttendenceTable = ({ data }) => {
  const [filters, setFilters] = useState({
    date: "",
    department: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Flatten attendance data from API response
  const formattedData = data.flatMap((record) => {
    const { user_id, username, profile_pic, designation, department, attendance } = record;

    if (Object.keys(attendance).length > 0) {
      return Object.entries(attendance).flatMap(([date, records]) =>
        records.map((att) => ({
          id: `${user_id}-${date}`,
          user_id,
          username,
          profile_pic,
          designation,
          department, // Add department to be used in filtering
          date,
          status: att.status,
          punch_in_time: formatTime(att.punch_in_time),
          punch_out_time: formatTime(att.punch_out_time),
          total_hours_day: att.total_hours_day ? `${att.total_hours_day} hrs` : "0:00 hrs",
          late_minutes: att.late_minutes ? `${att.late_minutes} min` : "0 min",
        }))
      );
    } else {
      return [{
        id: `${user_id}-empty`,
        user_id,
        username,
        profile_pic,
        designation,
        department,
        date: "N/A",
        status: "N/A",
        punch_in_time: "N/A",
        punch_out_time: "N/A",
        total_hours_day: "0:00 hrs",
        late_minutes: "0 min",
      }];
    }
  });

  formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply filters
  const filteredData = formattedData.filter((row) => {
    return (
      (filters.date ? row.date === filters.date : true) &&
      (filters.department ? row.department === filters.department : true) &&
      (filters.status ? row.status === filters.status : true)
    );
  });

  return (
    <Box sx={{ width: "100%" }}>
      <div className="dropdown-container">
        <div className="heading-container">
          <span className="table-heading">Attendance Details</span>
        </div>
        <div className="dropdowns-container">
          <div className="calender-field">
            <input
              type="date"
              name="date"
              className="dropdown"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="department-field">
            <select
              name="department"
              className="dropdown"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">Department</option>
             
            </select>
          </div>
          <div className="status-field">
            <select
              name="status"
              className="dropdown"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      </div>
      <DataGrid
        rows={filteredData}
        columns={columns}
        getRowId={(data) => data.id}
        disableColumnFilter
        disableColumnMenu
        sx={{
          height:400,
          "& .super-app-theme--header": {
            backgroundColor: "#0E2447",
            color: "white",
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: "15px",
            fontWeight: "500",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      />
    </Box>
  );
};

export default AttendenceTable;
