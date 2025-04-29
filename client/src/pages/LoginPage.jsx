import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, LogIn } from "lucide-react";
import { toast } from "react-toastify";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import i2it_logo from "../assets/images/logo.png"; // Import your logo here
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${serverUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Login successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        localStorage.setItem("token", data.token);

        // Redirect based on role
        switch (data.table) {
          case "Student":
            navigate("/student-dashboard");
            break;
          case "Warden":
            navigate("/warden-dashboard");
            break;
          case "Admin":
            navigate("/admin-dashboard");
            break;
          case "Teacher":
            navigate("/teacher-dashboard");
            break;
          default:
            setError("Invalid role. Contact admin.");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Login Unsuccessful! Please try again", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200 p-4">
      <div className="bg-white w-full max-w-4xl h-auto md:h-4/5 flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden">
        {/* Back button */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </button>

        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <a
              href="https://www.isquareit.edu.in/"
              className="flex flex-col items-center text-2xl font-semibold text-black"
            >
              <img
                className="w-18 h-16 md:w-24 md:h-28 mb-2 object-contain"
                src={i2it_logo}
                alt="i2it Logo"
              />
            </a>
          </div>
          <h2 className="text-lg font-semibold">Welcome To</h2>
          <h1 className="text-blue-600 font-bold text-xl">Hope Foundation's</h1>
          <h2 className="text-gray-800 font-bold text-lg">
            INTERNATIONAL INSTITUTE OF INFORMATION TECHNOLOGY
          </h2>
          <p className="text-gray-700 mt-2">HINJAWADI, PUNE</p>
          <a
            href="https://www.isquareit.edu.in"
            className="text-blue-500 underline mt-2"
          >
            www.isquareit.edu.in
          </a>
          <div className="mt-6">
            <h3 className="text-gray-800 font-semibold">
              Educational Compliance Management System
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              A streamlined platform for managing compliances across all roles
              at I2IT
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center">
          <h2 className="text-gray-800 text-xl font-semibold mb-4 text-center">
            Sign In
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4 relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <Mail
                className="absolute right-3 top-3 text-gray-500"
                size={18}
              />
            </div>
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <Lock
                className="absolute right-3 top-3 text-gray-500"
                size={18}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in <LogIn className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
