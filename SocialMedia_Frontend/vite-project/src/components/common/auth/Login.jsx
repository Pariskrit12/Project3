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
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-14 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E11D48]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#BE123C]/10 rounded-full blur-3xl pointer-events-none"></div>

      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-3xl p-8 flex flex-col gap-6 items-center bg-[#FFF5F6]/95 backdrop-blur-sm shadow-[0_12px_48px_rgba(225,29,72,0.18)] border border-[#FECDD3] relative z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="bg-linear-to-br from-[#E11D48] to-[#FB7185] p-4 rounded-2xl shadow-[0_6px_20px_rgba(225,29,72,0.4)]">
            <Icon
              icon="solar:login-bold"
              width="32"
              height="32"
              className="text-white"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#1C0714]">Welcome back</h1>
            <p className="text-sm text-[#BE7090] mt-0.5">
              Sign in to SocialSphere
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#9F1239] uppercase tracking-wide">
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
            <label className="text-xs font-bold text-[#9F1239] uppercase tracking-wide">
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
            <p className="text-xs text-[#BE123C] font-semibold cursor-pointer hover:text-[#9F1239] transition-colors">
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
          <div className="h-px flex-1 bg-[#FECDD3]"></div>
          <span className="text-xs text-[#FDA4AF] font-medium">
            or continue with
          </span>
          <div className="h-px flex-1 bg-[#FECDD3]"></div>
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
              console.log(res.data.data);
              const user = res.data.data;
              dispatch(setUser(user));
              navigate("/");
            } catch (error) {
              console.log("Google login failed", error);
              setError?.("Google login failed");
            }
          }}
        />

        <p className="text-sm text-[#9F1239]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#E11D48] font-bold cursor-pointer hover:text-[#BE123C] transition-colors"
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
