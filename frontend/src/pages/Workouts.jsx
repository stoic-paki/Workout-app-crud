// import { useEffect, useState } from "react";
// import AddWorkoutModal from "../components/AddWorkoutModal";
// import { WorkoutBaseUrl } from "../axiosInstance";

// const WorkoutList = () => {
//   // 1. Initial state
//   const [workouts, setWorkouts] = useState([]);

//   // Modal visibility state
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // If this is null -> modal is in "add" mode.
//   // If it holds a workout object -> modal is in "edit" mode, pre-filled with this data.
//   const [editingWorkout, setEditingWorkout] = useState(null);

//   // 2. CREATE Handler
//   const handleAddWorkout = async (formData) => {
//     try {
//       const { data } = await WorkoutBaseUrl.post("/addworkout", formData);

//       if (data?.success) {
//         // Use the workout the server actually created (real _id from Mongo),
//         // not a locally faked one.
//         setWorkouts((prev) => [...prev, data.workout]);
//         alert("Workout added successfully!");
//         closeModal();
//       } else {
//         alert(data?.message || "Could not add workout.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error?.response?.data?.message || "Something went wrong while adding the workout.");
//     }
//   };

//   // 3. UPDATE Handler
//   const handleUpdateWorkout = async (formData) => {
//     try {
//       // Your PUT route reads the id from req.body, so it has to be included here.
//       const payload = { ...formData, _id: editingWorkout._id };
//       const { data } = await WorkoutBaseUrl.put("/updateworkout", payload);

//       if (data?.success) {
//         setWorkouts((prev) =>
//           prev.map((item) => (item._id === data.data._id ? data.data : item))
//         );
//         alert("Workout updated successfully!");
//         closeModal();
//       } else {
//         alert(data?.message || "Could not update workout.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error?.response?.data?.message || "Something went wrong while updating the workout.");
//     }
//   };

//   // Single entry point the modal calls on submit.
//   // The parent decides whether that means "add" or "update".
//   const handleSaveWorkout = (formData) => {
//     if (editingWorkout) {
//       handleUpdateWorkout(formData);
//     } else {
//       handleAddWorkout(formData);
//     }
//   };

//   // 4. DELETE Handler
//   const handleDeleteWorkout = async (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this workout?");
//     if (!confirmed) return;

//     try {
//       // axios.delete's second argument is a config object, so the body
//       // has to go under "data" — it isn't the second positional arg like post/put.
//       const { data } = await WorkoutBaseUrl.delete("/deleteworkout", {
//         data: { _id: id },
//       });

//       if (data?.success) {
//         setWorkouts((prev) => prev.filter((item) => item._id !== id));
//         alert("Workout deleted successfully!");
//       } else {
//         alert(data?.message || "Could not delete workout.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error?.response?.data?.message || "Something went wrong while deleting the workout.");
//     }
//   };

//   // Opens the modal in "edit" mode, pre-filled with the clicked workout
//   const handleEditClick = (workout) => {
//     setEditingWorkout(workout);
//     setIsModalOpen(true);
//   };

//   // Opens the modal in "add" mode
//   const handleAddClick = () => {
//     setEditingWorkout(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingWorkout(null);
//   };

//   // 5. getting the workouts
//   const getWorkoutsList = async () => {
//     try {
//       const { data } = await WorkoutBaseUrl.get("/getworkouts");
//       setWorkouts(data?.workoutList || []);
//     } catch (error) {
//       console.error(error);
//       alert(error?.response?.data?.message || "Could not load workouts.");
//     }
//   };

//   useEffect(() => {
//     getWorkoutsList();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0D1B1E] pt-24 px-4 sm:px-8 pb-12">
//       {/* Grid of workout cards */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {workouts.map((item) => (
//           <div
//             key={item._id}
//             className="bg-[#132326] border border-[#846B8A]/40 rounded-xl p-5 shadow-md flex flex-col justify-between group hover:border-[#846B8A] transition-colors"
//           >
//             <div>
//               {/* Card Header: Name + Action Buttons */}
//               <div className="flex items-start justify-between gap-2 mb-2">
//                 <h3 className="text-lg font-bold text-[#F4F7BE] leading-snug">
//                   {item.exerciseName}
//                 </h3>

//                 {/* Action Buttons Container */}
//                 <div className="flex items-center gap-1 shrink-0">
//                   {/* Edit Button */}
//                   <button
//                     onClick={() => handleEditClick(item)}
//                     type="button"
//                     title="Edit Workout"
//                     className="p-1.5 text-[#BBD5ED] hover:text-[#F4F7BE] hover:bg-[#846B8A]/30 rounded-md transition-colors"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.8}
//                       stroke="currentColor"
//                       className="w-4 h-4"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
//                       />
//                     </svg>
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDeleteWorkout(item._id)}
//                     type="button"
//                     title="Delete Workout"
//                     className="p-1.5 text-[#904C77] hover:text-red-400 hover:bg-[#904C77]/20 rounded-md transition-colors"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.8}
//                       stroke="currentColor"
//                       className="w-4 h-4"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Stats Row */}
//               <div className="flex gap-4 text-sm text-[#BBD5ED] mt-3">
//                 <p>
//                   <span className="font-semibold text-[#F4F7BE]">{item.sets}</span> Sets
//                 </p>
//                 <p>
//                   <span className="font-semibold text-[#F4F7BE]">{item.reps}</span> Reps
//                 </p>
//               </div>
//             </div>

//             {/* Date Footer */}
//             <p className="text-xs text-[#846B8A] mt-4">
//               {new Date(item.date).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Floating Add Button */}
//       <button
//         onClick={handleAddClick}
//         type="button"
//         className="fixed bottom-6 right-6 w-14 h-14 bg-[#904C77] hover:bg-[#846B8A] text-[#F4F7BE] rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-[1000]"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2.5}
//           stroke="currentColor"
//           className="w-7 h-7"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//         </svg>
//       </button>

//       {/* Add / Edit Workout Modal (same component, driven by editingWorkout) */}
//       <AddWorkoutModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onSave={handleSaveWorkout}
//         editingWorkout={editingWorkout}
//       />
//     </div>
//   );
// };

// export default WorkoutList;
import { useEffect, useState } from "react";
import AddWorkoutModal from "../components/AddWorkoutModal";
import { WorkoutBaseUrl } from "../axiosInstance";
import { toast, Toaster } from "react-hot-toast";

const WorkoutList = () => {
  // 1. Initial state
  const [workouts, setWorkouts] = useState([]);

  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If this is null -> modal is in "add" mode.
  // If it holds a workout object -> modal is in "edit" mode, pre-filled with this data.
  const [editingWorkout, setEditingWorkout] = useState(null);

  // 2. CREATE Handler
  const handleAddWorkout = async (formData) => {
    try {
      const { data } = await WorkoutBaseUrl.post("/addworkout", formData);

      if (data?.success) {
        // Use the workout the server actually created (real _id from Mongo),
        // not a locally faked one.
        setWorkouts((prev) => [...prev, data.workout]);
        toast.success("Workout added successfully!");
        closeModal();
      } else {
        toast.error(data?.message || "Could not add workout.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong while adding the workout.");
    }
  };

  // 3. UPDATE Handler
  const handleUpdateWorkout = async (formData) => {
    try {
      // Your PUT route reads the id from req.body, so it has to be included here.
      const payload = { ...formData, _id: editingWorkout._id };
      const { data } = await WorkoutBaseUrl.put("/updateworkout", payload);

      if (data?.success) {
        setWorkouts((prev) =>
          prev.map((item) => (item._id === data.data._id ? data.data : item))
        );
        toast.success("Workout updated successfully!");
        closeModal();
      } else {
        toast.error(data?.message || "Could not update workout.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong while updating the workout.");
    }
  };

  // Single entry point the modal calls on submit.
  // The parent decides whether that means "add" or "update".
  const handleSaveWorkout = (formData) => {
    if (editingWorkout) {
      handleUpdateWorkout(formData);
    } else {
      handleAddWorkout(formData);
    }
  };

  // 4. DELETE Handler
  const handleDeleteWorkout = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this workout?");
    if (!confirmed) return;

    try {
      // axios.delete's second argument is a config object, so the body
      // has to go under "data" — it isn't the second positional arg like post/put.
      const { data } = await WorkoutBaseUrl.delete("/deleteworkout", {
        data: { _id: id },
      });

      if (data?.success) {
        setWorkouts((prev) => prev.filter((item) => item._id !== id));
        toast.success("Workout deleted successfully!");
      } else {
        toast.error(data?.message || "Could not delete workout.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong while deleting the workout.");
    }
  };

  // Opens the modal in "edit" mode, pre-filled with the clicked workout
  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  // Opens the modal in "add" mode
  const handleAddClick = () => {
    setEditingWorkout(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(null);
  };

  // 5. getting the workouts
  const getWorkoutsList = async () => {
    try {
      const { data } = await WorkoutBaseUrl.get("/getworkouts");
      setWorkouts(data?.workoutList || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not load workouts.");
    }
  };

  useEffect(() => {
    getWorkoutsList();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1B1E] pt-24 px-4 sm:px-8 pb-12">
      <Toaster />
      {/* Grid of workout cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((item) => (
          <div
            key={item._id}
            className="bg-[#132326] border border-[#846B8A]/40 rounded-xl p-5 shadow-md flex flex-col justify-between group hover:border-[#846B8A] transition-colors"
          >
            <div>
              {/* Card Header: Name + Action Buttons */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-[#F4F7BE] leading-snug">
                  {item.exerciseName}
                </h3>

                {/* Action Buttons Container */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(item)}
                    type="button"
                    title="Edit Workout"
                    className="p-1.5 text-[#BBD5ED] hover:text-[#F4F7BE] hover:bg-[#846B8A]/30 rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteWorkout(item._id)}
                    type="button"
                    title="Delete Workout"
                    className="p-1.5 text-[#904C77] hover:text-red-400 hover:bg-[#904C77]/20 rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-4 text-sm text-[#BBD5ED] mt-3">
                <p>
                  <span className="font-semibold text-[#F4F7BE]">{item.sets}</span> Sets
                </p>
                <p>
                  <span className="font-semibold text-[#F4F7BE]">{item.reps}</span> Reps
                </p>
              </div>
            </div>

            {/* Date Footer */}
            <p className="text-xs text-[#846B8A] mt-4">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddClick}
        type="button"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#904C77] hover:bg-[#846B8A] text-[#F4F7BE] rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-[1000]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Add / Edit Workout Modal (same component, driven by editingWorkout) */}
      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveWorkout}
        editingWorkout={editingWorkout}
      />
    </div>
  );
};

export default WorkoutList;
