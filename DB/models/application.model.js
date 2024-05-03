import { Schema, model } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userTechSkills: [String],
    userSoftSkills: [String],
    userResume: { secure_url: String , public_id: String },
  },
  { timestamps: true }
);

const Application = model("Application", applicationSchema);

export default Application;
