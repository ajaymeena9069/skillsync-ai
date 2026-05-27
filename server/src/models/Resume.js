import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
    cloudinaryId: {
      type: String,
      default: "",
    },
    extractedText: {
      type: String,
      default: "",
    },
    parsedSkills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "Not specified",
    },
    education: {
      type: [
        {
          degree: { type: String, default: "" },
          institution: { type: String, default: "" },
          year: { type: String, default: "" },
          type: { type: String, enum: ["degree", "school"], default: "degree" },
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          name: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for faster queries
resumeSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model("Resume", resumeSchema);
