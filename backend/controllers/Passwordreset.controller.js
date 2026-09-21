import crypto from "crypto";
import bcrypt from "bcrypt";
import { transporter } from "../config/mailer.js";
import User from "../model/user.model.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes

// POST /forgot-password  { Email }
export const forgotPassword = async (req, res) => {
    const { Email } = req.body;

    if (!Email || !EMAIL_REGEX.test(Email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    // This generic message is sent for both "user not found" and success,
    // so the form can't be used to check which emails are registered
    const genericResponse = {
        success: true,
        message: "If that email is registered, a reset link has been sent.",
    };

    let user;
    try {
        user = await User.findOne({ Email });
    } catch (error) {
        console.error("forgotPassword: database lookup failed", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    if (!user) {
        return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_TTL_MS;

    try {
        await user.save();
    } catch (error) {
        console.error("forgotPassword: failed to save reset token", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.Email,
            subject: "Reset your Workout Tracker password",
            html: `
                <p>Hi ${user.FirstName || ""},</p>
                <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, you can ignore this email.</p>
            `,
        });
    } catch (error) {
        // Email failed to send, so roll back the token rather than leaving a dead one on the user
        console.error("forgotPassword: failed to send email", error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save().catch((saveError) => {
            console.error("forgotPassword: failed to roll back token after email failure", saveError);
        });
        return res.status(502).json({ success: false, message: "Could not send the reset email. Please try again shortly." });
    }

    return res.json(genericResponse);
};

// POST /reset-password/:token  { Password }
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { Password } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: "Missing reset token." });
    }

    if (!Password || Password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let user;
    try {
        user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
    } catch (error) {
        console.error("resetPassword: database lookup failed", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    if (!user) {
        return res.status(400).json({ success: false, message: "This link is invalid or has expired." });
    }

    try {
        user.Password = await bcrypt.hash(Password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    } catch (error) {
        console.error("resetPassword: failed to update password", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }

    return res.json({ success: true, message: "Password updated. Please log in." });
};