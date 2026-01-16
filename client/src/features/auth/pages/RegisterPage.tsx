import { useState } from "react";
import apiClient from "@/app/apiClient";
import AuthCard from "@/features/auth/components/AuthCard";
import { useNavigate } from "react-router-dom";
import { type AuthError } from "../types/authTypes";


export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/users/register/", {
        email,
        password,
      });


      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please login." },
      });
    } catch (err: any) {
      const authError: AuthError = err.response?.data;

      if (authError?.email) {
        setError(authError.email[0]);
      } else if (authError?.password) {
        setError(authError.password[0]);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <AuthCard title="Create an account" subtitle="Start processing jobs in minutes">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-base"

          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
              className="input-base"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
              className="input-base"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 bg-indigo-600 text-white"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
