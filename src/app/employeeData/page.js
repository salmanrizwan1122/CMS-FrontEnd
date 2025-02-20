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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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
        profile_pic: "/man.png",
        department: "",
        cnicno: "",
        role: "",
        joining_date: "",
        address: "",
        age: "",
        totalperiod: "",
        username: "",
        password: ""
      });
      setIsAdding(false);
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
      profile_pic: "",
      department: "",
      cnicno: "",
      role: "",
      joining_date: "",
      address: "",
      age: "",
      username: "",
      totalperiod: "",
      password: ""
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
      fetchEmployees()
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(`Error: ${error.message}`);
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
        profile_pic: editedEmployee.profile_pic, // Include the profile_pic field
      };
      updateEmployee(editedEmployee.id, updatedData);
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedEmployee({ ...editedEmployee, profile_pic: reader.result });  // No need to split or alter the result
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveNewEmployee = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        first_name: editedEmployee.name,
        email: editedEmployee.email,
        password: editedEmployee.password,
        age: editedEmployee.age,
        address: editedEmployee.address,
        phone: editedEmployee.phone,
        department_id: selectedDepartment,
        designation_id: selectedDesignation,
        cnicno: editedEmployee.cnicno,
        role_id: selectedRole,
        username: editedEmployee.username,
        joining_date: editedEmployee.joining_date,
        profile_pic: editedEmployee.profile_pic
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(`${API_BASE_URL}users/api/create/`, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to add new employee: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("New Employee Added:", result);
      fetchEmployees();
      setIsAdding(false);
      closeModal();
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error adding new employee:", error);
      alert(`Error: ${error.message}`);
    }
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
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee); 
    setShowDeleteModal(true); 
  };
  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage.");
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: null,
        redirect: "follow",
      };
      const response = await fetch(`${API_BASE_URL}users/api/${employeeToDelete.id}/delete/`, requestOptions);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.text();
      console.log("Employee deleted:", result);
      setShowDeleteModal(false);
      closeModal();
      fetchEmployees();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
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
        <h2 className="main-heading">Employee Data</h2>
        <div className="search-bar-container">
          <div className="add-btn-container">
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
                <img
                  src={employee.profile_pic ? employee.profile_pic : "/man.png"}
                  alt="Profile"
                  className="employee-img"
                />
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icons">
                {!isEditing && !isAdding && hasPermission("update", "user_management") && (
                  <img className="icon" src="edit.png" onClick={handleEditClick} alt="Edit" />
                )}
                {!isEditing && !isAdding && hasPermission("delete", "user_management") && (
                  <img className="icon" src="delete.png" alt="Delete" onClick={() => handleDeleteClick(editedEmployee)} />
                )}
                <img className="icon" src="close.png" onClick={closeModal} alt="Close" />
              </div>
              <div className="modal-header">
                <div className="image-upload-container">
                  <label htmlFor="imageUpload" style={{ cursor: isEditing || isAdding ? "pointer" : "default" }}>
                    <div className="image-wrapper">
                      <img
                        src={editedEmployee.profile_pic ? editedEmployee.profile_pic : "/man.png"}
                        alt="Base64 Image"
                        className="modal-image"
                      />
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
                    <input name="password" type="password" value={editedEmployee?.password || ""} onChange={handleChange} />
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
                    disabled={!isEditing && !isAdding}
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
              {showDeleteModal && (
                <div className="delete-modal-overlay">
                  <div className="delete-modal-content">
                    <div className="delete-modal-icon">
                      {/* <img className="icon" src="delete.png" alt="Delete" onClick={() => handleDeleteClick(editedEmployee)} /> */}
                      <svg onClick={() => handleDeleteClick(editedEmployee)} width="60" height="74" viewBox="0 0 60 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.31821 42.1117C3.31821 35.9654 3.31404 29.8191 3.3203 23.6727C3.32239 21.7213 4.37634 20.3856 6.11694 20.0809C8.0391 19.7428 9.84439 21.1537 9.98631 23.1134C10.0072 23.3993 9.99675 23.6852 9.99675 23.9733C9.99675 35.98 9.99675 47.9847 9.99675 59.9914C9.99675 63.9839 12.7162 66.6992 16.717 66.7013C25.5702 66.7013 34.4235 66.7013 43.2746 66.7013C47.2734 66.7013 49.9949 63.9818 49.9949 59.9914C49.9949 47.8824 49.9949 35.7713 49.997 23.6623C49.997 21.786 51.0008 20.4462 52.6413 20.1101C54.5259 19.722 56.279 20.9178 56.6004 22.8254C56.6609 23.1823 56.6734 23.5496 56.6734 23.9127C56.6776 35.9696 56.6797 48.0285 56.6755 60.0853C56.6734 66.695 52.2552 72.0044 45.7624 73.1857C44.9985 73.3255 44.2096 73.3735 43.4311 73.3756C34.4736 73.3881 25.5181 73.3902 16.5605 73.3819C9.1181 73.3756 3.32865 67.5945 3.31821 60.1626C3.31195 54.1435 3.31821 48.1287 3.31821 42.1117Z" fill="white" />
                        <path d="M43.3188 10.0068C44.1912 10.0068 44.9425 10.0068 45.6959 10.0068C49.2877 10.0068 52.8795 9.99015 56.4734 10.0131C58.909 10.0298 60.5118 12.0981 59.8502 14.3103C59.4579 15.621 58.3058 16.5602 56.943 16.6749C56.7614 16.6896 56.5798 16.6875 56.3962 16.6875C38.8003 16.6875 21.2024 16.6895 3.60655 16.6854C1.48611 16.6875 -0.0165586 15.2745 0.000137757 13.3211C0.0168341 11.4052 1.50489 10.0173 3.59611 10.011C7.60532 9.9985 11.6145 10.0068 15.6216 10.0068C15.9305 10.0068 16.2415 10.0068 16.6777 10.0068C16.6777 9.675 16.6777 9.4016 16.6777 9.1282C16.6777 7.25404 16.6652 5.37987 16.6819 3.50362C16.7006 1.41032 18.0593 0.0182616 20.1547 0.0140875C26.7143 -0.00469584 33.2738 -0.00469584 39.8334 0.0140875C41.9351 0.0203487 43.2958 1.40406 43.3125 3.49945C43.3334 5.62823 43.3188 7.7591 43.3188 10.0068ZM23.3583 9.93797C27.8246 9.93797 32.2241 9.93797 36.6131 9.93797C36.6131 8.81932 36.6131 7.77162 36.6131 6.73436C32.1635 6.73436 27.7807 6.73436 23.3583 6.73436C23.3583 7.81128 23.3583 8.84019 23.3583 9.93797Z" fill="white" />
                        <path d="M19.9979 41.6968C19.9979 37.792 19.9853 33.8892 20.0062 29.9843C20.0146 28.3544 21.1541 27.05 22.7444 26.7411C24.1866 26.4614 25.7456 27.2399 26.3341 28.6278C26.5512 29.1391 26.6618 29.7339 26.6639 30.2911C26.6847 37.8921 26.6847 45.4911 26.6743 53.0921C26.6722 55.2188 25.2468 56.7152 23.2954 56.6964C21.3795 56.6776 20.002 55.1854 20 53.0983C19.9937 49.2978 19.9958 45.4973 19.9979 41.6968Z" fill="white" />
                        <path d="M39.9995 41.711C39.9995 45.5888 40.0099 49.4686 39.9932 53.3463C39.987 54.922 39.0123 56.1596 37.5305 56.5687C36.1051 56.9631 34.544 56.3892 33.8427 55.0806C33.5359 54.5088 33.3439 53.8013 33.3418 53.1543C33.3084 45.5011 33.3105 37.85 33.3272 30.1968C33.3314 28.1369 34.7965 26.6655 36.7228 26.6948C38.6095 26.7219 39.9932 28.2058 39.9974 30.2344C40.0057 34.0599 40.0016 37.8855 39.9995 41.711Z" fill="white" />
                      </svg>
                    </div>
                    <h2 className="delete-modal-title" >Are you Sure?</h2>
                    <p className="delete-modal-desc">Do you really want to Remove this? {employeeToDelete?.name}?</p>
                    <div className="delete-modal-footer">
                      <button className="no-btn" onClick={() => setShowDeleteModal(false)}>No</button>
                      <button className="yes-btn" onClick={confirmDelete}>Yes</button>
                    </div>
                  </div>
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





