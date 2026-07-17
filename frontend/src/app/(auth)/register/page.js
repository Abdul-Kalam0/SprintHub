"use client";

import PublicRoute from "@/components/auth/PublicRoute";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Remove confirmPassword before sending data to the backend
    const { confirmPassword, ...userData } = formData;
    try {
      setIsSubmitting(true);
      const data = await register(userData);
      console.log(data);
      alert(data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      router.replace("/login");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PublicRoute>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name..."
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter your password again..."
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>
      </PublicRoute>
    </>
  );
}
