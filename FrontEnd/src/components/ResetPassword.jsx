import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `http://localhost:5050/reset-password/${token}`,
        {
          newPassword: password,
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        history.push("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error resetting password. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      
        <h2 className="text-4xl mb-10">Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-96"
              required
              minLength={6}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 w-96"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none "
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      
    </div>
  );
};

export default ResetPassword;


