import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from '../../Firebase';
import AuthContext from '../../AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';

function SignUp() {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const imageFile = watch("image");

  // Live preview effect
  React.useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);

      // Cleanup preview URL
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [imageFile]);

  // Form-based signup
  const onSubmit = async (formData) => {
    const { username, email, password, image, role } = formData;
    const imageFile = image[0];

    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      // Upload image to Cloudinary
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);
      formDataImage.append("upload_preset", "public_signup");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dum3hqgvv/image/upload`,
        formDataImage
      );

      const imageUrl = response.data.secure_url;

      // Create Firebase user
      const result = await createUser(email, password);

      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: username,
        photoURL: imageUrl,
      });

      // Save to MongoDB via backend
      const userData = {
        username,
        email,
        photoURL: imageUrl,
        role,
        createdAt: new Date().toISOString(),
      };

      await axios.post("https://backend-nu-livid-37.vercel.app/signup", userData);

      toast.success("Account created successfully!");
      reset();
      setPreviewImage(null);
      navigate('/');
    } catch (error) {
      toast.error(error.message || "Signup failed!");
    }
  };

  // Google signup
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "user", // default role
        createdAt: new Date().toISOString(),
      };

      await axios.post("https://backend-nu-livid-37.vercel.app/signup", userData);

      toast.success("Signed in with Google!");
      navigate('/');
    } catch (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
        Create Your Account
      </h2>
      <p className="px-4 text-center">
        Already have an account?{" "}
        <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-400"
          >
            <option value="">-- Select Role --</option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block font-medium mb-1">Profile Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="w-full"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 mt-2 rounded-full object-cover mx-auto border-2 border-green-500"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">or continue with</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}

export default SignUp;
