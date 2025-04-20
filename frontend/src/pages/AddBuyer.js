import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminSidebar from "../components/SuperAdminSidebar";

// import the global layout/css from AdminsList (contains .superadmin-layout, .superadmin-main, etc)
import "./AdminsList.css";
// import just the AddBuyer page styles
import "./AddBuyer.css";

const BACKEND_URL = "http://localhost:8070/api";

const AddBuyer = () => {
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch existing buyers for the summary panel
  const fetchBuyers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const buyersOnly = res.data.users.filter((u) => u.role === "buyer");
      setBuyers(buyersOnly);
    } catch {
      console.error("Error fetching buyers");
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/users`,
        { ...formData, role: "buyer" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Buyer added!");
      navigate("/superadmin/buyers");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />

      <main className="superadmin-main">
        <div className="add-buyer-content">
          <form className="formCard" onSubmit={handleSubmit}>
            <h2 className="title">Add New Buyer</h2><br/>
           

            {error && <div className="error">{error}</div>}

            <div className="inputGroup">
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter buyer's first name"
                required
              />
            </div>
            <div className="inputGroup">
              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter buyer's last name"
                required
              />
            </div>
            <div className="inputGroup">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter buyer's email"
                required
              />
            </div>
            <div className="inputGroup">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <button type="submit" className="button" disabled={loading}>
              {loading ? "Creating..." : "Create Buyer"}
            </button>
          </form>

          <div className="buyers-summary">
            <h3>📊 Total Buyers: {buyers.length}</h3>
            <ol>
              {buyers.map((b) => (
                <li key={b._id}>
                  {b.firstName} {b.lastName}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBuyer;