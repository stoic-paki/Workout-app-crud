import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

const JWT_KEY = process.env.SECRET_KEY

export const authorizationToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        // Check header exists and is properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided", success: false })
        } 

        const token = authHeader.split(" ")[1]

        // Extra safety: handle "Bearer " with nothing after it
        if (!token) {
            return res.status(401).json({ message: "Malformed token", success: false })
        }

        const verifiedToken = jwt.verify(token, JWT_KEY)

        const verifiedUser = await User.findOne({ Email: verifiedToken?.email }).select("-Password")

        if (!verifiedUser) {
            return res.status(401).json({ message: "User no longer exists", success: false })
        }

        req.user = verifiedUser
        next()

    } catch (error) {
        console.error("Auth middleware error:", error.message)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired, please log in again", success: false })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token", success: false })
        }

        return res.status(500).json({ message: "Server error during authentication", success: false })
    }
}