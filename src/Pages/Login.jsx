import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router'; // <-- import Link
import AuthContext from '../../AuthContext';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Firebase';

function Login() {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      await handleLogin(email, password);
      toast.success("Logged in successfully!");
      reset();
      navigate('/'); // ✅ redirect to home page
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Logged in as ${result.user.displayName}`);
      navigate('/'); // ✅ redirect to home page
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center text-green-600 mb-6">Login to Your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Login
        </button>
      </form>

      <div className="my-4 text-center text-gray-500">or</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
      >
        Continue with Google
      </button>

      {/* Signup Link */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/login" className="text-green-600 font-medium hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
