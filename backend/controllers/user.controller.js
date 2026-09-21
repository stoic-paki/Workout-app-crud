import User from "../model/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secretKey = process.env.SECRET_KEY;

export const handleSignup = async (req, res) => {
    const body = req.body

    // checking to see if fields are met
    if (!body?.FirstName || !body?.Email || !body?.Password) {
        return res.status(400).json({ message: "Fill all fields", status: false })
    }

    const userExistsCheck = await User.findOne({ Email: body.Email })
    if (userExistsCheck) {
        console.log("i ran mutha fucka")
        return res.status(409).json({ message: "Email already in use", status: false });
    }

    try {
        const saltCount = 10
        const hashedPassword = await bcrypt.hash(body.Password, saltCount)
        const signUp = await User.create({ ...body, Password: hashedPassword })

        if (signUp) {
            return res.status(201).json({ message: "user created successfully", success: true, id: signUp?._id })
        }
        return res.status(400).json({ message: "user could not be created", success: false })


    } catch (error) {
        return res.status(500).json({ message: error.message, status: false })

    }
}

// handle login

export const handleLogin = async (req, res) => {
    const body = req.body
    try {
        if (!body.Email || !body.Password) {
            return res.status(400).json({ message: "please enter email and password", success: false })

        }

        // checking to see if the user exists. 

        const user = await User.findOne({ Email: body.Email })
        if (!user) {
            return res.status(400).json({ message: "user doesn't exist", success: false })
        }


        // checking to see if passwords match
        const isPasswordMatched = await bcrypt.compare(body.Password, user.Password)
        console.log('password matched', isPasswordMatched)
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Password doesn't match", success: false })
        }

        // creating the token to check
        const token = jwt.sign({ email: user?.Email, id: user?._id }, secretKey)
        return res.status(200).json({ message: "user logged in success", success: true, token: token })



    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message, success: false })
    }
}