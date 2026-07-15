import mongoose from "mongoose";

const doneTransactionSchema= new mongoose.Schema(
    {
        Symbol:{
            type:String,
            required:true
        },
        Price:{
            type:Number,
            required:true
        },
        profit:{
            type:Number,
            required:true
        },
        Quantity:{
            type:Number,
            required:true
        },
        Timestamp:{
            type:Date,
            default:Date.now
        }
    }
);


export default mongoose.model("DoneTransaction",doneTransactionSchema);