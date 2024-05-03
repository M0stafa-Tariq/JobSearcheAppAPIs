import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: [Number],
      required: true,
      length: 2,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    companyHR: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);
export default Company;
