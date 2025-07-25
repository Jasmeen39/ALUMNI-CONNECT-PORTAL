import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";

const ChangePasswordModal = ({ onClose }) => {
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const { user } = useUser(); // Get full user object
const userId = user?.userId; // Extract userId


  const handleChangePassword = async () => {
    setError(""); // Reset errors
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("⚠️ Please fill in all fields.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });
  
      const text = await response.text(); // Read response as text first
      console.log("Response text:", text); // Debugging
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text); // Try parsing JSON if possible
          setError(errorData.message || "⚠️ Failed to change password.");
        } catch {
          setError("⚠️ Failed to change password. Unexpected server response.");
        }
        return;
      }
  
      alert("✅ Password changed successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error changing password:", error);
      setError("⚠️ An error occurred while changing the password.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input 
          type="password" 
          placeholder="Old Password" 
          className="border p-2 w-full mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="New Password" 
          className="border p-2 w-full mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="Confirm Password" 
          className="border p-2 w-full mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button className="text-gray-600 mr-4" onClick={onClose}>Cancel</button>
          <button 
            className="bg-maroon text-white px-4 py-2 rounded-md"
            onClick={handleChangePassword}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
