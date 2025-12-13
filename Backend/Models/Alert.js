import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    diseaseName: { type: String, required: true },
    location: { type: String, required: true },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    numberOfReports: { type: Number, default: 0 },
    dateDetected: { type: Date, default: Date.now },
    description: { type: String },
    showBadge: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
