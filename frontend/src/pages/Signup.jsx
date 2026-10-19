import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to sign up");
      }

      const data = await res.json();
      console.log("Signup successful:", data);
      
      // 👇 Navigate directly to Login page after successful signup
     toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupContainer">
      <AuthLayout
        title="Create your account"
        subtitle="Start creating polls in seconds"
        footer={
          <>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {serverError}
            </div>
          )}

          <AuthInput
            id="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            error={errors.name}
            autoComplete="name"
          />

          <AuthInput
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            error={errors.password}
            autoComplete="new-password"
          />

          <AuthButton loading={loading}>Create Account</AuthButton>

          <p className="text-xs text-gray-500 text-center">
            By signing up you agree to our{" "}
            <Link to="/terms" className="text-indigo-600 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </AuthLayout>
    </div>
  );
};

export default Signup;