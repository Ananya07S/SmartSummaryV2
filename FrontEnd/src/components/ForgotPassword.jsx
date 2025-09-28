import React, { useState } from "react";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5050/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); 
      } else {
        setMessage(data.message || "Something went wrong. Try again!");
      }
    } catch (error) {
      setMessage("Server error. Please try again later!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-4xl mb-10">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-96"
          required
        />
        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
          disabled={loading} 
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
      {loading && <p className="text-gray-500 mt-2">Processing...</p>}
    </div>
  );
};

export default ForgotPassword;