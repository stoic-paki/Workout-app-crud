import { useState } from "react";
import "./../index.css";
import { userBaseUrl } from "../axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!EMAIL_REGEX.test(email)) {
            const message = "Please enter a valid email address.";
            setErrorMessage(message);
            toast.error(message);
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await userBaseUrl.post("/forgot-password", { Email: email });
            if (data.success) {
                toast.success(data.message || "Reset link sent to your email");
                setSubmitted(true);
            } else {
                // Server responded 2xx but with success: false
                const message = data.message || "Something went wrong. Please try again.";
                setErrorMessage(message);
                toast.error(message);
            }
        } catch (error) {
            console.error("forgot password error", error);

            let message;
            if (error.response) {
                // Server responded with an error status
                message = error.response.data?.message || "Something went wrong. Please try again.";
            } else if (error.request) {
                // Request went out but no response came back
                message = "Could not reach the server. Check your connection and try again.";
            } else {
                message = "Something went wrong. Please try again.";
            }

            setErrorMessage(message);
            toast.error(message);
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
                    <h1 className="text-3xl font-bold text-[#F4F7BE] mb-1">Forgot password</h1>
                    <p className="text-[#BBD5ED]/70 text-sm mb-8">
                        Enter your email and we will send you a link to reset it
                    </p>

                    {errorMessage && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-[#904C77]/10 border border-[#904C77]/40 text-[#e2a9c4] text-sm">
                            {errorMessage}
                        </div>
                    )}

                    {submitted ? (
                        <div className="px-4 py-3 rounded-lg bg-[#0D1B1E] border border-white/10 text-[#BBD5ED] text-sm">
                            If an account exists for {email}, a reset link is on its way. Check your inbox and spam folder.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#BBD5ED] mb-2">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-[#0D1B1E] border border-white/10 rounded-lg px-4 py-3 text-[#F4F7BE] placeholder-[#846B8A] focus:outline-none focus:ring-2 focus:ring-[#904C77]/60 focus:border-[#904C77] transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 w-full bg-[#904C77] hover:bg-[#a15a87] disabled:bg-[#904C77]/50 disabled:cursor-not-allowed text-[#F4F7BE] font-semibold py-3 rounded-lg transition-colors"
                            >
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </button>
                        </form>
                    )}

                    <p className="text-[#BBD5ED]/70 text-sm text-center mt-6">
                        Remembered it?{" "}
                        <Link to="/login" className="text-[#904C77] hover:text-[#a15a87] font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
