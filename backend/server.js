import express from 'express'
import cors from 'cors'
import workoutsRouter from "./routes/userWorkoutRoutes.js"
import passwordResetRoutes from"./routes/passwordResetRoutes.js"
import userRouter from "./routes/userRoutes.js"
import { authorizationToken } from './middleware/auth.middleware.js'
import connectDB from './config/databaseConnection.js'
const port = process.env.PORT || 5000

const app = express()

//running middlewares that are neccessary
app.use(express.json())

app.use(cors())

// connecting to db
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// adding routes. 
app.use("/workout", authorizationToken ,workoutsRouter)
app.use("/user", userRouter)
app.use("/user", passwordResetRoutes) 

app.get('/', (req,res)=>{
    res.send('hello world')
})

// Centralized error handler — must stay after all routes/middleware
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: "Invalid JSON in request body", success: false });
    }
     console.error(err);
    return res.status(500).json({ message: "Something went wrong", success: false });
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`app is running on port ${port}`)
  });
}

export default app;