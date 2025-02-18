'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const data = await response.json();

      // Store data in sessionStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.user.email);
      sessionStorage.setItem("designation", data.user.designation.name);
      sessionStorage.setItem("department", data.user.department.name);
      sessionStorage.setItem("permissions", JSON.stringify(data.user.permissions));

      // Redirect to Employee Data Page
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials!"); // Show toast on error
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="main_container">
      <div className="login_container">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="w-24 h-auto" />
        </div>
        <h2 className="main_heading">Log in</h2>

        <form className="main_form" onSubmit={handleLogin}>
          <div className="email">
            <label className="heading">Email</label>
            <input
              className="input_field"
              placeholder="Please Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password">
            <label className="heading">Password</label>
            <input
              type="password"
              className="input_field"
              placeholder="Please Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="forgot">Forgot Password?</button>
          </div>
          <div className="btn">
            <button type="submit" className="login_btn" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" /> // MUI CircularProgress as the loader
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
