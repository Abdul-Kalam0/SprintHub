import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
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
    name: 1,
    owner: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Workspace", workspaceSchema);
