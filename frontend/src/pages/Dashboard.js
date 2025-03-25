import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:8070/api/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Error fetching dashboard data");
      } else {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setMessage("Error fetching dashboard data");
    }
  };

  // On mount, fetch data
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/home");
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const newFirstName = prompt("Enter new first name:");
    const newLastName = prompt("Enter new last name:");
    if (!newFirstName || !newLastName) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8070/api/dashboard/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName: newFirstName, lastName: newLastName }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchDashboardData();
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8070/api/dashboard/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/home");
      } else {
        alert(data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Error deleting profile");
    }
  };

  // Display message or loading
  if (message) {
    return <div>{message}</div>;
  }
  if (!dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  // Render based on user type
  switch (dashboardData.userType) {
    case "super-admin":
      // Optionally redirect to a dedicated route
      navigate("/superadmin");
      return null;

    case "admin":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Admin Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <p>Admin type: {dashboardData.adminType}</p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );

    case "seller":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Seller Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );

    case "buyer":
      return (
        <div className="account-container">
          <div className="account-header">
            <Link to="/home" className="home-button">Home</Link>
            <h2>MY ACCOUNT</h2>
            <button className="logout-button" onClick={handleLogout}>
              LOG OUT
            </button>
          </div>

          <div className="account-content">
            {/* Left column: Order History */}
            <div className="order-history">
              <h3>ORDER HISTORY</h3>
              <p>You haven't placed any orders yet.</p>
            </div>

            {/* Right column: Account Details */}
            <div className="account-details">
              <h3>ACCOUNT DETAILS</h3>
              <p className="buyer-name">
                {dashboardData.firstName} {dashboardData.lastName}
              </p>
              <p className="buyer-address">Sri Lanka</p>
              <div className="addressr">
                <Link to="/address" className="address-link">View Address</Link>
              </div>

              {/* Buttons at bottom-right */}
              <div className="account-actions">
                <button
                  onClick={handleUpdateProfile}
                  className="update-profile-button"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="delete-profile-button"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ padding: "20px" }}>
          <h2>Unknown Role</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
  }
}

export default Dashboard;