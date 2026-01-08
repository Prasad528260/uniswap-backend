import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    sellerId:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverId:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref:"Book",
        required:true
    },
    status:{
        type: String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    location:{
        type: String,
        default:"library"
    },
    time:{
        type: String,
        default:"1:00 pm"
    }
})

const requestModel = mongoose.model("Request", requestSchema);
export default requestModel;
