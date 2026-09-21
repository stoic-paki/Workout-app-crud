import { useEffect, useState } from "react";

const emptyForm = {
  exerciseName: "",
  reps: "",
  sets: "",
  date: new Date().toISOString().split("T")[0],
};

// Renamed conceptually to "Add/Edit" modal, but keeping the export name
// the same so you don't have to touch your import in WorkoutList.
const AddWorkoutModal = ({ isOpen, onClose, onSave, editingWorkout }) => {
  const [formData, setFormData] = useState(emptyForm);

  // Whenever the modal is opened, sync the form to whatever mode we're in:
  // - editingWorkout present -> pre-fill with its values (edit mode)
  // - editingWorkout null    -> reset to blank (add mode)
  useEffect(() => {
    if (!isOpen) return;

    if (editingWorkout) {
      setFormData({
        exerciseName: editingWorkout.exerciseName ?? "",
        reps: editingWorkout.reps ?? "",
        sets: editingWorkout.sets ?? "",
        date: editingWorkout.date
          ? new Date(editingWorkout.date).toISOString().split("T")[0]
          : emptyForm.date,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, editingWorkout]);

  // If the modal isn't open, don't render anything in the DOM
  if (!isOpen) return null;

  const isEditing = Boolean(editingWorkout);

  // Generic handler to update form state whenever any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Explicit validation, on top of the HTML "required" attributes.
  // "required" can be bypassed (e.g. programmatic submit), and it doesn't
  // catch things like whitespace-only text or reps/sets of 0.
  const validate = () => {
    if (!formData.exerciseName.trim()) {
      alert("Please enter an exercise name.");
      return false;
    }
    if (!formData.sets || Number(formData.sets) <= 0) {
      alert("Please enter a valid number of sets (greater than 0).");
      return false;
    }
    if (!formData.reps || Number(formData.reps) <= 0) {
      alert("Please enter a valid number of reps (greater than 0).");
      return false;
    }
    if (!formData.date) {
      alert("Please pick a date.");
      return false;
    }
    return true;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Hand the validated data up to the parent. The parent decides
    // whether this is a create (POST) or update (PUT) — this modal
    // doesn't need to know or care about the API shape.
    onSave({
      ...formData,
      exerciseName: formData.exerciseName.trim(),
      reps: Number(formData.reps),
      sets: Number(formData.sets),
    });

    // Note: we deliberately do NOT close the modal or reset the form here.
    // The parent (WorkoutList) closes it only after the API call succeeds,
    // so if the request fails, the user's input is still there to retry.
  };

  return (
    /* Blurred background overlay */
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Modal card wrapper */}
      <div className="relative w-full max-w-md bg-[#0D1B1E] border border-[#846B8A] rounded-xl p-6 shadow-2xl">
        {/* Close button (top right) */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-[#BBD5ED] hover:text-[#F4F7BE] text-xl font-bold transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-[#F4F7BE] mb-6">
          {isEditing ? "Edit Workout" : "Add New Workout"}
        </h2>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Exercise Name Input */}
          <div>
            <label className="block text-sm font-medium text-[#BBD5ED] mb-1">
              Exercise Name
            </label>
            <input
              type="text"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              required
              placeholder="e.g. Bench Press"
              className="w-full bg-[#1A2C30] border border-[#846B8A] rounded-lg px-3 py-2 text-[#F4F7BE] focus:outline-none focus:border-[#F4F7BE]"
            />
          </div>

          {/* Sets and Reps (Side-by-side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#BBD5ED] mb-1">
                Sets
              </label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                required
                min="1"
                placeholder="4"
                className="w-full bg-[#1A2C30] border border-[#846B8A] rounded-lg px-3 py-2 text-[#F4F7BE] focus:outline-none focus:border-[#F4F7BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#BBD5ED] mb-1">
                Reps
              </label>
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                required
                min="1"
                placeholder="10"
                className="w-full bg-[#1A2C30] border border-[#846B8A] rounded-lg px-3 py-2 text-[#F4F7BE] focus:outline-none focus:border-[#F4F7BE]"
              />
            </div>
          </div>

          {/* Date Picker Input */}
          <div>
            <label className="block text-sm font-medium text-[#BBD5ED] mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-[#1A2C30] border border-[#846B8A] rounded-lg px-3 py-2 text-[#F4F7BE] focus:outline-none focus:border-[#F4F7BE]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-[#904C77] hover:bg-[#846B8A] text-[#F4F7BE] font-semibold py-2 px-4 rounded-lg transition-colors active:scale-95"
          >
            {isEditing ? "Update Workout" : "Add Workout"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
