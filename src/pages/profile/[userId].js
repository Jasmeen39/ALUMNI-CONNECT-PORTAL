import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { getProfile, updateProfile } from "@/services/profile.service";
import { toast } from "react-toastify";
import { format } from "date-fns";

const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { user: loggedInUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    graduationYear: "",
  });

  const isOwnProfile = loggedInUser?.userId?.toString() === userId?.toString();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileId = userId || loggedInUser?.userId;
      if (!profileId) {
        setError("No user ID provided");
        return;
      }

      const data = await getProfile(profileId);
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        graduationYear: data.graduationYear,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId || loggedInUser?.userId) {
      fetchProfile();
    }
  }, [userId, loggedInUser?.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isOwnProfile) {
        toast.error("You can only edit your own profile!");
        return;
      }

      const updateData = {
        userId: loggedInUser.userId,
        ...formData
      };

      await updateProfile(updateData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      graduationYear: profile.graduationYear,
    });
  };

  const handleOpenPasswordModal = () => setIsPasswordModalOpen(true);
  const handleClosePasswordModal = () => setIsPasswordModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-maroon text-white rounded hover:bg-maroon-dark"
            >
              Return Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-maroon px-6 py-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </h1>
              {isOwnProfile && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-white text-maroon rounded hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleOpenPasswordModal}
                    className="px-4 py-2 bg-white text-maroon rounded hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
            <p className="text-white/80 mt-2">{profile?.email}</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-maroon text-white rounded-md hover:bg-maroon-dark"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-gray-900 capitalize">{profile?.role}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                    <p className="mt-1 text-gray-900">{profile?.graduationYear || "N/A"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-gray-900">
                      {profile?.createdAt
                        ? format(new Date(profile.createdAt), "MMMM d, yyyy")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-gray-900">
                      {profile?.isApproved ? "Approved" : "Pending Approval"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Post Count</label>
                  <p className="mt-1 text-gray-900">{profile?.postCount || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {isPasswordModalOpen && <ChangePasswordModal onClose={handleClosePasswordModal} />}
    </div>
  );
};

export default ProfilePage;
