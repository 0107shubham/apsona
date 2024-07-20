"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();
  console.log("sihnin");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signin`,
        {
          email,
          password,
        }
      );

      Cookies.set("token", response.data.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("userId", response.data.user.id, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("userName", response.data.user.name, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      setMessage("Signed in successfully");
      router.push("/");

      console.log("res", response);

      // Redirect to a protected page after successful sign-in
    } catch (error) {
      setMessage(error.response?.data?.message || "Sign in failed");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies

    // Example: Check if token exists and is not expired
    if (token) {
      router.push("/"); // Redirect to signin if no token
    }

    // Check token validity here if needed
  }, [router]); // Empty dependency array ensures this effect runs only once on mount

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Sign In
          </button>

          <button
            onClick={handleSignUp}
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
          {message && (
            <p className="mt-2 text-sm text-center text-red-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
