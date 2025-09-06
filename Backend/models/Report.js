import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  anonymousId: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, required: true },
  employer: { type: String, required: true },
  location: { type: String },
  description: { type: String, required: true },
  files: [{ type: String }], // stores filenames
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);//db file for storage

export default Report;
