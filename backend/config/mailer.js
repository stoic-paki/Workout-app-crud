import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS is not set. Password reset emails will fail to send.");
}

export const transporter = nodemailer.createTransport({
    service: "gmail", // swap for your provider, or use host/port + secure for plain SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Fails fast on boot if credentials are wrong, instead of only failing on the first request
transporter.verify((error) => {
    if (error) {
        console.error("Mailer configuration error:", error.message);
    } else {
        console.log("Mailer ready to send messages");
    }
});