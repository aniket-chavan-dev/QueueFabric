import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { loginStart, loginSuccess, loginFailure } from "../slice/authSlice";
import apiClient from "@/app/apiClient";
import AuthCard from "@/features/auth/components/AuthCard";
import { useNavigate } from "react-router-dom";
import { type LoginResponse } from "../types/authTypes";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    dispatch(loginStart());

    try {
      const response = await apiClient.post("/users/login/", {
        email,
        password,
      });
      console.log("response data is",response.data);
      const data : LoginResponse = response.data;
      dispatch(loginSuccess(data));
      navigate("/dashboard", { replace: true });
    } catch {
      dispatch(loginFailure());
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <AuthCard title="Login" subtitle="Welcome back">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg py-2 bg-indigo-600 text-white"
          >
            Login
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
