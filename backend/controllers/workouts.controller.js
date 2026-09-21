import Workout from "../model/workout.model.js";

// Shared validation used by both add and edit, so the two routes
// can't drift apart and accept different things.
// Returns an error message string if invalid, or null if the data is fine.
const validateWorkoutInput = (body) => {
    const { exerciseName, reps, sets, date } = body;

    if (!exerciseName || typeof exerciseName !== "string" || !exerciseName.trim()) {
        return "Exercise name is required.";
    }

    if (reps === undefined || reps === null || reps === "" || Number.isNaN(Number(reps)) || Number(reps) <= 0) {
        return "Reps must be a number greater than 0.";
    }

    if (sets === undefined || sets === null || sets === "" || Number.isNaN(Number(sets)) || Number(sets) <= 0) {
        return "Sets must be a number greater than 0.";
    }

    if (date && Number.isNaN(new Date(date).getTime())) {
        return "Date is invalid.";
    }

    return null;
};

// getting all the workouts
const handleWorkoutslist = async (req, res) => {
    try {
        const workoutList = await Workout.find({})
        res.status(200).json({ message: "All workouts retrieved", success: true, workoutList: workoutList, count: workoutList.length })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

// creating a workout
const handleAddWorkout = async (req, res) => {
    try {
        const body = req.body;
        console.log("Received workout data:", body);

        const validationError = validateWorkoutInput(body);
        if (validationError) {
            return res.status(400).json({ message: validationError, success: false });
        }

        // Normalize the numbers so we're not trusting whatever type the client sent
        const workout = await Workout.create({
            ...body,
            exerciseName: body.exerciseName.trim(),
            reps: Number(body.reps),
            sets: Number(body.sets),
        });

        return res.status(201).json({ message: "Workout logged successfully", success: true, workout });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// editing a workout
const handleEditWorkout = async (req, res) => {
    try {
        const body = req.body

        if (!body._id) {
            return res.status(400).json({ message: "Workout id is required.", success: false });
        }

        const validationError = validateWorkoutInput(body);
        if (validationError) {
            return res.status(400).json({ message: validationError, success: false });
        }

        const updatePayload = {
            ...body,
            exerciseName: body.exerciseName.trim(),
            reps: Number(body.reps),
            sets: Number(body.sets),
        };

        const updated = await Workout.findByIdAndUpdate(body._id, updatePayload, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "workout not found", success: false })
        }
        res.status(201).json({ message: "workout updated successfully", success: true, data: updated })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

// delete workout controller
const handleDeleteWorkout = async (req, res) => {
    try {
        const body = req.body

        if (!body._id) {
            return res.status(400).json({ message: "Workout id is required.", success: false });
        }

        const deleted = await Workout.findByIdAndDelete(body._id)
        if (!deleted) {
            return res.status(404).json({ message: "Workout not found", success: false });
        }
        res.status(200).json({ message: "workout deleted successfully", success: true, data: deleted });

    } catch (error) {
        console.error("Error workout delete:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

export { handleAddWorkout, handleWorkoutslist, handleEditWorkout, handleDeleteWorkout }
