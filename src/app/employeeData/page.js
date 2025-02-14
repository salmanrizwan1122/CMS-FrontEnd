"use client";

import React, { useEffect, useState } from "react";
import Layout from "../component/layout/layout";
import { Camera } from "lucide-react"; // Import camera icon
import "./EmployeeData.css";
import { API_BASE_URL } from "../network/url";

const EmployeeData = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {

    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const response = await fetch(`${API_BASE_URL}users/api/get-all/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
      }
      const data = await response.json();
      setEmployees(data.users);
      if (data.users.length > 0) {
        const firstEmployee = data.users[0];
        setSelectedDepartment(firstEmployee.department?.id || "");
        setSelectedDesignation(firstEmployee.designation?.id || "");
        setSelectedRole(firstEmployee.roles.length > 0 ? firstEmployee.roles[0].id : "");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert(`Error: ${error.message}`);
    }
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No token found in session storage.");
        }

        const roleResponse = await fetch(`${API_BASE_URL}/roles/api/get-all/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!roleResponse.ok) {
          throw new Error(`Failed to fetch role: ${roleResponse.statusText}`);
        }

        const roleData = await roleResponse.json();
        setRoles(roleData.roles);
        console.log("Roles fetched:", roleData.roles);

        // If a department is selected, update the designations

      } catch (error) {
        console.error("Error fetching roles:", error);
        alert(`Error: ${error.message}`);
      }
    };

    fetchRoles();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching departments...");
        const departmentResponse = await fetch(`${API_BASE_URL}departments/api/get-all/`);
        if (!departmentResponse.ok) {
          throw new Error(`Failed to fetch departments: ${departmentResponse.statusText}`);
        }
        const departmentData = await departmentResponse.json();
        setDepartments(departmentData.departments);
        console.log("Departments fetched:", departmentData.departments);
        if (selectedDepartment) {
          const department = departmentData.departments.find(dept => dept.id === selectedDepartment);
          if (department) {
            setDesignations(department.designations);
            console.log("Designations fetched:", department.designations);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Error: ${error.message}`);
      }
    };
    fetchData();
  }, [selectedDepartment]);
  const handleDepartmentChange = (e) => {
    const departmentId = parseInt(e.target.value);
    setSelectedDepartment(departmentId);
    setSelectedDesignation(""); // Reset designation when department changes
  };
  const handleRoleChange = (e) => {
    const roleId = parseInt(e.target.value);
    setSelectedRole(roleId);
  };
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setEditedEmployee({ ...employee });
    setIsEditing(false);
    setIsAdding(false);
    if (!isAdding) {
      setSelectedDepartment(employee?.department?.id || "");
      setSelectedDesignation(employee?.designation?.id || "");
      setSelectedRole(employee?.roles.length > 0 ? employee.roles[0].id : "");
    }
  };
  const closeModal = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setIsAdding(false);
    setSelectedDepartment("");
    setSelectedDesignation("");
    setSelectedRole("")
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelClick = () => {
    if (isAdding) {
      setEditedEmployee({
        id: "",
        name: "",
        designation: "",
        email: "",
        phone: "",
        image: "/man.png",
        department: "",
        cnicno: "",
        role: "",
        joining_date: "",
        address: "",
        age: "",
        totalperiod: "",
        username:"",
        password:""
      });
      setIsAdding(false); // Exit add mode
    } else {
      setEditedEmployee(selectedEmployee);
      setIsEditing(false);
    }
  };
  const handleChange = (e) => {
    setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
  };
  const openAddEmployeeModal = () => {
    setIsAdding(true);
    setSelectedEmployee(null);
    setEditedEmployee({
      id: "",
      name: "",
      designation: "",
      email: "",
      phone: "",
      image: "",
      department: "",
      cnicno: "",
      role: "",
      joining_date: "",
      address: "",
      age: "",
      username : "",
      totalperiod: "",
      password:""
    });
    setSelectedRole("");
  };
  const updateEmployee = async (employeeId, updatedData) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify(updatedData);
      const requestOptions = {
        method: "Post", // 
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        `${API_BASE_URL}users/api/${employeeId}/edit/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Failed to update employee: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("Employee updated successfully:", result);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === employeeId ? { ...emp, ...updatedData } : emp
        )
      );
      closeModal();
      setIsEditing(false);
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(`Error: ${error.message}`);
    }
    finally {
      fetchEmployees()
    }
  };

  const handleUpdateClick = () => {
    if (editedEmployee) {
      const updatedData = {
        first_name: editedEmployee.name, 
        email: editedEmployee.email,
        age: editedEmployee.age,
        address: editedEmployee.address,
        department_id: selectedDepartment,
        designation_id: selectedDesignation,
        cnicno: editedEmployee.cnicno,
        role_id: selectedRole,
        phone: editedEmployee.phone,
        joining_date: editedEmployee.joining_date,
      };

      updateEmployee(editedEmployee.id, updatedData);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedEmployee({ ...editedEmployee, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveNewEmployee = () => {
    console.log("New Employee Added:", editedEmployee);
    setIsAdding(false);
    closeModal();
  };
  const calculateJobPeriod = (joining_Date) => {
    if (!joining_Date) return "";
    const startDate = new Date(joining_Date);
    const currentDate = new Date();
    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  };
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    // Check if window and sessionStorage are available (client-side)
    if (typeof window !== "undefined" && sessionStorage) {
      const permissionsFromSession = JSON.parse(sessionStorage.getItem("permissions")) || [];
      setPermissions(permissionsFromSession);
    }
  }, []); const hasPermission = (action, module) => {
    return permissions.some(permission => permission.action === action && permission.module === module);
  };
  useEffect(() => {
    if (editedEmployee?.joining_date) {
      const jobPeriod = calculateJobPeriod(editedEmployee.joining_date);
      console.log(jobPeriod)
      setEditedEmployee((prevState) => ({
        ...prevState,
        totalperiod: jobPeriod,
      }));
    }
  }, [editedEmployee?.joining_date]);
  return (
    <Layout>
      <div className="employee-container">
        {/* Search Bars */}
        <h2 className="main-heading">Employee Data</h2>
        <div className="search-bar-container">
          <div>
            {hasPermission("create", "user_management") && (
              <div className="add-btn" onClick={openAddEmployeeModal}>
                <img src="add.png" alt="Add Employee" />
                <button>Add Employee</button>
              </div>
            )}
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
        <div className="employee-card-main">
          {employees.map((employee) => (
            <div className="employee-card" key={employee.id} onClick={() => openModal(employee)}>
              <div className="employee-image">
                <img src={employee.image || 'man.png'} alt={employee.name} className="employee-img" />
              </div>
              <div className="employee-info">
                <h3 className="employee-name">{employee.name}</h3>
                <p className="employee-designation">
                  {employee.designation ? employee.designation.name : 'No Designation'}
                </p>
                <p className="employee-email">{employee.email}</p>
                <p className="employee-phone">{employee.phone}</p>
              </div>
            </div>
          ))}
        </div>
        {(selectedEmployee || isAdding) && (
          <div className="modal-overlay" onClick={closeModal}>
            {/* <span className="close-btn" onClick={closeModal}>&times;</span> */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icons">
                {/* Edit Button */}
                {!isEditing && !isAdding && hasPermission("update", "user_management") && (
                  <img className="icon" src="edit.png" onClick={handleEditClick} alt="Edit" />
                )}
                {/* Delete Button */}
                {!isEditing && !isAdding && hasPermission("delete", "user_management") && (
                  <img className="icon" src="delete.png" alt="Delete" />
                )}
                <img className="icon" src="close.png" onClick={closeModal} alt="Close" />
              </div>


              {/* Header Section (Image + Basic Details) */}
              <div className="modal-header">
                {/* Image Upload Section */}
                <div className="image-upload-container">
                  <label htmlFor="imageUpload" style={{ cursor: isEditing || isAdding ? "pointer" : "default" }}>
                    <div className="image-wrapper">
                      {/* Employee Image */}
                      <img
                        src={editedEmployee?.image || "man.png"}
                        alt="Employee"
                        className="modal-image"
                      />

                      {/* Show Camera Icon Only in Edit/Add Mode */}
                      {(isEditing || isAdding) && (
                        <div className="camera-icon">
                          <Camera size={24} color="white" />
                        </div>
                      )}
                    </div>
                  </label>
                  {(isEditing || isAdding) && (
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  )}
                </div>

                <div className="modal-info">
                  <div className="form-group">
                    <label>Name:</label>
                    <input name="name" type="text" value={editedEmployee?.name || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                  </div>
                  {!isAdding && (
                    <div className="form-group">
                      <label>Employee ID:</label>
                      <input name="id" type="text" value={editedEmployee?.id || ""} onChange={handleChange} disabled />
                    </div>
                  )}


                  <div className="form-group">
                    <label>CNIC No:</label>
                    <input name="cnicno" type="text" value={editedEmployee?.cnicno || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                  </div>
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      value={selectedRole}
                      onChange={handleRoleChange}
                      disabled={!(isEditing || isAdding)}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Address:</label>
                    <input name="address" type="text" value={editedEmployee?.address || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                  </div>
                  <div className="form-group">
                    <label>Age:</label>
                    <input name="age" type="text" value={editedEmployee?.age || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                  </div>
                </div>
              </div>
              {/* Remaining Form Fields */}
              <div className="modal-body">
              <div className="form-group">
                  <label>Email:</label>
                  <input name="email" type="email" value={editedEmployee?.email || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                </div>
                <div className="form-group">
                  <label>Username:</label>
                  <input name="username" type="text" value={editedEmployee?.username || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                </div>
                {isAdding && (
                    <div className="form-group">
                      <label>Password:</label>
                      <input name="password" type="password" value={editedEmployee?.password || ""} onChange={handleChange}  />
                    </div>
                  )}
                <div className="form-group">
                  <label>Phone:</label>
                  <input name="phone" type="text" value={editedEmployee?.phone || ""} onChange={handleChange} readOnly={!isEditing && !isAdding} />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <select
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    disabled={!(isEditing || isAdding)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Designation:</label>
                  <select
                    value={selectedDesignation}
                    onChange={(e) => setSelectedDesignation(e.target.value)}
                    disabled={!selectedDepartment || !designations.length || !isEditing && !isAdding}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation) => (
                      <option key={designation.id} value={designation.id}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                </div>

              
                <div className="form-group">
                  <label>Joining Date:</label>
                  <input
                    name="joining_date"
                    type="date"
                    value={editedEmployee?.joining_date || ""}
                    onChange={handleChange}
                    disabled={!isEditing && !isAdding} // Make the dropdown editable only in editing or adding mode
                  />
                </div>
                <div className="form-group">
                  <label>Total Job Period:</label>
                  <input
                    name="totalperiod"
                    type="text"
                    value={editedEmployee?.totalperiod || ""}
                    readOnly
                  />
                </div>
              </div>
              {(isEditing || isAdding) && (
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                  <button className="update-btn" onClick={isAdding ? handleSaveNewEmployee : handleUpdateClick}>
                    {isAdding ? "Save" : "Update"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeData;





