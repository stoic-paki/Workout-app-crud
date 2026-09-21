import { useState } from "react";
import './../index.css'
import { userBaseUrl } from "../axiosInstance";
import { toast, Toaster } from "react-hot-toast"
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
    const [signupForm, setSignupForm] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Non-hook logic and early returns come AFTER all hooks are called
    const userAuth = localStorage.getItem("userAuth");
    const authUser = JSON.parse(userAuth);

    if (authUser?.isLogin) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (signupForm.Password !== signupForm.confirmPassword) {
            const message = "Passwords do not match";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        // Strip confirmPassword out — backend model doesn't have this field
        const { confirmPassword, ...payload } = signupForm;

        setIsSubmitting(true);
        try {
            const { data } = await userBaseUrl.post("/signup", payload);
            if (data.success) {
                toast.success(data.message);
                navigate('/login');
            }
        } catch (error) {
            console.error("signup Error", error);
            const message = error.response?.data?.message || "Something went wrong. Please try again.";
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

            {/* Signup form */}
            <Toaster />
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md bg-[#132327] border border-white/10 rounded-2xl p-10">
                    <h1 className="text-3xl font-bold text-[#F4F7BE] mb-1">
                        Create your account
                    </h1>
                    <p className="text-[#BBD5ED]/70 text-sm mb-8">
                        Start logging your workouts and tracking progress
                    </p>

                    {errorMessage && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-[#904C77]/10 border border-[#904C77]/40 text-[#e2a9c4] text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="FirstName"
                                value={signupForm.FirstName}
                                onChange={handleChange}
                                placeholder="Your first name"
                                required
                                className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="LastName"
                                value={signupForm.LastName}
                                onChange={handleChange}
                                placeholder="Your last name"
                                required
                                className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="Email"
                                value={signupForm.Email}
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
                                    value={signupForm.Password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    minLength={8}
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

                        <div>
                            <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={signupForm.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    minLength={8}
                                    className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 pr-16 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#846B8A] hover:text-[#BBD5ED] transition-colors"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 w-full bg-[#904C77] hover:bg-[#a15a87] disabled:bg-[#904C77]/50 disabled:cursor-not-allowed text-[#F4F7BE] font-semibold py-3 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-[#BBD5ED]/70 text-sm text-center mt-6">
                        Already have an account?{" "}
                        <a href="/login" className="text-[#904C77] hover:text-[#a15a87] font-medium">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;