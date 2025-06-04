import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Mixed, required: true },
});

export default mongoose.models.Config || mongoose.model("Config", ConfigSchema);