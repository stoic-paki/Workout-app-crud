import express from "express";
import { handleAddWorkout, handleWorkoutslist, handleDeleteWorkout, handleEditWorkout } from "../controllers/workouts.controller.js";

const router = express.Router();

router.get("/getworkouts", handleWorkoutslist)

router.post("/addworkout",handleAddWorkout)

router.put("/updateworkout", handleEditWorkout)

router.delete("/deleteworkout", handleDeleteWorkout)

export default router