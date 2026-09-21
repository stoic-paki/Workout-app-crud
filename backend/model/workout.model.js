import mongoose from "mongoose";
 
const workoutSchema = new mongoose.Schema(
    {
        exerciseName: {
            type: String,
            required: true,
        },
        reps: {
            type:Number,
            required: true,
        },
        sets: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true }
);
 
const Workout = mongoose.model("Workouts", workoutSchema);
 
export default Workout;