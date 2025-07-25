import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../hooks/useUser";
import { getProfile, updateProfile } from "../services/profile.service";

const ProfilePage = () => {
  const { user: loggedInUser } = useUser();
  const router = useRouter();
  const { userId } = router.query; // Extract userId from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradYear: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const isOwnProfile = loggedInUser?.userId === userId || (!userId && loggedInUser); // Determine if it's the logged-in user's profile

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileId = userId || loggedInUser?.userId; // If no userId in URL, fetch logged-in user's profile
        if (!profileId) return;

        const data = await getProfile(profileId);
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          gradYear: data.graduationYear || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, loggedInUser]);

  const handleEditClick = () => setEditing(true);
  const handleCancelClick = () => {
    setEditing(false);
    setChangingPassword(false);
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      gradYear: profile.graduationYear,
    });
    setNewPassword("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      await updateProfile(loggedInUser.userId, formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    try {
      await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      alert("Password updated successfully!");
      setChangingPassword(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center p-8">
        <main className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold text-maroon border-b-2 border-maroon pb-2 mb-6 text-center">
            Profile
          </h1>

          {profile ? (
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">First Name:</label>
                {editing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                ) : (
                  <p className="text-gray-800">{profile.firstName}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Last Name:</label>
                {editing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                ) : (
                  <p className="text-gray-800">{profile.lastName}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Email:</label>
                <p className="text-gray-800">{profile.email}</p>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Graduation Year:</label>
                {editing ? (
                  <input
                    type="text"
                    name="gradYear"
                    value={formData.gradYear}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                ) : (
                  <p className="text-gray-800">{profile.graduationYear || "N/A"}</p>
                )}
              </div>

              {/* Action Buttons (Only for Own Profile) */}
              {isOwnProfile && (
                <div className="flex justify-between">
                  {editing ? (
                    <>
                      <button onClick={handleCancelClick} className="text-gray-500 px-4 py-2">
                        Cancel
                      </button>
                      <button onClick={handleSaveClick} className="bg-maroon text-white px-4 py-2 rounded-md">
                        Save
                      </button>
                    </>
                  ) : (
                    <button onClick={handleEditClick} className="bg-maroon text-white px-4 py-2 rounded-md">
                      Edit Profile
                    </button>
                  )}
                </div>
              )}

              {/* Change Password Section (Only for Own Profile) */}
              {isOwnProfile && (
                changingPassword ? (
                  <div className="mt-6 space-y-4">
                    <label className="font-semibold text-gray-700">New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                    <div className="flex justify-between">
                      <button onClick={() => setChangingPassword(false)} className="text-gray-500 px-4 py-2">
                        Cancel
                      </button>
                      <button onClick={handleChangePassword} className="bg-maroon text-white px-4 py-2 rounded-md">
                        Change Password
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md w-full"
                  >
                    Change Password
                  </button>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Profile not found</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
