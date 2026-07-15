import mongoose from "mongoose";

const transactionSchema= new mongoose.Schema(
    {
        Symbol:{
            type:String,
            required:true
        },
        Price:{
            type:Number,
            required:true
        },
        ltp:{
            type:Number,
            default:0
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

export default mongoose.model("Transaction",transactionSchema);