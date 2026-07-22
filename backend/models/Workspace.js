import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

workspaceSchema.index(
  {
    owner: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Workspace", workspaceSchema);
