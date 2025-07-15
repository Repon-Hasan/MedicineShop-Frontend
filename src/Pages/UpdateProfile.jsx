import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../../Firebase";
import AuthContext from "../../AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

function UpdateProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [role, setRole] = useState("user");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      return () => URL.revokeObjectURL(previewURL);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const res = await axios.get(`https://backend-nu-livid-37.vercel.app/user/${user.email}`);
          const userData = res.data;
          setRole(userData.role || "user");

          reset({
            username: userData.username || user.displayName || "",
            email: userData.email || user.email || "",
            password: "",
            role: userData.role || "user",
            image: null,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = user.photoURL;

      if (data.image?.[0]) {
        const formDataImage = new FormData();
        formDataImage.append("file", data.image[0]);
        formDataImage.append("upload_preset", "public_signup");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dum3hqgvv/image/upload",
          formDataImage
        );
        imageUrl = response.data.secure_url;
      }

      await updateProfile(auth.currentUser, {
        displayName: data.username,
        photoURL: imageUrl,
      });

      if (data.email !== user.email) {
        await updateEmail(auth.currentUser, data.email);
      }

      if (data.password && data.password.length >= 6) {
        await updatePassword(auth.currentUser, data.password);
      }

      const userData = {
        username: data.username,
        email: data.email,
        photoURL: imageUrl,
        role: data.role,
        updatedAt: new Date().toISOString(),
      };

      await axios.put(`https://backend-nu-livid-37.vercel.app/user/${user.email}`, userData);

      await auth.currentUser.reload();

      const updatedUser = {
        ...auth.currentUser,
        displayName: data.username,
        photoURL: imageUrl,
        email: data.email,
      };

      setUser(updatedUser);
      setRole(data.role);

      toast.success("Profile updated successfully!");
      reset({ password: "" });
      setImagePreview(null);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading user data...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <Helmet>
        <title>UpdateProfile | MediShop</title>
        <meta name="description" content="Browse and update your profile, image, and role." />
      </Helmet>

      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={imagePreview || user.photoURL || "/default-profile.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-green-500 shadow"
        />
        <h2 className="text-xl font-bold mt-4">{user.displayName}</h2>
        <p className="text-gray-600">{user.email}</p>
        <span className="mt-2 px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
          Role: {role}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">
        Update Your Profile
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Leave blank to keep current password"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

   

        <div>
          <label htmlFor="image" className="block mb-1 font-medium">
            Upload New Profile Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register("image")}
            className="w-full border px-3 py-2 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="New Preview"
              className="mt-3 w-24 h-24 rounded-full object-cover border-2 border-dashed border-green-400 mx-auto"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
