import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        default:"Onkar"
    },
    budget:{
        type:Number,
        default:4000,
    }
});

const User = mongoose.model("User",userSchema);

export default User;