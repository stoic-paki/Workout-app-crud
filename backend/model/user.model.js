// import mongoose from "mongoose";

// const signupSchema = new mongoose.Schema({
//     FirstName:{
//         type:String,
//         required:true,
//     },
//     LastName:{
//         type:String,
//     },
//     Email:{
//         type:String,
//         required:true
//     },
//     Password:{
//         type:String,
//         required:true,
//     }
// })

// const User = mongoose.model("users", signupSchema)

// export default User
import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
})

const User = mongoose.model("users", signupSchema)

export default User