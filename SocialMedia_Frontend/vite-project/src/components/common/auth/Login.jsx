import React, { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../../services/userApi";
import { setUser } from "../../../slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      }).unwrap();
      dispatch(setUser(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-14 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF4500]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#CC3600]/10 rounded-full blur-3xl pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#1E1E1E]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(255,69,0,0.18)] border border-[#3A3A3C] relative z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#FF4500] p-4 rounded-2xl shadow-[0_6px_20px_rgba(255,69,0,0.4)]">
            <Icon
              icon="solar:login-bold"
              width="32"
              height="32"
              className="text-white"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#D7DADC]">Welcome back</h1>
            <p className="text-sm text-[#9A9A9A] mt-0.5">
              Sign in to SocialSphere
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">
              Email
            </label>
            <Input
              placeholder="your@email.com"
              type="email"
              icon="mdi:email-outline"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#A83200] uppercase tracking-wide">
              Password
            </label>
            <Input
              placeholder="••••••••"
              type="password"
              icon="carbon:password"
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>
          <div className="flex justify-end">
            <p className="text-xs text-[#CC3600] font-semibold cursor-pointer hover:text-[#A83200] transition-colors">
              Forgot password?
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium w-full text-center -mt-2">
            {error}
          </p>
        )}

        <div className="w-full">
          <Button
            name={isLoading ? "Signing in..." : "Sign In"}
            isActive={!isLoading}
            loading={isLoading}
          />
        </div>

        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-[#3A3A3C]"></div>
          <span className="text-xs text-[#9A9A9A] font-medium">
            or continue with
          </span>
          <div className="h-px flex-1 bg-[#3A3A3C]"></div>
        </div>

        <GoogleLogin
          onSuccess={async (response) => {
            try {
              const token = response.credential;
              const res = await axios.post(
                "/users/auth",
                { token },
                { withCredentials: true },
              );
              const user = res.data.data;
              dispatch(setUser(user));
              navigate("/");
            } catch (error) {
              console.log("Google login failed", error);
              setError?.("Google login failed");
            }
          }}
        />

        <p className="text-sm text-[#A83200]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#FF4500] font-bold cursor-pointer hover:text-[#CC3600] transition-colors"
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
