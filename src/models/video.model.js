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
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const video = mongoose.model("video", videoSchema);
