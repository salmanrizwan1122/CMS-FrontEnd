"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip, IconButton} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import './leaves.css';
import { API_BASE_URL } from "@/app/network/url";

const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return { background: "#00C30740", color: "black" };
    case "Rejected":
      return { backgroundColor: "#FF00004D", color: "black" };
    case "Pending":
      return { backgroundColor: "#6E7E8669", color: "black" };
    default:
      return { backgroundColor: "#ccc", color: "black" };
  }
};

const LeavesTable = ({ data ,fetchLeaves }) => {
  const [filters, setFilters] = useState({ date: "", status: "" });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleOpenDialog = (leave) => {
    setSelectedLeave(leave);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAction = async (leave_id, action) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const myHeaders = new Headers();
        myHeaders.append("Authorization", `Token ${token}`);
        myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ leave_id, action });

      const response = await fetch(`${API_BASE_URL}leave/api/update-status/`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      const result = await response.json();
      console.log(result);
      setSelectedLeave({ ...selectedLeave, status: action === "approve" ? "Approved" : "Rejected" });
      fetchLeaves()
      setOpenDialog(false)
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const columns = [
    { field: "user_id", headerName: "Emp ID", headerClassName: "super-app-theme--header", flex: 1 },
    {
      field: "username",
      headerName: "Name",
      headerClassName: "super-app-theme--header",
      flex: 2,
      renderCell: (params) => (
        <Box display="flex" gap={2} alignItems="center">
          <Avatar src={params.row.user_profile_pic || "/man.png"} alt={params.value} />
          <Box>
            <Typography variant="body1" fontWeight={500}>{params.value}</Typography>
            <Typography variant="body2" color="gray" fontSize={'12px'}>
              {params.row.user_designation || "N/A"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: "leave_type", headerName: "Leave Type", headerClassName: "super-app-theme--header", flex: 1 },
    { field: "leave_from", headerName: "From", headerClassName: "super-app-theme--header", flex: 1 },
    { field: "leave_to", headerName: "To", headerClassName: "super-app-theme--header", flex: 1 },
    { field: "leave_days", headerName: "No of Days", headerClassName: "super-app-theme--header", flex: 1 },
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
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "super-app-theme--header",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <img
            src="/delete.png"
            alt="Delete"
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
        </IconButton>
      ),
    },
  ];

  const formattedData = data.map((leave) => ({
    id: leave.id,
    user_id: leave.user_id,
    username: leave.user_username,
    user_profile_pic: leave.user_profile_pic,
    user_designation: leave.user_designation,
    leave_type: leave.leave_type,
    leave_from: leave.leave_from,
    leave_to: leave.leave_to,
    leave_days: leave.leave_days,
    status: leave.status,
    reason:leave.reason,
    approved_by: leave.approved_by || "N/A",
    approved_date: leave.approved_date || "N/A",
    approved_time: leave.approved_time || "N/A",
  }));

  const filteredData = formattedData.filter((row) => {
    return (
      (filters.date ? row.leave_from === filters.date || row.leave_to === filters.date : true) &&
      (filters.status ? row.status === filters.status : true)
    );
  });

  return (
    <>
    <Box sx={{ width: "100%" }}>
      <div className="dropdown-container">
        <div className="heading-container">
          <span className="table-heading">Leaves Details</span>
        </div>
        <div className="dropdowns-container" style={{ display: "flex", gap: "10px" }}>
          <div className="calender-field">
            <input
              type="date"
              name="date"
              className="dropdown"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="status-field">
            <select
              name="status"
              className="dropdown"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Status</option>
              <option value="Rejected">Rejected</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
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
        onRowClick={(params) => handleOpenDialog(params.row)}
        sx={{
          height: 400,
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
   
  
   
     {openDialog && selectedLeave && (
      <div className="attandance-modal-overlay" onClick={handleCloseDialog} >
      <div className="attandance-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="attandance-modal-icons">
          <img className="icon" src="close.png" onClick={handleCloseDialog} alt="Close" />
        </div>
        <div className="attandance-modal-header">
          <div className="image-upload-container">
            <label htmlFor="imageUpload" >
              <div className="image-wrapper">
                <img
                  src={selectedLeave.user_profile_pic ? selectedLeave.user_profile_pic : "/man.png"}
                  alt="Base64 Image"
                  className="attandance-modal-image"
                />
              </div>
            </label>
          </div>
          <div className="attandance-modal-info">
          <div className="form-group">
                <label>Leave ID:</label>
                <input name="id" type="text" value={selectedLeave?.id || ""}  disabled />
              </div>
            <div className="form-group">
              <label>Name:</label>
              <input name="name" type="text" value={selectedLeave?.username || ""}  readOnly/>
            </div>
            <div className="form-group">
              <label>From</label>
              <input name="From" type="text" value={selectedLeave?.leave_from || ""}  readOnly/>
            </div>
            <div className="form-group">
              <label>To</label>
              <input name="To" type="text" value={selectedLeave?.leave_to || ""}  readOnly/>
            </div>
            <div className="form-group">
              <label>Leave Type</label>
              <input name="type" type="text" value={selectedLeave?.leave_type|| ""}  readOnly/>
            </div>
            <div className="form-group">
              <label>Status</label>
              <input name="status" type="text" value={selectedLeave?.status|| ""}  readOnly/>
            </div>
          </div>
        </div>
       
        <div className="attandance-modal-body">
        <div className="form-group">
            <label>Leaves Days</label>
            <input name="days" type="text" value={selectedLeave?.leave_days|| ""}  readOnly/>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input name="designation" type="text" value={selectedLeave?.user_designation || ""}  readOnly/>
          </div>
          {selectedLeave.status === "Approved" && (
            <>
          <div className="form-group">
            <label>Approved By</label>
            <input name="approved_by" type="text" value={selectedLeave?.approved_by || ""}  readOnly/>
          </div>
           <div className="form-group">
            <label>Approved Date</label>
            <input name="approved_date" type="text" value={selectedLeave?.approved_date || ""}  readOnly/>
          </div> 
          <div className="form-group">
            <label>Approved Time</label>
            <input name="approved_time" type="text" value={selectedLeave?.approved_time || ""}  readOnly/>
          </div>
          </>
          )}
               {selectedLeave.status === "Rejected" && (
            <>
          <div className="form-group">
            <label>Rejected By</label>
            <input name="approved_by" type="text" value={selectedLeave?.approved_by || ""}  readOnly/>
          </div>
           <div className="form-group">
            <label>Rejected Date</label>
            <input name="approved_date" type="text" value={selectedLeave?.approved_date || ""}  readOnly/>
          </div> 
          <div className="form-group">
            <label>Rejected Time</label>
            <input name="approved_time" type="text" value={selectedLeave?.approved_time || ""}  readOnly/>
          </div>
          </>
          )}
          <div className="form-group">
            <label>Reason</label>
            <input name="reason" type="text" value={selectedLeave?.reason || ""}  readOnly/>
          </div>
        </div>
        {selectedLeave.status === "Pending" && (
          <div className="attandance-modal-footer">
            <button className="reject-btn" onClick={() => handleAction(selectedLeave.id, "reject")} >Reject</button>
            <button className="approve-btn" onClick={() => handleAction(selectedLeave.id, "approve")} >
             Approve
            </button>
          </div>
        )}
      </div>
    </div>
    )}
     </>
  );
};

export default LeavesTable;
