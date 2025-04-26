import React from "react";
import "./AccountDrawer.css";

export default function AccountDrawer({
  isOpen,
  onClose,
  userName,
  onAccountDetails,
  onAddresses,
  onChangePassword,  // ✅ added
  onUpdateProfile,
  onDeleteProfile,
  onLogout,
}) {
  return (
    <div
      className={`drawer-overlay${isOpen ? " open" : ""}`}
      onClick={onClose}
    >
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Hi, {userName}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <ul className="drawer-menu">
          <li
            onClick={() => {
              onAccountDetails();
              onClose();
            }}
          >
            Account Details
          </li>

          <li
            onClick={() => {
              onAddresses();
              onClose();
            }}
          >
            Addresses
          </li>

          <li
            onClick={() => {
              onChangePassword();  // ✅ trigger the handler
              onClose();
            }}
          >
            Change Password
          </li>

          <li
            onClick={() => {
              onUpdateProfile();
              onClose();
            }}
          >
            Update Profile
          </li>

          <li
            onClick={() => {
              onDeleteProfile();
              onClose();
            }}
          >
            Delete Profile
          </li>

          <li
            className="danger"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            Log Out
          </li>
        </ul>
      </div>
    </div>
  );
}