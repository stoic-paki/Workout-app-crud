import { useState } from "react";
import './../index.css'
import { userBaseUrl } from "../axiosInstance.js";
import { useNavigate, Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"
import { Link } from "react-router-dom";

const Login = () => {
    // All hooks called unconditionally, at the top, every render
    const [loginForm, setLoginForm] = useState({
        Email: "",
        Password: "",
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Non-hook logic and early returns come AFTER all hooks are called
    const userAuth = localStorage.getItem("userAuth");
    const authUser = JSON.parse(userAuth);

    if (authUser?.isLogin) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const { data } = await userBaseUrl.post("/login", loginForm);

            if (data?.success) {
                const authData = {
                    isLogin: true,
                    token: data?.token,
                };
                localStorage.setItem("userAuth", JSON.stringify(authData));
                toast.success(data.message || "Login success");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message || "Something went wrong. Please try again.";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1B1E] flex flex-col">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-10 py-5 bg-[#0D1B1E] border-b border-white/10">
                <div className="text-2xl font-bold text-[#F4F7BE] tracking-tight">
                    Workout <span className="text-[#904C77]">Tracker</span>
                </div>
            </nav>

            {/* Login form */}
            <Toaster />
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md bg-[#132327] border border-white/10 rounded-2xl p-10">
                    <h1 className="text-3xl font-bold text-[#F4F7BE] mb-1">
                        Welcome back
                    </h1>
                    <p className="text-[#BBD5ED]/70 text-sm mb-8">
                        Log in to pick up where you left off
                    </p>

                    {errorMessage && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-[#904C77]/10 border border-[#904C77]/40 text-[#e2a9c4] text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="Email"
                                value={loginForm.Email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="Password"
                                    value={loginForm.Password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 pr-16 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#846B8A] hover:text-[#BBD5ED] transition-colors"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 w-full bg-[#904C77] hover:bg-[#a15a87] disabled:bg-[#904C77]/50 disabled:cursor-not-allowed text-[#F4F7BE] font-semibold py-3 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="flex items-center justify-between mt-5 text-sm">
                        <p className="text-[#BBD5ED]/70">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-[#904C77] hover:text-[#a15a87] font-medium">
                                Sign up
                            </Link>
                        </p>
                        <Link to="/forgot-password" className="text-[#846B8A] hover:text-[#BBD5ED] transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;