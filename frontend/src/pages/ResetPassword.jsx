import { useState } from "react";
import "./../index.css";
import { userBaseUrl } from "../axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Assumes a route like <Route path="/reset-password/:token" element={<ResetPassword />} />
const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ Password: "", confirmPassword: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [linkInvalid, setLinkInvalid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!token) {
            setLinkInvalid(true);
            return;
        }

        if (form.Password.length < 8) {
            const message = "Password must be at least 8 characters.";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        if (form.Password !== form.confirmPassword) {
            const message = "Passwords do not match";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await userBaseUrl.post(`/reset-password/${token}`, {
                Password: form.Password,
            });
            if (data.success) {
                toast.success(data.message || "Password updated. Please log in.");
                navigate("/login");
            } else {
                const message = data.message || "This link may be invalid or expired.";
                setErrorMessage(message);
                toast.error(message);
            }
        } catch (error) {
            console.error("reset password error", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || "This link may be invalid or expired.";
                setErrorMessage(message);
                toast.error(message);
                if (status === 400 || status === 404) {
                    setLinkInvalid(true);
                }
            } else if (error.request) {
                const message = "Could not reach the server. Check your connection and try again.";
                setErrorMessage(message);
                toast.error(message);
            } else {
                const message = "Something went wrong. Please try again.";
                setErrorMessage(message);
                toast.error(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1B1E] flex flex-col">
            <nav className="flex items-center justify-between px-10 py-5 bg-[#0D1B1E] border-b border-white/10">
                <div className="text-2xl font-bold text-[#F4F7BE] tracking-tight">
                    Workout <span className="text-[#904C77]">Tracker</span>
                </div>
            </nav>

            <Toaster />
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md bg-[#132327] border border-white/10 rounded-2xl p-10">
                    <h1 className="text-3xl font-bold text-[#F4F7BE] mb-1">Set a new password</h1>
                    <p className="text-[#BBD5ED]/70 text-sm mb-8">Choose a new password for your account</p>

                    {errorMessage && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-[#904C77]/10 border border-[#904C77]/40 text-[#e2a9c4] text-sm">
                            {errorMessage}
                        </div>
                    )}

                    {linkInvalid ? (
                        <div className="px-4 py-3 rounded-lg bg-[#0D1B1E] border border-white/10 text-[#BBD5ED] text-sm">
                            This reset link is invalid or has expired. Request a new one from the forgot password page.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">New password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={form.Password}
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
                                <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">Confirm new password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    minLength={8}
                                    className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 w-full bg-[#904C77] hover:bg-[#a15a87] disabled:bg-[#904C77]/50 disabled:cursor-not-allowed text-[#F4F7BE] font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isSubmitting ? "Updating..." : "Update password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
