"use client";

import PublicRoute from "@/components/auth/PublicRoute";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = await login(formData);
      console.log(data);
      setFormData({
        email: "",
        password: "",
      });
      alert(data.message || "Logged in successful");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <PublicRoute>
        <h1>Login page</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email..."
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter password..."
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <br />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </PublicRoute>
    </>
  );
}
