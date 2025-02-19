"use client";
import React from "react";
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
  { field: "user__id", headerName: "Emp ID", headerClassName: "super-app-theme--header" },
  {
    field: "user__username",
    headerName: "Name",
    headerClassName: "super-app-theme--header",
    flex: 1.5,
    renderCell: (params) => (
      <Box display="flex" gap={3} alignItems="center">
        <Avatar
          src={params.row.profile_pic || "/man.png"} // No need to manually add Base64 prefix
          alt={params.value}
        />
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {params.value}
          </Typography>
          <Typography variant="body2" color="gray">
            {params.row.designation || "N/A"}
          </Typography>
        </Box>
      </Box>
    ),
  },
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
  if (!timeString) return "N/A"; // Handle missing values
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};


const AttendenceTable = ({ data }) => {
  const formattedData = data.map((record) => ({
    ...record, // Keep all existing fields
    punch_in_time: formatTime(record.punch_in_time),
    punch_out_time: formatTime(record.punch_out_time),
    total_hours_day: record.total_hours_day ? `${record.total_hours_day} hrs` : "0:00 hrs",
    late_minutes: record.late_minutes ? `${record.late_minutes} min` : "0 min",
  }));
  return (
    <Box sx={{ height: 400, width: "100%" }}>
       <div className="search-bar-container">
              <div className="heading-container">
                <span className="table-heading">Attendance Details</span>
              </div>
              <div className="search-container">
              <div className="calender-field">
              <input type="date" className="search-bar" />
                </div>
                <div className="department-field">
                  <select className="search-bar">
                    <option value="">Department</option>
                    <option value="hr">Human Resources</option>
                    <option value="it">IT Department</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div className="status-field">
                  <select className="search-bar">
                    <option value="">Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>
            </div>
      <DataGrid
        rows={formattedData}
        columns={columns}
        getRowId={(data) => data.user__id}
        disableColumnFilter
        disableColumnMenu
        sx={{
          "& .super-app-theme--header": {
            backgroundColor: "#0E2447 ",
            color: "white",
            textAlign: "center",
            fontFamily: 'Roboto',
            fontSize: '15px',
            fontWeight: '500',
            // textAlign: 'center'
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            // justifyContent: 'center'
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: 'center',
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
