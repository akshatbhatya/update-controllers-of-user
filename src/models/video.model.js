import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    duration:{
      type:String,
      default:0
    },
    isPublished:{
      type:Boolean,
      default:true
    },
    videoFile:{
      type:String,
      required:true
    },
    views:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const video = mongoose.model("video", videoSchema);
