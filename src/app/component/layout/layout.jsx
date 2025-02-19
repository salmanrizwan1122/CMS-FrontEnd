'use client';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname for Next.js App Router
import Link from "next/link";
import {FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./layout.css"; // Import custom CSS
const Sidebar = () => {
    
    const [openMenu, setOpenMenu] = useState(null);
    const pathname = usePathname(); // Get current route
    const toggleSubmenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };
 
    return (
        <div className="sidebar sidebar-open">
            <div className="sidebar-header">
                <img src="logo2.png" alt="Logo" />
            </div>
            <div className="menu-container">
                <div>
                    <h2 className="main_menu">Main Menu</h2>
                    <ul className="menu-list">
                        <li className={`menu-item ${pathname === "/dashboard" ? "active" : ""}`}>
                            <Link href="/dashboard" className="menu-link">
                                <div className="menu_image">
                                    <img src="employee.png" alt="Employee Data" />
                                </div>
                                <span className="show">Dashboard</span>
                            </Link>
                        </li>
                        <li className={`menu-item ${pathname === "/employeeData" ? "active" : ""}`}>
                            <Link href="/employeeData" className="menu-link">
                                <div className="menu_image">
                                    <img src="employee.png" alt="Employee Data" />
                                </div>
                                <span className="show">Employee Data</span>
                            </Link>
                        </li>
                        <li className={"menu-item "} >
                            <div className="menu-toggle" onClick={() => toggleSubmenu("attendance")}>
                                <span className="menu-text">
                                    <div className="menu_image">
                                        <img src="attendence.png" alt="Attendance" />
                                    </div>
                                    <span className="show">Attendance/Leave
                                        {openMenu === "attendance" ? <FaChevronDown /> : <FaChevronRight />}
                                    </span>
                                </span>
                            </div>

                        </li>
                        {openMenu === "attendance" && (
                            <ul className="submenu">
                                <li className={`menu-item ${pathname === "/attendance" ? "active" : ""}`}>
                                    <Link href="/attendance" className="menu-link">
                                        <span className="show">
                                            Attendance
                                        </span>
                                    </Link>
                                </li>
                                <li className={`menu-item ${pathname === "/leave" ? "active" : ""}`}>
                                    <Link href="/leave" className="menu-link">
                                        <span className="show">

                                            Leave
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                        <li className={`menu-item ${pathname === "/projects" ? "active" : ""}`}>
                            <Link href="/projects" className="menu-link">
                                <div className="menu_image">
                                    <img src="project.png" alt="Projects" />
                                </div>
                                <span className="show">Projects</span>
                            </Link>
                        </li>
                        <li className={`menu-item ${pathname === "/finance" ? "active" : ""}`}>
                            <Link href="/finance" className="menu-link">
                                <div className="menu_image">
                                    <img src="finance.png" alt="Finance" />
                                </div>
                                <span className="show">Finance</span>
                            </Link>
                        </li>
                        <li className={`menu-item ${pathname === "/role-management" ? "active" : ""}`}>
                            <Link href="/role-management" className="menu-link">
                                <div className="menu_image">
                                    <img src="role.png" alt="Role Management" />
                                </div>
                                <span className="show">Role Management</span>
                            </Link>
                        </li>
                        <li className={`menu-item ${pathname === "/settings" ? "active" : ""}`}>
                            <Link href="/settings" className="menu-link">
                                <div className="menu_image">
                                    <img src="employee.png" alt="Settings" />
                                </div>
                                <span className="show">Settings</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="logout">
                    <img src="/logout.png" />
                    <button>Log out</button>
                </div>
            </div>
        </div>
    );
};
const TopBar = () => {
    const [fullname, setFullname] = useState("");
    const [role, setRole] = useState("");
    useEffect(() => {
        setFullname(JSON.parse(sessionStorage.getItem("fullname")) || "Guest User");
        setRole(JSON.parse(sessionStorage.getItem("role"))|| "Employee");
    }, []);
    return (
        <div className="topbar">
            <div className="topmenu_image">
                <img src="mail.png" alt="Employee Data" />
            </div>
            <div className="topmenu_image">
                <img src="bellicon.png" alt="Employee Data" />
            </div>
            <div className="topmenu_image">
                <img src="setting.png" alt="Employee Data" />
            </div>
            <div className="userinfo">
                <div>
                    <p className="user-name">
                        {fullname}
                    </p>
                    <p className="user-role">
                        {role}
                    </p>
                </div>
                <div className="user-img">
                    <img src="man.png" />
                </div>
            </div>
        </div>
    );
};
const Layout = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content-area">
                <TopBar />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
