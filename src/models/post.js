import mongoose, { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const postSchema = Schema(
  {
    title: {
      type: Boolean,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
// postSchema.plugin(mongooseAggregatePaginate);
export const Post = mongoose.model("Post", postSchema);
